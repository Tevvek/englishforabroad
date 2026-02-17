export function formatPurchaseAmount(amount: number | null, currency: string | null) {
  if (amount == null || !currency) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
