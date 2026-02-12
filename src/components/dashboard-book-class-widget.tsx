import * as React from "react"

import { actions } from "astro:actions"
import { navigate } from "astro:transitions/client"
import { toast } from "sonner"

import { Calendar } from "@/components/ui/calendar"
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
import { Skeleton } from "@/components/ui/skeleton"

const KST_TIME_ZONE = "Asia/Seoul"

interface AvailableClassSlot {
  startsAtUtc: string
  endsAtUtc: string
  kstDate: string
  kstTime: string
}

interface DashboardBookClassWidgetProps {
  creditBalance: number
  initialMonthKey: string
  initialMonthAvailabilityMap: Record<string, MonthClassAvailability>
}

interface MonthClassAvailability {
  availableDates: string[]
  slotsByDate: Record<string, AvailableClassSlot[]>
}

interface SlotGroup {
  label: string
  slots: AvailableClassSlot[]
}

function formatDateKst(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value

  if (!year || !month || !day) {
    throw new Error("Failed to format KST date")
  }

  return `${year}-${month}-${day}`
}

function formatMonthKst(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value

  if (!year || !month) {
    throw new Error("Failed to format KST month")
  }

  return `${year}-${month}`
}

function getDateFromKstParts(year: string, month: string, day: string) {
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0))
}

function getTodayKstDate() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const parts = formatter.formatToParts(new Date())
  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value

  if (!year || !month || !day) {
    throw new Error("Failed to resolve current KST date")
  }

  return getDateFromKstParts(year, month, day)
}

function getKstMonthStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 12, 0, 0))
}

function getKstDateStringsForMonth(monthKey: string) {
  const [yearPart, monthPart] = monthKey.split("-")
  const year = Number(yearPart)
  const month = Number(monthPart)

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return []
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0")

    return `${yearPart}-${monthPart}-${day}`
  })
}

function addMonthsToMonthKey(monthKey: string, delta: number) {
  const [yearPart, monthPart] = monthKey.split("-")
  const year = Number(yearPart)
  const month = Number(monthPart)

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return monthKey
  }

  const date = new Date(Date.UTC(year, month - 1 + delta, 1, 12, 0, 0))

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
}

function getKstHour(kstTime: string) {
  const hour = Number(kstTime.split(":")[0])

  return Number.isNaN(hour) ? 0 : hour
}

function groupSlotsByKstPeriod(slots: AvailableClassSlot[]) {
  const groups: SlotGroup[] = [
    { label: "Early Morning", slots: [] },
    { label: "Morning", slots: [] },
    { label: "Afternoon", slots: [] },
    { label: "Evening", slots: [] },
  ]

  for (const slot of slots) {
    const hour = getKstHour(slot.kstTime)

    if (hour < 6) {
      groups[0].slots.push(slot)
      continue
    }

    if (hour < 12) {
      groups[1].slots.push(slot)
      continue
    }

    if (hour < 17) {
      groups[2].slots.push(slot)
      continue
    }

    groups[3].slots.push(slot)
  }

  return groups.filter((group) => group.slots.length > 0)
}

export function DashboardBookClassWidget({
  creditBalance,
  initialMonthKey,
  initialMonthAvailabilityMap,
}: DashboardBookClassWidgetProps) {
  const todayKstDate = React.useMemo(() => getTodayKstDate(), [])
  const currentKstMonthStart = React.useMemo(
    () => getKstMonthStart(todayKstDate),
    [todayKstDate],
  )

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(currentKstMonthStart)
  const [isSwitchingMonth, setIsSwitchingMonth] = React.useState(false)
  const [monthAvailability, setMonthAvailability] = React.useState<MonthClassAvailability>(
    initialMonthAvailabilityMap[initialMonthKey] ?? {
      availableDates: [],
      slotsByDate: {},
    },
  )
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [activeSlot, setActiveSlot] = React.useState<string | null>(null)
  const [pendingSlot, setPendingSlot] = React.useState<AvailableClassSlot | null>(null)
  const monthAvailabilityCacheRef = React.useRef<
    Record<string, MonthClassAvailability>
  >(
    initialMonthAvailabilityMap,
  )
  const monthPrefetchPromisesRef = React.useRef<
    Record<string, Promise<MonthClassAvailability>>
  >({})
  const monthRequestIdRef = React.useRef(0)
  const dialogCloseTimerRef = React.useRef<number | null>(null)

  const selectedKstDate = React.useMemo(() => {
    if (!selectedDate) {
      return null
    }

    return formatDateKst(selectedDate)
  }, [selectedDate])

  const visibleMonthKey = React.useMemo(() => formatMonthKst(visibleMonth), [visibleMonth])
  const todayKstDateKey = React.useMemo(() => formatDateKst(todayKstDate), [todayKstDate])

  const availableSlots = React.useMemo(() => {
    if (!selectedKstDate) {
      return []
    }

    return monthAvailability.slotsByDate[selectedKstDate] ?? []
  }, [monthAvailability.slotsByDate, selectedKstDate])

  const groupedSlots = React.useMemo(
    () => groupSlotsByKstPeriod(availableSlots),
    [availableSlots],
  )

  const unavailableDatesInMonth = React.useMemo(() => {
    const allDatesInMonth = getKstDateStringsForMonth(visibleMonthKey)
    const monthAvailableDates = new Set(monthAvailability.availableDates)

    return new Set(
      allDatesInMonth.filter((date) => !monthAvailableDates.has(date)),
    )
  }, [monthAvailability.availableDates, visibleMonthKey])

  const isDateUnavailable = React.useCallback(
    (date: Date) => {
      const dateKey = formatDateKst(date)

      if (dateKey < todayKstDateKey) {
        return true
      }

      const monthKey = formatMonthKst(date)
      const monthData = monthAvailabilityCacheRef.current[monthKey]

      if (monthData) {
        return !monthData.availableDates.includes(dateKey)
      }

      if (monthKey !== visibleMonthKey) {
        return true
      }

      return unavailableDatesInMonth.has(dateKey)
    },
    [todayKstDateKey, unavailableDatesInMonth, visibleMonthKey],
  )

  const prefetchSingleMonth = React.useCallback(async (monthKey: string) => {
    const cachedDates = monthAvailabilityCacheRef.current[monthKey]

    if (cachedDates) {
      return cachedDates
    }

    const existingPromise = monthPrefetchPromisesRef.current[monthKey]

    if (existingPromise) {
      return existingPromise
    }

    const requestPromise = (async () => {
      const { data, error } = await actions.getClassAvailabilityForMonth({
        month: monthKey,
      })

      if (error) {
        throw new Error(error.message)
      }

      const monthData: MonthClassAvailability = {
        availableDates: data?.availableDates ?? [],
        slotsByDate: data?.slotsByDate ?? {},
      }

      monthAvailabilityCacheRef.current[monthKey] = monthData

      return monthData
    })()

    monthPrefetchPromisesRef.current[monthKey] = requestPromise

    try {
      return await requestPromise
    } finally {
      delete monthPrefetchPromisesRef.current[monthKey]
    }
  }, [])

  const prefetchMonthBlock = React.useCallback(
    async (startMonthKey: string) => {
      const monthKeys = [0, 1, 2].map((offset) =>
        addMonthsToMonthKey(startMonthKey, offset),
      )

      return Promise.all(monthKeys.map((monthKey) => prefetchSingleMonth(monthKey)))
    },
    [prefetchSingleMonth],
  )

  const handleMonthChange = React.useCallback(
    (nextMonth: Date) => {
      setVisibleMonth(nextMonth)
      setSelectedDate(undefined)

      const nextMonthKey = formatMonthKst(nextMonth)
      const cachedDates = monthAvailabilityCacheRef.current[nextMonthKey]

      if (cachedDates) {
        setMonthAvailability(cachedDates)
        setIsSwitchingMonth(false)
        return
      }

      setIsSwitchingMonth(true)
      const requestId = monthRequestIdRef.current + 1
      monthRequestIdRef.current = requestId

      prefetchMonthBlock(nextMonthKey)
        .then(() => {
          if (monthRequestIdRef.current !== requestId) {
            return
          }

          setMonthAvailability(
            monthAvailabilityCacheRef.current[nextMonthKey] ?? {
              availableDates: [],
              slotsByDate: {},
            },
          )
          setIsSwitchingMonth(false)
        })
        .catch((error) => {
          if (monthRequestIdRef.current !== requestId) {
            return
          }

          console.error(error)
          toast.error("Unable to load month availability. Please try again.")
          setMonthAvailability({ availableDates: [], slotsByDate: {} })
          setIsSwitchingMonth(false)
        })
    },
    [prefetchMonthBlock],
  )

  const handleNextHover = React.useCallback(() => {
    prefetchMonthBlock(addMonthsToMonthKey(visibleMonthKey, 1)).catch(() => { })
  }, [prefetchMonthBlock, visibleMonthKey])

  const handlePreviousHover = React.useCallback(() => {
    prefetchMonthBlock(addMonthsToMonthKey(visibleMonthKey, -1)).catch(() => { })
  }, [prefetchMonthBlock, visibleMonthKey])

  const handleGoToToday = React.useCallback(() => {
    const todayMonthStart = getKstMonthStart(todayKstDate)

    handleMonthChange(todayMonthStart)
    setSelectedDate(todayKstDate)
  }, [handleMonthChange, todayKstDate])

  const handleSelectDate = React.useCallback(
    async (date: Date | undefined) => {
      if (!date) {
        setSelectedDate(undefined)
        return
      }

      const dateKey = formatDateKst(date)

      if (dateKey < todayKstDateKey) {
        return
      }

      const selectedMonthKey = formatMonthKst(date)
      let selectedMonthData = monthAvailabilityCacheRef.current[selectedMonthKey]

      if (!selectedMonthData) {
        setIsSwitchingMonth(true)
        const requestId = monthRequestIdRef.current + 1
        monthRequestIdRef.current = requestId

        try {
          await prefetchMonthBlock(selectedMonthKey)

          if (monthRequestIdRef.current !== requestId) {
            return
          }

          selectedMonthData = monthAvailabilityCacheRef.current[selectedMonthKey]
          setIsSwitchingMonth(false)
        } catch (error) {
          if (monthRequestIdRef.current !== requestId) {
            return
          }

          console.error(error)
          toast.error("Unable to load month availability. Please try again.")
          setIsSwitchingMonth(false)
          return
        }
      }

      if (!selectedMonthData?.availableDates.includes(dateKey)) {
        return
      }

      if (selectedMonthKey !== visibleMonthKey) {
        handleMonthChange(getKstMonthStart(date))
      }

      setSelectedDate(date)
    },
    [
      handleMonthChange,
      prefetchMonthBlock,
      todayKstDateKey,
      visibleMonthKey,
    ],
  )

  React.useEffect(() => {
    if (creditBalance < 1) {
      return
    }

    prefetchMonthBlock(visibleMonthKey).catch(console.error)
  }, [creditBalance, prefetchMonthBlock, visibleMonthKey])

  React.useEffect(() => {
    return () => {
      if (dialogCloseTimerRef.current) {
        window.clearTimeout(dialogCloseTimerRef.current)
      }
    }
  }, [])

  const handleBookSlot = React.useCallback(async () => {
    if (!pendingSlot) {
      return
    }

    const slot = pendingSlot

    if (activeSlot || creditBalance < 1) {
      return
    }

    setActiveSlot(slot.startsAtUtc)

    try {
      const { error } = await actions.bookClassSlot({
        startsAtUtc: slot.startsAtUtc,
      })

      if (error) {
        toast.error(error.message)
        setActiveSlot(null)
        return
      }

      toast.success("Class booked successfully.")
      setIsDialogOpen(false)
      setPendingSlot(null)
      await navigate("/dashboard/classes")
    } catch (error) {
      console.error(error)
      toast.error("Unable to book this class. Please try another slot.")
      setActiveSlot(null)
    }
  }, [activeSlot, creditBalance, pendingSlot])

  if (creditBalance < 1) {
    return (
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-lg font-semibold">No Credits Available</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You need at least 1 credit to book a class.
        </p>
        <p className="mt-2 text-sm font-medium">Current balance: {creditBalance} credits</p>

        <ProcessingButton
          type="button"
          variant="default"
          className="mt-4 w-full sm:w-auto"
          onClick={() => navigate("/dashboard/payments")}
        >
          Buy credits
        </ProcessingButton>
      </div>
    )
  }

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)

          if (dialogCloseTimerRef.current) {
            window.clearTimeout(dialogCloseTimerRef.current)
            dialogCloseTimerRef.current = null
          }

          if (!open && !activeSlot) {
            dialogCloseTimerRef.current = window.setTimeout(() => {
              setPendingSlot(null)
              dialogCloseTimerRef.current = null
            }, 200)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm class booking</DialogTitle>
            <DialogDescription>
              Please confirm you want to book this class slot.
            </DialogDescription>
          </DialogHeader>

          {pendingSlot && (
            <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                <span className="font-medium">Date (KST):</span> {pendingSlot.kstDate}
              </p>
              <p>
                <span className="font-medium">Start time (KST):</span> {pendingSlot.kstTime}
              </p>
              <p>
                <span className="font-medium">Credit usage:</span> 1 credit
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={Boolean(activeSlot)}
            >
              Cancel
            </Button>
            <ProcessingButton
              type="button"
              onClick={handleBookSlot}
              isProcessing={Boolean(activeSlot)}
              processingLabel="Booking class"
            >
              Confirm booking
            </ProcessingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="rounded-lg border bg-card overflow-hidden">
          <Calendar
            mode="single"
            month={visibleMonth}
            selected={selectedDate}
            onSelect={handleSelectDate}
            onMonthChange={handleMonthChange}
            onNextHover={handleNextHover}
            onPreviousHover={handlePreviousHover}
            timeZone={KST_TIME_ZONE}
            noonSafe
            loadingDays={isSwitchingMonth}
              disabled={isDateUnavailable}
            modifiers={{ unavailable: isDateUnavailable }}
            modifiersClassNames={{ unavailable: "text-muted-foreground opacity-40" }}
            startMonth={currentKstMonthStart}
            className="w-full"
          />
          <div className="border-t p-3 flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={handleGoToToday}>
              Today
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Available Times (KST)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All times shown below are on the selected KST date.
          </p>

          {isSwitchingMonth ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-full rounded-md" />
              ))}
            </div>
          ) : !selectedKstDate ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Select a date to view available slots.
            </p>
          ) : groupedSlots.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No slots available for this date.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {groupedSlots.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{group.label}</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.slots.map((slot) => (
                      <ProcessingButton
                        key={slot.startsAtUtc}
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setPendingSlot(slot)
                          setIsDialogOpen(true)
                        }}
                        disabled={Boolean(activeSlot)}
                      >
                        {slot.kstTime}
                      </ProcessingButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
