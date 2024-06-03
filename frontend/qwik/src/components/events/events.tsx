import { component$, useComputed$ } from "@builder.io/qwik";
import { useUpcomingEventsLoader } from "~/routes/(protected)/layout";
import { OutlineSSRLink } from "../ssr-links/outline-ssr";
import {
  BsCheckCircleFill,
  BsPlusSquareFill,
  BsTrash3Fill,
  BsXCircleFill,
} from "@qwikest/icons/bootstrap";
import type { z } from "@builder.io/qwik-city";
import type { UpcomingEventResponseSchema } from "~/models/Event";
import { differenceInCalendarDays, format } from "date-fns";
import { OutlineButton } from "../button/outline-button";
import { cn } from "~/lib/utils";
import { useAllEventsLoader } from "~/routes/(protected)/event/layout";
import { useEventDetailsLoader } from "~/routes/(protected)/event/[eventId]";

export const AllEvents = component$(() => {
  const events = useAllEventsLoader();
  return (
    <section class="flex max-h-56 flex-col gap-y-2 rounded-lg bg-white p-2 md:flex-1 lg:max-h-none lg:min-h-0 lg:flex-[0.6] lg:p-3">
      <h2 class="flex items-center justify-between text-base lg:text-lg">
        <span>All events</span>
        <OutlineSSRLink href="/event" class="p-1">
          <BsPlusSquareFill />
        </OutlineSSRLink>
      </h2>
      <div class="flex flex-col overflow-y-auto py-2">
        {events.value.success ? (
          events.value.data?.map(({ id, eventName, eventDate, person }) => (
            <EventCard
              key={id}
              id={id}
              eventName={eventName}
              eventDate={eventDate}
              nickName={person?.nickName || null}
              firstName={person?.firstName || null}
              lastName={person?.lastName || null}
            />
          ))
        ) : (
          <span>{events.value.errorMessage}</span>
        )}
      </div>
    </section>
  );
});

export const UpcomingEvents = component$(() => {
  const events = useUpcomingEventsLoader();
  return (
    <section class="flex max-h-56 flex-col gap-y-2 rounded-lg bg-white p-2 md:flex-1 lg:max-h-none lg:min-h-0 lg:p-3">
      <h2 class="flex items-center justify-between text-base lg:text-lg">
        <span>Your upcoming events</span>
        <OutlineSSRLink href="/event" class="p-1">
          <BsPlusSquareFill />
        </OutlineSSRLink>
      </h2>
      <div class="flex flex-col overflow-y-auto py-2">
        {events.value.success ? (
          events.value.data?.map(
            ({
              id,
              eventName,
              upcomingDate,
              nickName,
              firstName,
              lastName,
            }) => (
              <EventCard
                key={id}
                id={id}
                eventName={eventName}
                upcomingDate={upcomingDate}
                nickName={nickName}
                firstName={firstName}
                lastName={lastName}
              />
            ),
          )
        ) : (
          <span>{events.value.errorMessage}</span>
        )}
      </div>
    </section>
  );
});

interface EventCardProps extends z.infer<typeof UpcomingEventResponseSchema> {}

export const EventCard = component$(
  ({
    id,
    eventName,
    eventDate,
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

    const date = upcomingDate || eventDate;

    return (
      <a
        href={`/event/${id}`}
        class="flex items-center justify-between gap-x-2 gap-y-1 border-b-1 border-b-slate-300 p-2 text-sm hover:cursor-pointer hover:bg-havelock-blue-100"
      >
        <div class="flex flex-col gap-x-1">
          <div class="flex items-center justify-start gap-x-1 text-left">
            <span>{displayedName.value}</span>
            <strong>{eventName}</strong>
          </div>
          <div class="flex items-center justify-start gap-x-1 text-left">
            <span class="text-right">{format(date!, "do LLL, yyyy")}</span>
            {upcomingDate ? <DaysLabel upcomingDate={upcomingDate} /> : null}
          </div>
        </div>
        <div class="flex items-center">
          <OutlineButton class="p-1 text-sm md:p-2">
            <BsTrash3Fill />
          </OutlineButton>
        </div>
      </a>
    );
  },
);

interface DaysLabelProps {
  upcomingDate: Date;
}

export const DaysLabel = component$(({ upcomingDate }: DaysLabelProps) => {
  const daysRemaining = differenceInCalendarDays(upcomingDate, new Date());
  return (
    <span
      class={cn("rounded-md px-1 text-right text-xs", {
        "bg-red-100 text-red-800": daysRemaining < 7,
        "bg-yellow-100 text-yellow-800":
          daysRemaining >= 7 && daysRemaining < 14,
        "bg-green-100 text-green-800": daysRemaining >= 14,
      })}
    >
      in {daysRemaining} days
    </span>
  );
});

export const EventDetails = component$(() => {
  const event = useEventDetailsLoader();

  if (!event.value.data) {
    return <div>{event.value.errorMessage}</div>;
  }

  const { eventName, eventDate, eventDescription, isRecurring, person } =
    event.value.data;

  const displayedName = useComputed$(() => {
    if (person?.nickName) {
      return `${person.nickName}'s`;
    }
    if (person?.firstName && person.lastName) {
      return `${person.firstName} ${person.lastName}'s`;
    }
    return "Your";
  });

  return (
    <section class="relative flex h-full flex-col gap-y-4 rounded-lg bg-white p-6 text-slate-900 lg:flex-1 lg:p-8">
      <div
        class="absolute left-0 top-0 flex h-60 w-full items-end justify-start rounded-se-lg rounded-ss-lg bg-no-repeat p-6 before:absolute before:left-0 before:top-0 before:z-0 before:h-full before:w-full before:rounded-se-lg before:rounded-ss-lg before:bg-havelock-blue-950 before:bg-opacity-60 before:backdrop-blur-sm lg:p-8"
        style={{
          backgroundImage: "url('/images/events.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span class="relative z-10 text-2xl font-bold text-white sm:text-5xl">
          {displayedName.value} {eventName}
        </span>
      </div>
      <div class="flex h-full flex-col items-start gap-y-6 pt-60 font-inter">
        <label class="flex flex-col items-start gap-y-1 text-left text-xs text-slate-600 sm:text-base">
          Event Date
          <span class="text-sm text-black sm:text-lg">
            {format(eventDate, "do LLL, yyyy")}
          </span>
        </label>
        <label class="flex flex-col items-start gap-y-1 text-left text-xs text-slate-600 sm:text-base">
          Event Notes
          <div class="text-sm text-black sm:text-lg">{eventDescription}</div>
          <div class="flex items-center gap-x-1">
            <span>Annually Recurring</span>
            <span
              class={cn("flex justify-center", {
                "text-green-800": isRecurring,
              })}
            >
              {isRecurring ? <BsCheckCircleFill /> : <BsXCircleFill />}
            </span>
          </div>
        </label>
        {person ? (
          <label class="flex flex-col items-start gap-y-1 text-left text-xs text-slate-600 sm:text-base">
            Contact Details
            <span class="text-sm text-black sm:text-lg">
              {person.email}
              {person.phone ? <span> / {person.phone}</span> : null}
            </span>
          </label>
        ) : null}
      </div>
    </section>
  );
});
