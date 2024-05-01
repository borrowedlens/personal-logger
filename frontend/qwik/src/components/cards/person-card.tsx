import { component$, useComputed$ } from "@builder.io/qwik";
import { differenceInCalendarDays, format } from "date-fns";
import { type z } from "zod";
import type { EventsModel, PersonProfileModel } from "~/data/models";

interface PersonProps
  extends Omit<
    z.infer<typeof PersonProfileModel>,
    "events" | "email" | "phone"
  > {
  events: z.infer<typeof EventsModel>;
}

export const PersonCard = component$(
  ({ id, firstName, lastName, nickName, dob, events }: PersonProps) => {
    const nextEventCountdown = useComputed$(() => {
      return differenceInCalendarDays(events[0].upcomingDate, new Date());
    });

    const fullName = useComputed$(() => {
      return `${firstName} ${lastName}`;
    });

    return (
      <a
        href={`/dashboard/person/${id}`}
        class="grid grid-cols-4 items-center justify-items-start gap-x-2 rounded-lg border-l-4 border-l-havelock-blue-500 p-2 hover:cursor-pointer hover:bg-havelock-blue-300"
      >
        <span class="text-sm font-bold">{nickName}</span>
        <span class="text-xs">{fullName.value}</span>
        <span class="rounded-sm bg-havelock-blue-200 px-1 text-xs font-semibold">
          Born on: {format(dob, "dd-MM")}
        </span>
        <span class="text-xs">
          Next event in {nextEventCountdown.value} days
        </span>
      </a>
    );
  },
);
