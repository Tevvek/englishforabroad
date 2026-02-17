import * as React from "react"

import { actions } from "astro:actions"
import { navigate } from "astro:transitions/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProcessingButton } from "@/components/ui/processing-button"

interface CancelClassButtonProps {
  bookingId: string
  kstDateLabel: string
  kstTimeRangeLabel: string
  isRefundEligible: boolean
  refundWindowHours: number
}

function getCancelDescription(isRefundEligible: boolean, refundWindowHours: number) {
  if (isRefundEligible) {
    return "This cancellation is eligible for a full 1-credit refund."
  }

  return `This cancellation is within ${refundWindowHours} hours of class start, so no credit refund will be issued.`
}

export default function CancelClassButton({
  bookingId,
  kstDateLabel,
  kstTimeRangeLabel,
  isRefundEligible,
  refundWindowHours,
}: CancelClassButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isCancelling, setIsCancelling] = React.useState(false)

  const handleConfirmCancellation = React.useCallback(async () => {
    if (isCancelling) {
      return
    }

    setIsCancelling(true)

    try {
      const { data, error } = await actions.cancelClassBooking({ bookingId })

      if (error) {
        toast.error(error.message)
        setIsCancelling(false)
        return
      }

      toast.success(
        data?.refunded
          ? "Class cancelled and 1 credit refunded."
          : "Class cancelled. No credit refund for this cancellation.",
      )

      setIsDialogOpen(false)
      await navigate("/dashboard/classes")
    } catch (error) {
      console.error(error)
      toast.error("Unable to cancel class. Please try again.")
      setIsCancelling(false)
    }
  }, [bookingId, isCancelling])

  return (
    <>
      <ProcessingButton
        type="button"
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        disabled={isCancelling}
        className="w-full sm:w-auto"
      >
        Cancel class
      </ProcessingButton>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open && isCancelling) {
            return
          }

          setIsDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this class?</DialogTitle>
            <DialogDescription>
              {getCancelDescription(isRefundEligible, refundWindowHours)}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{kstDateLabel}</p>
            <p className="text-muted-foreground">{kstTimeRangeLabel} (KST)</p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCancelling}
            >
              Keep class
            </Button>
            <ProcessingButton
              type="button"
              variant="destructive"
              isProcessing={isCancelling}
              processingLabel="Cancelling class"
              onClick={handleConfirmCancellation}
            >
              Confirm cancel
            </ProcessingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
