import { component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import { ENV } from "~/lib/constants";
import { UpdateEventSchema } from "~/models/Event";
import type { BaseResponseSchema } from "~/models/Base";
import { EventDetails } from "~/components/events/events";

export const EventDetailSchema = z.object({
  eventName: z.string(),
  eventDescription: z.string().optional(),
  eventDate: z.coerce.date(),
  isRecurring: z.coerce.boolean(),
  person: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      nickName: z.string().nullable(),
      email: z.string(),
      phone: z.string().nullable(),
    })
    .nullable(),
});

export const useEventDetailsLoader = routeLoader$<
  BaseResponseSchema<z.infer<typeof EventDetailSchema>>
>(async (requestEvent) => {
  const eventId = requestEvent.params.eventId || "";
  const res = await fetch(`${ENV.PUBLIC_API_URL}/event/${eventId}`, {
    method: "GET",
    headers: requestEvent.request.headers,
  });
  if (!res.ok) {
    return requestEvent.fail(res.status, {
      data: null,
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch the event details, please refresh the page / try again later",
    });
  }
  const { data } = await res.json();
  try {
    EventDetailSchema.parse(data.event);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return requestEvent.fail(409, {
        data: null,
        errorCode: res.status,
        success: false,
        errorMessage: err.message,
      });
    }
  }
  return { errorMessage: "", errorCode: 0, success: true, data: data.event };
});

export const useUpdateEventAction = routeAction$(
  async (
    { eventName, eventDescription, eventDate, ...optionals },
    { request, params },
  ) => {
    const eventId = params.eventId || "";
    const stringifiedBody = JSON.stringify({
      eventName,
      eventDescription,
      eventDate,
      isRecurring: optionals.isRecurring ? true : false,
    });

    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key !== "content-length" && key !== "content-type") {
        headers.set(key, value);
      }
    }
    headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/event/${eventId}`, {
      method: "PATCH",
      headers: headers,
      body: stringifiedBody,
    });
    const { data } = await res.json();
    return {
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: data.eventId,
    };
  },
  zod$(UpdateEventSchema),
);

export default component$(() => {
  return <EventDetails />;
});
