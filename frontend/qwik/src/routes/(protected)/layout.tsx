import { Slot, component$ } from "@builder.io/qwik";
import {
  type RequestHandler,
  routeAction$,
  routeLoader$,
} from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";

import { Header } from "~/components/header/header";
import { ENV } from "~/lib/constants";
import type { BaseResponseSchema } from "~/models/Base";
import { UpcomingEventsSchema } from "~/models/Event";

export const onRequest: RequestHandler = async ({ request, redirect }) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/auth`, {
    method: "GET",
    headers: request.headers,
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw redirect(302, "/login");
    }
  }
};

export const PersonSchema = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string().optional(),
  phone: z.string().optional().nullable(),
  email: z.string().email(),
  events: z
    .array(
      z.object({
        id: z.number().optional(),
        eventDate: z.coerce.date(),
        eventName: z.string(),
        isRecurring: z.boolean().optional(),
      }),
    )
    .optional(),
});

export const GetPeopleSchema = z.array(PersonSchema);

export const usePeopleLoader = routeLoader$<
  BaseResponseSchema<z.infer<typeof GetPeopleSchema>>
>(async (requestEvent) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/people`, {
    method: "GET",
    headers: requestEvent.request.headers,
  });
  if (!res.ok) {
    return requestEvent.fail(res.status, {
      data: [],
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch friends, please refresh the page / try again later",
    });
  }
  const { data } = await res.json();
  try {
    GetPeopleSchema.parse(data.people);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return requestEvent.fail(409, {
        data: [],
        errorCode: 409,
        success: false,
        errorMessage:
          "Could not fetch friends, please refresh the page / try again later",
      });
    }
  }
  return { errorMessage: "", errorCode: 0, success: true, data: data.people };
});

export const useUpcomingEventsLoader = routeLoader$<
  BaseResponseSchema<z.infer<typeof UpcomingEventsSchema>>
>(async (requestEvent) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/events/upcoming`, {
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
        errorCode: 409,
        success: false,
        errorMessage:
          "Could not fetch events, please refresh the page / try again later",
      });
    }
  }
  return { errorMessage: "", errorCode: 0, success: true, data: data.events };
});

export const useLogoutAction = routeAction$(
  async (_, { request, redirect }) => {
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key !== "content-length" && key !== "content-type") {
        headers.set(key, value);
      }
    }
    headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/logout`, {
      method: "POST",
      headers: headers,
    });
    for (const [key, value] of res.headers.entries()) {
      headers.set(key, value);
    }
    const { success } = await res.json();
    if (success) {
      throw redirect(302, "/");
    }
    return { success };
  },
);

export default component$(() => {
  return (
    <>
      <Header />
      <main class="flex min-h-full w-full flex-col gap-3 bg-app-linear-gradient from-havelock-blue-400 from-50% to-havelock-blue-100 p-3 pt-20 lg:h-full lg:flex-row xl:gap-6 xl:p-6 xl:pl-64">
        <Slot />
      </main>
    </>
  );
});
