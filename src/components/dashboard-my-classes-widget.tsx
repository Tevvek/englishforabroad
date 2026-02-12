import * as React from "react"

import { actions } from "astro:actions"
import { navigate } from "astro:transitions/client"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
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

export interface MyClassesBookingItem {
  id: string
  status: "booked" | "cancelled"
  startsAtIso: string
  endsAtIso: string
  kstDateLabel: string
  kstTimeRangeLabel: string
  canCancel: boolean
  isRefundEligible: boolean
}

interface DashboardMyClassesWidgetProps {
  nextClass: MyClassesBookingItem | null
  upcomingBookings: MyClassesBookingItem[]
  cancelledBookings: MyClassesBookingItem[]
  pastBookings: MyClassesBookingItem[]
  refundWindowHours: number
}

function getStatusVariant(status: MyClassesBookingItem["status"]) {
  return status === "booked" ? "secondary" : "outline"
}

function getStatusLabel(status: MyClassesBookingItem["status"]) {
  return status === "booked" ? "Booked" : "Cancelled"
}

function getCancelDescription(booking: MyClassesBookingItem, refundWindowHours: number) {
  if (booking.isRefundEligible) {
    return "This cancellation is eligible for a full 1-credit refund."
  }

  return `This cancellation is within ${refundWindowHours} hours of class start, so no credit refund will be issued.`
}

function BookingCard({
  booking,
  refundWindowHours,
  onCancel,
  isCancelling,
}: {
  booking: MyClassesBookingItem
  refundWindowHours: number
  onCancel: (booking: MyClassesBookingItem) => void
  isCancelling: boolean
}) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold">{booking.kstDateLabel}</p>
          <p className="mt-1 text-sm text-muted-foreground">{booking.kstTimeRangeLabel} (KST)</p>
        </div>
        <Badge variant={getStatusVariant(booking.status)}>{getStatusLabel(booking.status)}</Badge>
      </div>

      {booking.status === "booked" && (
        <p className="mt-3 text-sm text-muted-foreground">
          {booking.isRefundEligible
            ? "Eligible for full refund if you cancel now."
            : `No refund for cancellations within ${refundWindowHours} hours.`}
        </p>
      )}

      {booking.canCancel && (
        <div className="mt-4">
          <ProcessingButton
            type="button"
            variant="outline"
            onClick={() => onCancel(booking)}
            disabled={isCancelling}
            className="w-full sm:w-auto"
          >
            Cancel class
          </ProcessingButton>
        </div>
      )}
    </article>
  )
}

export function DashboardMyClassesWidget({
  nextClass,
  upcomingBookings,
  cancelledBookings,
  pastBookings,
  refundWindowHours,
}: DashboardMyClassesWidgetProps) {
  const [pendingCancellation, setPendingCancellation] =
    React.useState<MyClassesBookingItem | null>(null)
  const [isCancelling, setIsCancelling] = React.useState(false)

  const handleConfirmCancellation = React.useCallback(async () => {
    if (!pendingCancellation || isCancelling) {
      return
    }

    setIsCancelling(true)

    try {
      const { data, error } = await actions.cancelClassBooking({
        bookingId: pendingCancellation.id,
      })

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

      setPendingCancellation(null)
      await navigate("/dashboard/classes")
    } catch (error) {
      console.error(error)
      toast.error("Unable to cancel class. Please try again.")
      setIsCancelling(false)
    }
  }, [isCancelling, pendingCancellation])

  return (
    <>
      <Dialog
        open={Boolean(pendingCancellation)}
        onOpenChange={(open) => {
          if (!open && !isCancelling) {
            setPendingCancellation(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this class?</DialogTitle>
            <DialogDescription>
              {pendingCancellation
                ? getCancelDescription(pendingCancellation, refundWindowHours)
                : ""}
            </DialogDescription>
          </DialogHeader>

          {pendingCancellation && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <p className="font-medium">{pendingCancellation.kstDateLabel}</p>
              <p className="text-muted-foreground">{pendingCancellation.kstTimeRangeLabel} (KST)</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingCancellation(null)}
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

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Next Class</h2>

          {!nextClass ? (
            <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              You do not have a next class yet.
            </p>
          ) : (
            <BookingCard
              booking={nextClass}
              refundWindowHours={refundWindowHours}
              onCancel={setPendingCancellation}
              isCancelling={isCancelling}
            />
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Upcoming Classes</h2>

          {upcomingBookings.length === 0 ? (
            <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              You do not have any upcoming classes.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  refundWindowHours={refundWindowHours}
                  onCancel={setPendingCancellation}
                  isCancelling={isCancelling}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Cancelled Classes</h2>

          {cancelledBookings.length === 0 ? (
            <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              You do not have any cancelled classes.
            </p>
          ) : (
            <div className="space-y-3">
              {cancelledBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  refundWindowHours={refundWindowHours}
                  onCancel={setPendingCancellation}
                  isCancelling={isCancelling}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Past Classes</h2>

          {pastBookings.length === 0 ? (
            <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              You do not have any past classes yet.
            </p>
          ) : (
            <div className="space-y-3">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  refundWindowHours={refundWindowHours}
                  onCancel={setPendingCancellation}
                  isCancelling={isCancelling}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
