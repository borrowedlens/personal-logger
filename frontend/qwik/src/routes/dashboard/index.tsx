import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import PersonCard from "~/components/cards/PersonCard";
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
    return requestEvent.fail(409, {
      data: [],
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch people, please refresh the page / try again later",
    });
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
    return requestEvent.fail(409, {
      data: [],
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch people, please refresh the page / try again later",
    });
  }
  return { errorMessage: "", errorCode: 0, success: true, data: events };
});

export default component$(() => {
  const people = usePeople();
  const events = useEvents();
  return (
    <div class="grid h-full w-full grid-cols-2 grid-rows-2 gap-6 bg-slate-200 p-6">
      <section class="flex flex-col gap-y-3 rounded-lg bg-white p-3">
        <h2>Your people</h2>
        <div class="flex flex-col gap-y-2 overflow-y-auto py-2">
          {people.value.success ? (
            people.value.data.map(({ id, name, nickName, dob, events }) => (
              <>
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
                <PersonCard
                  key={id}
                  name={name}
                  nickName={nickName}
                  dob={dob}
                  events={events}
                />
              </>
            ))
          ) : (
            <span>{people.value.errorMessage}</span>
          )}
        </div>
      </section>
      <section class="row-span-2 overflow-y-auto rounded-lg bg-white p-3">
        <h2>Your profile</h2>
        <div>
          {Array.from({ length: 100 })
            .fill("text")
            .map((_, index) => (
              <span key={index}>Hey this is just an item</span>
            ))}
        </div>
      </section>
      <section class="flex flex-col overflow-y-auto rounded-lg bg-white p-3">
        <h2>Your events</h2>
        <div>
          {events.value.success ? (
            events.value.data.map((event, index: number) => (
              <span key={index}>
                {event.eventName}: {event.eventDate.toString()}
              </span>
            ))
          ) : (
            <span>{events.value.errorMessage}</span>
          )}
        </div>
      </section>
    </div>
  );
});
