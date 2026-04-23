export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    description: "Perfect for solopreneurs starting out.",
    price: {
      amount: 0,
      variantId: "", 
      priceIds: {
        test: "",
        production: "",
      },
    },
    features: [
      "1 Staff Member",
      "Unlimited Bookings",
      "Email Notifications",
      "Basic Calendar",
    ],
  },
  {
    id: "STARTER",
    name: "Starter",
    description: "Ideal for growing stylists and small teams.",
    price: {
      amount: 6.99,
      variantId: process.env.NEXT_PUBLIC_LS_VARIANT_STARTER || "price_placeholder_growth_monthly", 
      priceIds: {
        test: process.env.NEXT_PUBLIC_LS_VARIANT_STARTER || "price_placeholder_growth_monthly",
        production: "",
      },
    },
    features: [
      "Up to 5 Staff Members",
      "Unlimited Bookings",
      "Email Notifications",
      "No Flux Branding",
      "Advanced Analytics",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    description: "The complete toolkit for full salons and gyms.",
    price: {
      amount: 14.99,
      variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PRO || "price_placeholder_unlimited_monthly",
      priceIds: {
        test: process.env.NEXT_PUBLIC_LS_VARIANT_PRO || "price_placeholder_unlimited_monthly",
        production: "",
      },
    },
    features: [
      "Unlimited Staff Members",
      "Unlimited Bookings",
      "Email Notifications",
      "Multiple Locations",
      "Priority Support",
    ],
  },
];

export const SMS_PACKS = [
  {
    id: "SMS_STARTER",
    name: "Starter Pack",
    credits: 200,
    price: 12,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_SMS_200 || "price_placeholder_sms_200",
    priceId: process.env.NEXT_PUBLIC_LS_VARIANT_SMS_200 || "price_placeholder_sms_200",
  },
  {
    id: "SMS_STANDARD",
    name: "Standard Pack",
    credits: 1000,
    price: 45,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_SMS_1000 || "price_placeholder_sms_1000",
    priceId: process.env.NEXT_PUBLIC_LS_VARIANT_SMS_1000 || "price_placeholder_sms_1000",
  },
  {
    id: "SMS_BUSINESS",
    name: "Business Pack",
    credits: 2500,
    price: 99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_SMS_2500 || "price_placeholder_sms_2500",
    priceId: process.env.NEXT_PUBLIC_LS_VARIANT_SMS_2500 || "price_placeholder_sms_2500",
  },
];
