import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { BsPlusSquareFill } from "@qwikest/icons/bootstrap";

import { Calendar } from "~/components/calendar/calendar";
import { EventCard } from "~/components/cards/event-card";
import { Header } from "~/components/header/header";
import { OutlineSSRLink } from "~/components/ssr-links/outline-ssr";
import { type BaseResponseSchema } from "~/models/Person";
import { ENV } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { UpcomingEventsSchema } from "~/models/Event";
import { format } from "date-fns";

export const useEvents = routeLoader$<
  BaseResponseSchema<z.infer<typeof UpcomingEventsSchema>>
>(async (requestEvent) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/events`, {
    method: "GET",
    headers: requestEvent.request.headers,
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
  const { data } = await res.json();
  try {
    UpcomingEventsSchema.parse(data.events);
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
  return { errorMessage: "", errorCode: 0, success: true, data: data.events };
});

export default component$(() => {
  const events = useEvents();

  const location = useLocation();

  return (
    <>
      <Header />
      <main class="grid min-h-full w-full gap-3 bg-app-linear-gradient from-havelock-blue-100 from-50% to-white p-3 pt-20 md:h-full md:grid-cols-[1fr_1fr] md:gap-6 md:p-6 md:pt-20 lg:grid-cols-[30%_auto_30%]">
        <div
          class={cn("hidden min-h-0 flex-col justify-between gap-y-3 md:flex", {
            flex: location.url.pathname === "/dashboard/",
          })}
        >
          <div class="flex flex-col gap-y-3 rounded-lg bg-white p-4">
            <Calendar
              upcomingDates={
                events.value.data
                  ? events.value.data.map((event) =>
                      format(event.upcomingDate, "dd-MM"),
                    )
                  : []
              }
            />
          </div>
          <section
            class={cn(
              "hidden min-h-0 flex-col gap-y-2 rounded-lg bg-white p-2 md:flex md:p-3",
              {
                flex: location.url.pathname === "/dashboard/",
              },
            )}
          >
            <h2 class="flex items-center justify-between text-base md:text-lg">
              <span>Your upcoming events</span>
              <OutlineSSRLink href="/dashboard/event" class="p-1">
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
        </div>
        <section
          class={cn(
            "flex flex-col gap-y-2 overflow-y-auto rounded-lg bg-white p-4",
            {
              "hidden lg:block": location.url.pathname === "/dashboard/",
            },
          )}
        >
          <Slot />
        </section>
        <section
          class={cn(
            "min-h-0 flex-col gap-y-2 overflow-y-auto rounded-lg bg-white p-4",
            {
              "hidden lg:flex": location.url.pathname !== "/dashboard/",
            },
          )}
        >
          <h2 class="text-base md:text-lg">Tasks</h2>
          <div>Coming soon!</div>
        </section>
      </main>
    </>
  );
});
