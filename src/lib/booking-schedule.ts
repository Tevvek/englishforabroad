import { Temporal } from "@js-temporal/polyfill"

const TEACHER_TIME_ZONE = "Europe/Madrid"
const STUDENT_TIME_ZONE = "Asia/Seoul"

export const CLASS_DURATION_MINUTES = 50

export interface ScheduleRule {
  weekday: number
  startMinute: number
  endMinute: number
  slotIntervalMinutes: number
  isActive: boolean
}

export interface AvailableClassSlot {
  startsAtUtc: string
  endsAtUtc: string
  kstDate: string
  kstTime: string
}

export interface MonthClassAvailability {
  availableDates: string[]
  slotsByDate: Record<string, AvailableClassSlot[]>
}

function getKstDayRange(date: Temporal.PlainDate) {
  const startZdt = Temporal.ZonedDateTime.from({
    timeZone: STUDENT_TIME_ZONE,
    year: date.year,
    month: date.month,
    day: date.day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0,
  })

  return {
    start: startZdt.toInstant(),
    end: startZdt.add({ days: 1 }).toInstant(),
  }
}

function toMinuteOfDay(hour: number, minute: number) {
  return hour * 60 + minute
}

export function getUtcRangeForKstDate(kstDate: string) {
  const date = Temporal.PlainDate.from(kstDate)
  const range = getKstDayRange(date)

  return {
    startAt: new Date(Number(range.start.epochMilliseconds)),
    endAt: new Date(Number(range.end.epochMilliseconds)),
  }
}

export function getUtcRangeForKstMonth(kstMonth: string) {
  const month = Temporal.PlainYearMonth.from(kstMonth)
  const startDate = month.toPlainDate({ day: 1 })
  const startRange = getKstDayRange(startDate)
  const endRange = getKstDayRange(startDate.add({ months: 1 }))

  return {
    startAt: new Date(Number(startRange.start.epochMilliseconds)),
    endAt: new Date(Number(endRange.start.epochMilliseconds)),
  }
}

export function getKstDatesForMonth(kstMonth: string) {
  const month = Temporal.PlainYearMonth.from(kstMonth)
  const dates: string[] = []

  for (let day = 1; day <= month.daysInMonth; day += 1) {
    dates.push(month.toPlainDate({ day }).toString())
  }

  return dates
}

export function buildMonthClassAvailability({
  kstMonth,
  rules,
  bookedStartsAt,
  nowEpochMs = Date.now(),
}: {
  kstMonth: string
  rules: ScheduleRule[]
  bookedStartsAt: Set<number>
  nowEpochMs?: number
}): MonthClassAvailability {
  const monthDates = getKstDatesForMonth(kstMonth)
  const slotsByDate: Record<string, AvailableClassSlot[]> = {}

  for (const date of monthDates) {
    const slots = buildAvailableSlotsForKstDate({
      kstDate: date,
      rules,
      bookedStartsAt,
      nowEpochMs,
    })

    if (slots.length > 0) {
      slotsByDate[date] = slots
    }
  }

  return {
    availableDates: Object.keys(slotsByDate),
    slotsByDate,
  }
}

export function buildAvailableSlotsForKstDate({
  kstDate,
  rules,
  bookedStartsAt,
  nowEpochMs = Date.now(),
}: {
  kstDate: string
  rules: ScheduleRule[]
  bookedStartsAt: Set<number>
  nowEpochMs?: number
}) {
  const date = Temporal.PlainDate.from(kstDate)
  const kstRange = getKstDayRange(date)

  const madridStart = kstRange.start
    .toZonedDateTimeISO(TEACHER_TIME_ZONE)
    .toPlainDate()
    .subtract({ days: 1 })

  const madridEnd = kstRange.end
    .toZonedDateTimeISO(TEACHER_TIME_ZONE)
    .toPlainDate()
    .add({ days: 1 })

  const slots: AvailableClassSlot[] = []

  for (
    let madridDate = madridStart;
    Temporal.PlainDate.compare(madridDate, madridEnd) <= 0;
    madridDate = madridDate.add({ days: 1 })
  ) {
    const dayRules = rules.filter(
      (rule) => rule.isActive && rule.weekday === madridDate.dayOfWeek,
    )

    for (const rule of dayRules) {
      for (
        let startMinute = rule.startMinute;
        startMinute + CLASS_DURATION_MINUTES <= rule.endMinute;
        startMinute += rule.slotIntervalMinutes
      ) {
        const startZdt = Temporal.ZonedDateTime.from({
          timeZone: TEACHER_TIME_ZONE,
          year: madridDate.year,
          month: madridDate.month,
          day: madridDate.day,
          hour: Math.floor(startMinute / 60),
          minute: startMinute % 60,
          second: 0,
          millisecond: 0,
          microsecond: 0,
          nanosecond: 0,
        })

        const startInstant = startZdt.toInstant()

        if (
          Temporal.Instant.compare(startInstant, kstRange.start) < 0 ||
          Temporal.Instant.compare(startInstant, kstRange.end) >= 0
        ) {
          continue
        }

        const startMs = Number(startInstant.epochMilliseconds)

        if (startMs <= nowEpochMs) {
          continue
        }

        if (bookedStartsAt.has(startMs)) {
          continue
        }

        const endInstant = startInstant.add({ minutes: CLASS_DURATION_MINUTES })
        const kstStart = startInstant.toZonedDateTimeISO(STUDENT_TIME_ZONE)

        slots.push({
          startsAtUtc: startInstant.toString(),
          endsAtUtc: endInstant.toString(),
          kstDate: kstStart.toPlainDate().toString(),
          kstTime: kstStart.toPlainTime().toString({ smallestUnit: "minute" }),
        })
      }
    }
  }

  slots.sort((a, b) => (a.startsAtUtc < b.startsAtUtc ? -1 : 1))

  return slots
}

export function isUtcSlotWithinSchedule({
  startsAtUtc,
  rules,
}: {
  startsAtUtc: string
  rules: ScheduleRule[]
}) {
  const instant = Temporal.Instant.from(startsAtUtc)
  const madridStart = instant.toZonedDateTimeISO(TEACHER_TIME_ZONE)
  const dayRules = rules.filter(
    (rule) => rule.isActive && rule.weekday === madridStart.dayOfWeek,
  )

  const minuteOfDay = toMinuteOfDay(madridStart.hour, madridStart.minute)

  return dayRules.some((rule) => {
    if (minuteOfDay < rule.startMinute) {
      return false
    }

    if (minuteOfDay + CLASS_DURATION_MINUTES > rule.endMinute) {
      return false
    }

    return (minuteOfDay - rule.startMinute) % rule.slotIntervalMinutes === 0
  })
}
