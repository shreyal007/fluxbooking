"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { PLANS, SMS_PACKS } from "@/config/plans";

export async function createCheckoutSession(planId: string, interval: "MONTH" | "YEAR") {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Not authenticated" };

  if ((session.user as any).role !== "ADMIN") {
    return { error: "Only administrators can manage subscriptions" };
  }

  const tenantId = (session.user as any).tenantId;
  const userEmail = session.user?.email;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) return { error: "Tenant not found" };

  const plan = PLANS.find((p) => p.id === planId);
  if (!plan || plan.id === "FREE") return { error: "Invalid plan selected" };

  // Get the correct Price ID based on the interval
  // In a real app, you would have separate Price IDs for Month vs Year in your config
  const priceId = plan.price.priceIds.test; 

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: userEmail || undefined,
      client_reference_id: tenantId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      subscription_data: {
        trial_period_days: 14, // Automatic 14-day trial
        metadata: {
          tenantId: tenantId,
        },
      },
    });

    return { url: checkoutSession.url };
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return { error: error.message || "Failed to create checkout session" };
  }
}

export async function createSMSPurchaseSession(packId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Not authenticated" };

  if ((session.user as any).role !== "ADMIN") {
    return { error: "Only administrators can purchase SMS credits" };
  }

  const tenantId = (session.user as any).tenantId;
  const userEmail = session.user?.email;

  const pack = SMS_PACKS.find((p) => p.id === packId);
  if (!pack) return { error: "Invalid SMS pack selected" };

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: userEmail || undefined,
      client_reference_id: tenantId,
      line_items: [
        {
          price: pack.priceId,
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      metadata: {
        type: "SMS_PURCHASE",
        credits: pack.credits.toString(),
        tenantId: tenantId,
      },
    });

    return { url: checkoutSession.url };
  } catch (error: any) {
    console.error("Stripe SMS Error:", error);
    return { error: error.message || "Failed to create checkout session" };
  }
}
