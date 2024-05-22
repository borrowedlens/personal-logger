import { Slot, component$ } from "@builder.io/qwik";
import {
  type RequestHandler,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { BsPlusSquareFill } from "@qwikest/icons/bootstrap";

import { Calendar } from "~/components/calendar/calendar";
import { EventCard } from "~/components/cards/event-card";
import { Header } from "~/components/header/header";
import { OutlineSSR } from "~/components/ssr-links/outline-ssr";
import { type BaseResponseSchema } from "~/models/Person";
import { ENV } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { UpcomingEventsSchema } from "~/models/Event";

export const onGet: RequestHandler = async ({ request, redirect }) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/auth`, {
    method: "GET",
    headers: request.headers,
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw redirect(302, "/");
    }
  }
};

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
      <main class="grid h-full w-full grid-rows-[auto_1fr] gap-3 bg-app-linear-gradient from-havelock-blue-100 from-50% to-white p-3 sm:grid-cols-[30%_auto_30%] md:gap-6 md:p-6 md:pt-20">
        <section
          class={cn("hidden flex-col gap-y-3 rounded-lg bg-white p-4 sm:flex", {
            flex: location.url.pathname === "/dashboard/",
          })}
        >
          <Calendar />
        </section>
        <section
          class={cn(
            "row-span-2 flex flex-col gap-y-2 overflow-y-auto rounded-lg bg-white p-4",
            {
              "hidden sm:block": location.url.pathname === "/dashboard/",
            },
          )}
        >
          <Slot />
        </section>
        <section
          class={cn("row-span-2 overflow-y-auto rounded-lg bg-white p-4", {
            "hidden sm:block": location.url.pathname === "/dashboard/",
          })}
        >
          <div>Dummy div</div>
        </section>
        <section
          class={cn(
            "hidden min-h-0 flex-col gap-y-2 rounded-lg bg-white p-2 sm:flex md:p-3",
            {
              flex: location.url.pathname === "/dashboard/",
            },
          )}
        >
          <h2 class="flex items-center justify-between text-base md:text-lg">
            <span>Your upcoming events</span>
            <OutlineSSR href="/dashboard/event" class="p-1">
              <BsPlusSquareFill />
            </OutlineSSR>
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
      </main>
    </>
  );
});
