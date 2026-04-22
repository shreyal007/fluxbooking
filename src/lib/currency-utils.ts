import { COUNTRIES } from "@/config/countries";

/**
 * Formats a numeric amount into a localized currency string based on the tenant's settings.
 * @param amount - The numeric value to format
 * @param currencyCode - The ISO currency code (e.g., USD, INR)
 * @returns A formatted string (e.g., $10.00, ₹500.00)
 */
export function formatCurrency(amount: number | string, currencyCode: string = "USD") {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    // Fallback if Intl fails
    const country = COUNTRIES.find(c => c.currency === currencyCode);
    const symbol = country?.symbol || "$";
    return `${symbol}${numericAmount.toFixed(2)}`;
  }
}
