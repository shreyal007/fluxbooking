export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    description: "Perfect for solopreneurs starting out.",
    price: {
      amount: 0,
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
    id: "GROWTH",
    name: "Growth",
    description: "Ideal for small teams and growing shops.",
    price: {
      amount: 6.99,
      priceIds: {
        test: "price_placeholder_growth_monthly",
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
    id: "UNLIMITED",
    name: "Unlimited",
    description: "Scale your business without limits.",
    price: {
      amount: 14.99,
      priceIds: {
        test: "price_placeholder_unlimited_monthly",
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
    priceId: "price_placeholder_sms_200",
  },
  {
    id: "SMS_STANDARD",
    name: "Standard Pack",
    credits: 1000,
    price: 45,
    priceId: "price_placeholder_sms_1000",
  },
  {
    id: "SMS_BUSINESS",
    name: "Business Pack",
    credits: 2500,
    price: 99,
    priceId: "price_placeholder_sms_2500",
  },
];
