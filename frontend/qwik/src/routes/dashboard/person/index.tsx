import { component$, useStore } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { CustomButton } from "~/components/button/custom-button";
import { EventInput } from "~/components/event-input/event-input";
import { CustomInput } from "~/components/input/custom-input";
import { SSRLink } from "~/components/ssr-link/ssr-link";
import { PersonProfileSchema } from "~/data/models";
import { ENV } from "~/lib/constants";

export const useAddPerson = routeAction$(
  async (
    { firstName, lastName, nickName, dob, phone, email, events },
    { request }
  ) => {
    const reqBody: z.infer<typeof PersonProfileSchema> = {
      firstName,
      lastName,
      nickName,
      dob,
      phone,
      email,
    };
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
  zod$(PersonProfileSchema)
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

  const action = useAddPerson();

  return (
    <section class="flex flex-col gap-y-4 rounded-lg bg-white text-slate-900 h-full">
      <h2 class="md:text-lg">Add Friend</h2>
      <Form
        class="grid gap-y-2 relative overflow-y-auto h-full px-2 content-start"
        action={action}
      >
        <fieldset class="flex gap-x-2 flex-col sm:flex-row gap-y-2">
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Firstname*
            <CustomInput name="firstName"></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Lastname*
            <CustomInput name="lastName"></CustomInput>
          </label>
        </fieldset>
        <fieldset class="flex gap-x-2 flex-col sm:flex-row gap-y-2">
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Nickname
            <CustomInput name="nickName"></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Date of Birth*
            <CustomInput name="dob" type="date"></CustomInput>
          </label>
        </fieldset>
        <fieldset class="flex gap-x-2 flex-col sm:flex-row gap-y-2">
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
          <EventInput
            index={0}
            name={eventName}
            date={eventDate}
            isRecurring={Boolean(eventIsRecurring)}
            description={eventDescription}
          />
        ) : null}
        {additionalEventIds.map((eventId) => (
          <EventInput key={eventId} index={eventId} />
        ))}
        <fieldset class="w-full flex items-center justify-center">
          <CustomButton
            variant="secondary"
            type="button"
            onClick$={() => {
              additionalEventIds.push(
                eventInProgress
                  ? additionalEventIds.length + 1
                  : additionalEventIds.length
              );
            }}
          >
            ADD EVENT
          </CustomButton>
        </fieldset>
        <fieldset class="flex items-center justify-between mt-2 sticky bottom-0 left-0 bg-white pt-2">
          <SSRLink href={`/dashboard/event`} variant="secondary">
            BACK
          </SSRLink>
          <CustomButton variant="primary">ADD FRIEND</CustomButton>
        </fieldset>
      </Form>
    </section>
  );
});
