import { component$, useComputed$ } from "@builder.io/qwik";
import { differenceInCalendarDays } from "date-fns";
import { type z } from "zod";
import { type EventModel } from "~/data/models";

interface EventCardProps
  extends Omit<
    z.infer<typeof EventModel>,
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

    const fullName = useComputed$(() => {
      return `${firstName} ${lastName}`;
    });

    return (
      <div class="grid grid-cols-4 items-center gap-x-2 rounded-lg border-l-4 border-l-burnt-umber-500 p-2 hover:cursor-pointer hover:bg-burnt-umber-300">
        <span class="text-sm font-bold">{eventName}</span>
        <span class="text-xs">{nickName ? nickName : fullName.value}</span>
        <span class="text-xs">{eventDescription}</span>
        <span class="text-xs">in {nextEventCountdown.value} days</span>
      </div>
    );
  },
);
