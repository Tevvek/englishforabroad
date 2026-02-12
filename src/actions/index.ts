import {
  bookClassSlot,
  cancelClassBooking,
  getClassAvailabilityForMonth,
} from "./booking"
import { freebie, freebieWatchAndLearn } from "./freebie"
import { createStripeCheckout } from "./stripe"
import { waitlist } from "./waitlist"

export const server = {
  bookClassSlot,
  cancelClassBooking,
  getClassAvailabilityForMonth,
  freebie,
  freebieWatchAndLearn,
  createStripeCheckout,
  waitlist,
}
