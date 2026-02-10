import * as React from "react"

import { actions } from "astro:actions"
import { navigate } from "astro:transitions/client"
import { toast } from "sonner"

import { ProcessingButton } from "@/components/ui/processing-button"

interface DashboardStripeCheckoutButtonProps {
  buttonText: string
}

export function DashboardStripeCheckoutButton({
  buttonText,
}: DashboardStripeCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleCheckout = React.useCallback(async () => {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      const { data, error } = await actions.createStripeCheckout()

      if (error) {
        toast.error(error.message)
        setIsProcessing(false)
        return
      }

      if (!data?.checkoutUrl) {
        toast.error("Unable to start checkout. Please try again.")
        setIsProcessing(false)
        return
      }

      await navigate(data.checkoutUrl)
    } catch (error) {
      console.error(error)
      toast.error("Unable to start checkout. Please try again.")
      setIsProcessing(false)
    }
  }, [isProcessing])

  return (
    <ProcessingButton
      type="button"
      variant="default"
      className="mt-4 w-full"
      onClick={handleCheckout}
      isProcessing={isProcessing}
      processingLabel="Redirecting to checkout"
    >
      {buttonText}
    </ProcessingButton>
  )
}
