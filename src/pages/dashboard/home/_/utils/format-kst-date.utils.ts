const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatKstDate(date: Date) {
  return dateFormatter.format(new Date(date));
}
