import { freebie, freebieWatchAndLearn } from "./freebie"
import { createStripeCheckout } from "./stripe"
import { waitlist } from "./waitlist"

export const server = {
  freebie,
  freebieWatchAndLearn,
  createStripeCheckout,
  waitlist,
}
