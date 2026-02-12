import {
  bookClassSlot,
  getClassAvailabilityForMonth,
} from "./booking"
import { freebie, freebieWatchAndLearn } from "./freebie"
import { createStripeCheckout } from "./stripe"
import { waitlist } from "./waitlist"

export const server = {
  bookClassSlot,
  getClassAvailabilityForMonth,
  freebie,
  freebieWatchAndLearn,
  createStripeCheckout,
  waitlist,
}
