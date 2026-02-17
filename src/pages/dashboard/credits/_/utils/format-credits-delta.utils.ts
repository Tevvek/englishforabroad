export function formatCreditsDelta(creditsDelta: number) {
  return creditsDelta > 0 ? `+${creditsDelta}` : `${creditsDelta}`;
}
