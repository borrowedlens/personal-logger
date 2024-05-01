import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { EventCard } from "~/components/cards/event-card";
import { PersonCard } from "~/components/cards/person-card";
import {
  type BaseResponseModel,
  PeopleModel,
  EventsModel,
} from "~/data/models";

export const usePeople = routeLoader$<
  BaseResponseModel<z.infer<typeof PeopleModel>>
>(async (requestEvent) => {
  const res = await fetch("http://localhost:3000/people", {
    method: "GET",
  });
  if (!res.ok) {
    return requestEvent.fail(res.status, {
      data: [],
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch people, please refresh the page / try again later",
    });
  }
  const people = await res.json();
  try {
    PeopleModel.parse(people);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return requestEvent.fail(409, {
        data: [],
        errorCode: res.status,
        success: false,
        errorMessage: err.message,
      });
    }
  }
  return { errorMessage: "", errorCode: 0, success: true, data: people };
});

export const useEvents = routeLoader$<
  BaseResponseModel<z.infer<typeof EventsModel>>
>(async (requestEvent) => {
  const res = await fetch("http://localhost:3000/events", {
    method: "GET",
  });
  if (!res.ok) {
    return requestEvent.fail(res.status, {
      data: [],
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch events, please refresh the page / try again later",
    });
  }
  const events = await res.json();
  try {
    EventsModel.parse(events);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return requestEvent.fail(409, {
        data: [],
        errorCode: res.status,
        success: false,
        errorMessage: err.message,
      });
    }
  }
  return { errorMessage: "", errorCode: 0, success: true, data: events };
});

export default component$(() => {
  const people = usePeople();
  const events = useEvents();

  return (
    <div class="grid h-full w-full grid-cols-2 grid-rows-2 gap-6 p-6">
      <section class="flex flex-col gap-y-3 rounded-lg bg-white p-3">
        <h2 class="text-xl">Your people</h2>
        <div class="flex flex-col gap-y-2 overflow-y-auto py-2">
          {people.value.success ? (
            people.value.data?.map(
              ({ id, firstName, lastName, nickName, dob }) => (
                <PersonCard
                  key={id}
                  id={id}
                  firstName={firstName}
                  lastName={lastName}
                  nickName={nickName}
                  dob={dob}
                  events={
                    events.value.data?.filter(
                      (event) => event.personId === id,
                    ) || []
                  }
                />
              ),
            )
          ) : (
            <span>{people.value.errorMessage}</span>
          )}
        </div>
      </section>
      <section class="row-span-2 gap-y-3 overflow-y-auto rounded-lg bg-white px-3 py-8">
        <h2 class="w-full text-center text-2xl">Profile</h2>
        <Slot />
      </section>
      <section class="flex flex-col gap-y-3 rounded-lg bg-white p-3">
        <h2 class="text-lg">Your upcoming events</h2>
        <div class="flex flex-col gap-y-2 overflow-y-auto py-2">
          {events.value.success ? (
            events.value.data?.map(
              ({
                id,
                eventName,
                eventDescription,
                upcomingDate,
                nickName,
                firstName,
                lastName,
              }) => (
                <EventCard
                  key={id}
                  eventName={eventName}
                  upcomingDate={upcomingDate}
                  eventDescription={eventDescription}
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
    </div>
  );
});
