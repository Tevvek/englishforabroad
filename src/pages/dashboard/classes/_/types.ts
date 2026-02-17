export interface ClassBookingItem {
  id: string;
  status: "booked" | "cancelled";
  startsAtIso: string;
  endsAtIso: string;
  kstDateLabel: string;
  kstTimeRangeLabel: string;
  canCancel: boolean;
  isRefundEligible: boolean;
}
