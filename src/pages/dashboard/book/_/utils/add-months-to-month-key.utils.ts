export function addMonthsToMonthKey(monthKey: string, delta: number) {
  const [yearPart, monthPart] = monthKey.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);

  if (Number.isNaN(year) || Number.isNaN(month)) {
    throw new Error("Invalid month key");
  }

  const date = new Date(Date.UTC(year, month - 1 + delta, 1, 12, 0, 0));

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
