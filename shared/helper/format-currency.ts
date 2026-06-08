/**
 * format-currency.ts
 *
 * Shared currency formatting helper.
 * Maps ISO currency codes to their symbols and formats a price value.
 *
 * @example
 * formatCurrency(120000, "NGN") // "₦120,000"
 * formatCurrency(500, "USD")    // "$500"
 */

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
  KES: "KSh",
};

export function formatCurrency(price: number, currencyCode: string): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] ?? currencyCode;
  return `${symbol}${price.toLocaleString("en-US")}`;
}
