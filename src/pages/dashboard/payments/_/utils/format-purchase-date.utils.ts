const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatPurchaseDate(unixTimestampSeconds: number) {
  return dateFormatter.format(new Date(unixTimestampSeconds * 1000));
}
