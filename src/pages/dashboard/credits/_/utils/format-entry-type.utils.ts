const entryTypeLabels: Record<string, string> = {
  purchase_grant: "Package purchase",
  booking_deduct: "Class booked",
  booking_refund: "Class refunded",
  manual_adjustment: "Manual adjustment",
};

export function formatEntryType(entryType: string) {
  return entryTypeLabels[entryType] ?? entryType;
}
