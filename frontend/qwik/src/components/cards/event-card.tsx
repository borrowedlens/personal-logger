import { component$, useComputed$ } from "@builder.io/qwik";
import { differenceInCalendarDays, format } from "date-fns";
import { type z } from "@builder.io/qwik-city";
import { type UpcomingEventSchema } from "~/data/models";

interface EventCardProps
  extends Omit<
    z.infer<typeof UpcomingEventSchema>,
    "eventDate" | "isRecurring" | "personId" | "userId" | "id"
  > {}

export const EventCard = component$(
  ({
    eventDescription,
    eventName,
    upcomingDate,
    nickName,
    firstName,
    lastName,
  }: EventCardProps) => {
    const nextEventCountdown = useComputed$(() => {
      return differenceInCalendarDays(upcomingDate, new Date());
    });

    const displayedName = useComputed$(() => {
      if (nickName) {
        return `${nickName}'s`;
      }
      if (firstName && lastName) {
        return `${firstName} ${lastName}'s`;
      }
      return "Your";
    });

    return (
      <div class="grid grid-cols-[1fr_auto] grid-rows-[1fr_auto] items-center justify-between gap-x-2 rounded-lg border-l-4 border-l-havelock-blue-700 p-2 hover:cursor-pointer hover:bg-havelock-blue-100">
        <span class="inline-flex gap-x-1 text-base md:text-lg">
          {displayedName.value}
          <span class="text-base font-bold md:text-lg">{eventName}</span>
        </span>
        <span class="text-base text-right font-bold">
          {format(upcomingDate, "do LLL")}
        </span>
        <span class="text-xs">{eventDescription}</span>
        <span class="text-xs text-right">
          in {nextEventCountdown.value} days
        </span>
      </div>
    );
  }
);
