import { component$, useComputed$ } from "@builder.io/qwik";
import { format } from "date-fns";
import { type z } from "@builder.io/qwik-city";
import { BsPencilFill } from "@qwikest/icons/bootstrap";
import { BsTrash3Fill } from "@qwikest/icons/bootstrap";
import { OutlineButton } from "../button/outline-button";
import { DaysLabel } from "../labels/days-label";
// import { OutlineSSR } from "../ssr-links/outline-ssr";
import { type UpcomingEventResponseSchema } from "~/models/Event";
import { OutlineCSRLink } from "../csr-links/outline-csr";

interface EventCardProps
  extends Omit<
    z.infer<typeof UpcomingEventResponseSchema>,
    "eventDate" | "isRecurring" | "personId" | "userId" | "eventDescription"
  > {}

export const EventCard = component$(
  ({
    id,
    eventName,
    upcomingDate,
    nickName,
    firstName,
    lastName,
  }: EventCardProps) => {
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
      <div class="flex items-center justify-between gap-x-2 gap-y-1 border-b-1 border-b-slate-300 p-2 text-sm hover:cursor-pointer hover:bg-havelock-blue-100">
        <div class="flex flex-col gap-x-1">
          <div class="flex items-center justify-start gap-x-1 text-left">
            <span>{displayedName.value}</span>
            <strong>{eventName}</strong>
          </div>
          <div class="flex items-center justify-start gap-x-1 text-left">
            <span class="text-right">{format(upcomingDate, "do LLL")}</span>
            <DaysLabel upcomingDate={upcomingDate} />
          </div>
        </div>
        <div class="row-span-2 flex items-center">
          <OutlineCSRLink
            href={`/dashboard/event/${id}?edit=true`}
            class="p-1 text-sm md:p-2"
          >
            <BsPencilFill />
          </OutlineCSRLink>
          <OutlineButton class="p-1 text-sm md:p-2">
            <BsTrash3Fill />
          </OutlineButton>
        </div>
      </div>
    );
  },
);
