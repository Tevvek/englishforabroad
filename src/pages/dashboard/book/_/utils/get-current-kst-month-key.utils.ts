const monthFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
});

export function getCurrentKstMonthKey() {
  const monthParts = monthFormatter.formatToParts(new Date());
  const currentYear = monthParts.find((part) => part.type === "year")?.value;
  const currentMonth = monthParts.find((part) => part.type === "month")?.value;

  if (!currentYear || !currentMonth) {
    throw new Error("Failed to resolve current KST month");
  }

  return `${currentYear}-${currentMonth}`;
}
