const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatEntryDate(date: Date) {
  return dateFormatter.format(new Date(date));
}
