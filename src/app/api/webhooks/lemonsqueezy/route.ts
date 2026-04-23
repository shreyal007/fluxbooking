import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "");
  const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
  const signature = Buffer.from((await headers()).get("x-signature") || "", "utf8");

  // Validate the signature
  if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
    console.error("Lemon Squeezy Webhook: Invalid Signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventName = payload.meta.event_name;
  const customData = payload.meta.custom_data;
  
  const tenantId = customData?.tenantId;
  const type = customData?.type;

  console.log(`🔔 Webhook Received: ${eventName}`, { tenantId, type });

  if (!tenantId) {
    console.error("Lemon Squeezy Webhook: No tenant ID found in custom data");
    return new NextResponse("No tenant ID found in custom data", { status: 400 });
  }

  try {
    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const attributes = payload.data.attributes;
      const variantId = attributes.variant_id.toString();
      const status = attributes.status; // active, trialing, past_due, etc.
      
      // Map variant ID to internal plan ID
      let planId = "STARTER";
      if (variantId === process.env.NEXT_PUBLIC_LS_VARIANT_PRO) {
        planId = "PRO";
      }

      console.log(`✅ Updating Subscription: Tenant ${tenantId} -> Plan ${planId} (${status})`);
      
      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          planStatus: status.toUpperCase(),
          plan: planId,
          subscriptionEndsAt: attributes.renews_at ? new Date(attributes.renews_at) : null,
        },
      });
    } else if (eventName === "order_created" && type === "SMS") {
      const variantId = payload.data.attributes.variant_id.toString();
      
      // Mapping based on environment variables
      let creditsToAdd = 0;
      if (variantId === process.env.NEXT_PUBLIC_LS_VARIANT_SMS_200) creditsToAdd = 200;
      else if (variantId === process.env.NEXT_PUBLIC_LS_VARIANT_SMS_1000) creditsToAdd = 1000;
      else if (variantId === process.env.NEXT_PUBLIC_LS_VARIANT_SMS_2500) creditsToAdd = 2500;
      else {
          console.warn(`⚠️ Unknown SMS Variant ID: ${variantId}. Adding default 200 credits.`);
          creditsToAdd = 200;
      }

      console.log(`✅ Adding SMS Credits: Tenant ${tenantId} -> +${creditsToAdd} credits`);

      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          smsCredits: {
            increment: creditsToAdd,
          },
        },
      });
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook Processing Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
