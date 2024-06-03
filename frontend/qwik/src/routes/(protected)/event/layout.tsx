import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import { AllEvents } from "~/components/events/events";
import { ENV } from "~/lib/constants";
import type { BaseResponseSchema } from "~/models/Base";

export const AllEventsSchema = z.array(
  z.object({
    id: z.number(),
    eventName: z.string(),
    eventDate: z.coerce.date(),
    isRecurring: z.boolean(),
    person: z
      .object({
        firstName: z.string(),
        lastName: z.string(),
        nickName: z.string(),
      })
      .nullable(),
  }),
);

export const useAllEventsLoader = routeLoader$<
  BaseResponseSchema<z.infer<typeof AllEventsSchema>>
>(async (requestEvent) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/events/all`, {
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
    AllEventsSchema.parse(data.events);
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

export default component$(() => {
  return (
    <>
      <AllEvents />
      <Slot />
    </>
  );
});
