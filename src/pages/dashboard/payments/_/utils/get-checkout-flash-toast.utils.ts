import type { FlashToastType } from "@/lib/flash-toast";

type CheckoutStatus = "success" | "cancel";

interface CheckoutFlashToast {
  type: FlashToastType;
  title: string;
  description: string;
}

export function getCheckoutFlashToast(checkoutStatus: CheckoutStatus): CheckoutFlashToast {
  if (checkoutStatus === "success") {
    return {
      type: "success",
      title: "Payment successful",
      description: "Your purchase was completed successfully.",
    };
  }

  return {
    type: "info",
    title: "Checkout canceled",
    description: "No charge was made.",
  };
}
