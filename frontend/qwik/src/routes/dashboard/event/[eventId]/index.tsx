import { component$, useComputed$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { EventInput } from "~/components/event-input/event-input";
import { type BaseResponseSchema } from "~/models/Person";
import { ENV } from "~/lib/constants";
import { EventDetailSchema, UpdateEventSchema } from "~/models/Event";
import { format } from "date-fns";
import { SecondarySSRLink } from "~/components/ssr-links/secondary-ssr";
import { PrimaryButton } from "~/components/button/primary-button";

export const useEventDetails = routeLoader$<
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

export const useUpdateEvent = routeAction$(
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

    request.headers.delete("content-length");
    request.headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/event/${eventId}`, {
      method: "PATCH",
      headers: request.headers,
      credentials: "include",
      body: stringifiedBody,
    });
    const { data } = await res.json();
    return { success: true, id: data.eventId };
  },
  zod$(UpdateEventSchema),
);

export default component$(() => {
  const event = useEventDetails();
  console.log("🚀 ~ event:", event.value.data);
  const location = useLocation();
  const inEditMode = location.url.searchParams.get("edit") === "true";

  const action = useUpdateEvent();

  if (!event.value.data) {
    return <div>{event.value.errorMessage}</div>;
  }

  const displayedName = useComputed$(() => {
    if (event.value.data?.person.nickName) {
      return `${event.value.data.person.nickName}'s`;
    }
    if (
      event.value.data?.person.firstName &&
      event.value.data.person.lastName
    ) {
      return `${event.value.data.person.firstName} ${event.value.data.person.lastName}'s`;
    }
    return "Your";
  });

  return (
    <>
      <h2 class="md:text-lg">
        Edit {displayedName.value} {event.value.data.eventName}
      </h2>
      <Form class="grid gap-y-2 text-slate-900" action={action}>
        <EventInput
          inEditMode={inEditMode}
          eventName={event.value.data.eventName}
          eventDate={format(event.value.data.eventDate, "yyyy-MM-dd")}
          eventDescription={event.value.data.eventDescription}
          isRecurring={event.value.data.isRecurring}
        />
        <fieldset class="mt-2 flex items-center justify-between">
          <SecondarySSRLink href="/dashboard">Back</SecondarySSRLink>
          <PrimaryButton>Save Changes</PrimaryButton>
        </fieldset>
      </Form>
    </>
  );
});
