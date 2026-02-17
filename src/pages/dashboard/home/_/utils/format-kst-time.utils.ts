const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  hour: "numeric",
  minute: "2-digit",
});

export function formatKstTime(date: Date) {
  return timeFormatter.format(new Date(date));
}
