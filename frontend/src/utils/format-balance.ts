/** Formats a token amount for display, e.g. 1234.5 → "1,234.50 MINIMA". */
export function formatBalance(amount: number, symbol = "MINIMA"): string {
  if (!Number.isFinite(amount)) return `— ${symbol}`;
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${symbol}`;
}
