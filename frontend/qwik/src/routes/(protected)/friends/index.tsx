import { component$, useStore } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  useLocation,
  type z,
  zod$,
} from "@builder.io/qwik-city";
import { PrimaryButton } from "~/components/button/primary-button";
import { SecondaryButton } from "~/components/button/secondary-button";
import { EventInput } from "~/components/event-input/event-input";
import { CustomInput } from "~/components/input/custom-input";
import { SecondarySSRLink } from "~/components/ssr-links/secondary-ssr";
import { ENV } from "~/lib/constants";
import { PersonProfileSchema } from "~/models/Person";

export const useAddPersonAction = routeAction$(
  async (
    { firstName, lastName, nickName, dob, phone, email, events },
    { request },
  ) => {
    const reqBody: z.infer<typeof PersonProfileSchema> = {
      firstName,
      lastName,
      email,
      dob,
    };
    if (nickName) {
      reqBody.nickName = nickName;
    }
    if (phone) {
      reqBody.phone = phone;
    }
    if (events) {
      reqBody.events = [
        ...events.map((event) => ({
          ...event,
          isRecurring: event.isRecurring ? event.isRecurring : false,
        })),
      ];
    }
    const stringifiedBody = JSON.stringify(reqBody);

    request.headers.delete("content-length");
    request.headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/person`, {
      method: "POST",
      headers: request.headers,
      credentials: "include",
      body: stringifiedBody,
    });
    const data = await res.json();
    return { success: true, id: data.data.personId };
  },
  zod$(PersonProfileSchema),
);

export default component$(() => {
  const location = useLocation();
  const searchParams = location.url.searchParams;
  const eventName = searchParams.get("eventName") || "";
  const eventDate = searchParams.get("eventDate") || "";
  const eventIsRecurring = searchParams.get("isRecurring") || "";
  const eventDescription = searchParams.get("eventDescription") || "";

  const eventInProgress =
    eventName || eventDate || eventIsRecurring || eventDescription;

  const additionalEventIds = useStore<Array<number>>([]);

  const action = useAddPersonAction();

  return (
    <section class="flex h-full flex-col gap-y-4 rounded-lg bg-white p-2 text-slate-900 lg:flex-1 lg:p-3">
      <h2 class="md:text-lg" id="add-friend">
        Add Friend
      </h2>
      <Form
        class="relative grid h-full content-start gap-y-6 overflow-y-auto px-2"
        action={action}
      >
        <fieldset class="flex flex-col gap-x-2 gap-y-2 sm:flex-row">
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Firstname*
            <CustomInput name="firstName"></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Lastname*
            <CustomInput name="lastName"></CustomInput>
          </label>
        </fieldset>
        <fieldset class="flex flex-col gap-x-2 gap-y-2 sm:flex-row">
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Nickname
            <CustomInput name="nickName"></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Date of Birth - We'll add this as an event for you
            <CustomInput name="dob" type="date"></CustomInput>
          </label>
        </fieldset>
        <fieldset class="flex flex-col gap-x-2 gap-y-2 sm:flex-row">
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Phone
            <CustomInput name="phone"></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Email*
            <CustomInput name="email"></CustomInput>
          </label>
        </fieldset>
        {eventInProgress ? (
          <fieldset class="rounded-md bg-havelock-blue-100 p-2">
            <EventInput
              inEditMode={true}
              index={0}
              eventName={eventName}
              eventDate={eventDate}
              isRecurring={Boolean(eventIsRecurring)}
              eventDescription={eventDescription}
            />
          </fieldset>
        ) : null}
        {additionalEventIds.map((eventId) => (
          <fieldset key={eventId} class="rounded-md bg-havelock-blue-100 p-2">
            <EventInput inEditMode={true} index={eventId} />
          </fieldset>
        ))}
        <fieldset class="flex w-full items-center justify-center">
          <SecondaryButton
            type="button"
            onClick$={() => {
              additionalEventIds.push(
                eventInProgress
                  ? additionalEventIds.length + 1
                  : additionalEventIds.length,
              );
            }}
          >
            Add Event
          </SecondaryButton>
        </fieldset>
        <fieldset class="sticky bottom-0 left-0 mt-2 flex items-center justify-between bg-white pt-2">
          <SecondarySSRLink href={`/event`}>Back</SecondarySSRLink>
          <PrimaryButton>Add Friend</PrimaryButton>
        </fieldset>
      </Form>
    </section>
  );
});
