import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  bookClassSchema,
  type BookClassFormData,
} from "@/pages/dashboard/book-class/_schemas/book-class.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [today, setToday] = React.useState<Date>(new Date());
  // Local component state for booking flow
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [timeSlots, setTimeSlots] = React.useState<any[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] =
    React.useState<boolean>(false);

  const form = useForm<BookClassFormData>({
    resolver: zodResolver(bookClassSchema),
    defaultValues: {
      notes: "",
    },
  });

  // Handle month navigation with cache-first strategy
  const handleMonthChange = React.useCallback(async (newMonth: Date) => {}, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="gap-0 p-0 flex-1">
          <CardContent className="relative p-0 md:pr-48">
            <div className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={handleMonthChange}
                disabled={(date) => {
                  // Disable past dates
                  if (date < today) return true;
                  // Disable weekends (Saturday = 6, Sunday = 0)
                  const dayOfWeek = date.getDay();
                  if (dayOfWeek === 0 || dayOfWeek === 6) return true;
                  // Disable booked dates
                  // return bookedDates.some(
                  //   (bookedDate) =>
                  //     bookedDate.toDateString() === date.toDateString()
                  // );
                  return false;
                }}
                showOutsideDays={false}
                // modifiers={{
                //   booked: bookedDates,
                // }}
                modifiersClassNames={{
                  booked: "[&>button]:line-through opacity-100",
                }}
                className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                formatters={{
                  formatWeekdayName: (date) => {
                    return date.toLocaleString("en-US", { weekday: "short" });
                  },
                }}
                components={{
                  DayButton: ({ day, modifiers, ...props }) => {
                    const dateKey = day.date.toISOString().split("T")[0];
                    // const availability = dateAvailability.get(dateKey);
                    return (
                      <CalendarDayButton
                        day={day}
                        modifiers={modifiers}
                        // availabilityLevel={availability?.level}
                        {...props}
                      />
                    );
                  },
                }}
              />
            </div>
            <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
              <div className="grid gap-2">
                {isLoadingTimeSlots ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Loading time slots...
                    </p>
                  </div>
                ) : !date ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Select a date to see available times
                    </p>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No time slots available for this date
                    </p>
                  </div>
                ) : (
                  timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={
                        selectedTime === slot.time ? "default" : "outline"
                      }
                      onClick={() =>
                        slot.isAvailable && setSelectedTime(slot.time)
                      }
                      disabled={!slot.isAvailable}
                      className="w-full shadow-none text-sm"
                      title={slot.reason || ""}
                    >
                      {slot.time}
                      {!slot.isAvailable && (
                        <span className="ml-1 text-xs opacity-70">
                          (Not available)
                        </span>
                      )}
                    </Button>
                  ))
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
            <div className="text-sm">
              {date && selectedTime ? (
                <>
                  Your meeting is booked for{" "}
                  <span className="font-medium">
                    {" "}
                    {date?.toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                  </span>
                  at <span className="font-medium">{selectedTime}</span>.
                </>
              ) : (
                <>Select a date and time for your meeting.</>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="w-full md:ml-auto md:w-auto"
            >
              Today
            </Button>
          </CardFooter>
        </Card>

        <Card className="p-6 lg:w-96 lg:flex-shrink-0">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What to Expect</h3>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <strong className="text-foreground">50-minute session</strong>{" "}
                  with one of our certified English teachers
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <strong className="text-foreground">
                    Personalized lesson plan
                  </strong>{" "}
                  tailored to your current English level
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <strong className="text-foreground">
                    Interactive materials
                  </strong>{" "}
                  including conversation practice and grammar exercises
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <strong className="text-foreground">Progress tracking</strong>{" "}
                  and homework assignments to accelerate your learning
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Class Notes (Optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Let us know if there's anything specific you'd like to focus on
            during your lesson
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional notes or learning goals</Label>
            <Textarea
              id="notes"
              placeholder="e.g., I'd like to practice business English for job interviews, work on pronunciation of specific sounds, prepare for IELTS speaking test..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This helps your teacher prepare personalized materials for your
              lesson
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={!date || !selectedTime}
              className="w-full md:w-auto md:min-w-32"
              size="lg"
              onClick={() => {}}
            >
              Book Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Your Class Booking</DialogTitle>
              <DialogDescription>
                Please review your booking details before confirming.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Date & Time
                </h4>
                <p className="text-sm">
                  {date?.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {selectedTime}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Duration
                </h4>
                <p className="text-sm">50 minutes</p>
              </div>
              {notes && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Notes
                  </h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={() => {}} disabled={isSubmitting}>
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
