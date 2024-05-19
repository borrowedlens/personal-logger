import {
  $,
  component$,
  useComputed$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { toast } from "qwik-sonner";
import { CustomButton } from "~/components/button/custom-button";
import { CustomInput } from "~/components/input/custom-input";
import { CustomSelect } from "~/components/select/custom-select";
import { SSRLink } from "~/components/ssr-link/ssr-link";
import {
  type BaseResponseSchema,
  PeopleSchema,
  EventSchema,
} from "~/data/models";
import { ENV } from "~/lib/constants";
import { setSearchParam } from "~/lib/utils";

export const usePeople = routeLoader$<
  BaseResponseSchema<z.infer<typeof PeopleSchema>>
>(async (requestEvent) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/people`, {
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
  const { data } = await res.json();
  try {
    PeopleSchema.parse(data.people);
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
  return { errorMessage: "", errorCode: 0, success: true, data: data.people };
});

export const useAddEvent = routeAction$(
  async (
    { eventName, eventDescription, eventDate, personId, ...optionals },
    { request }
  ) => {
    const stringifiedBody = JSON.stringify({
      eventName,
      eventDescription,
      eventDate,
      personId,
      isRecurring: optionals.isRecurring ? true : false,
    });

    request.headers.delete("content-length");
    request.headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/event`, {
      method: "POST",
      headers: request.headers,
      credentials: "include",
      body: stringifiedBody,
    });
    const data = await res.json();
    return { success: true, id: data.data.eventId };
  },
  zod$(EventSchema)
);

export default component$(() => {
  const formRef = useSignal<HTMLFormElement>();

  const people = usePeople();
  const peopleOptions = useComputed$(() =>
    people.value.data?.map((person) => ({
      label: person.nickName || `${person.firstName} ${person.lastName}`,
      value: person.id!,
    }))
  );

  const navigate = useNavigate();

  const action = useAddEvent();

  useTask$(({ track }) => {
    const id = track(() => action.value?.id);
    if (id) {
      toast.success("Event has been added");
      navigate(`/dashboard/event/${id}`);
    }
  });

  const handleNavigation = $(() => {
    const currentFormData = new FormData(formRef.value);
    const navigationUrl = new URL(`${ENV.PUBLIC_UI_URL}/dashboard/person`);
    setSearchParam(navigationUrl, currentFormData, "eventName");
    setSearchParam(navigationUrl, currentFormData, "eventDate");
    setSearchParam(navigationUrl, currentFormData, "isRecurring");
    setSearchParam(navigationUrl, currentFormData, "eventDescription");
    navigate(navigationUrl.toString());
  });

  return (
    <div class="row-span-2 overflow-y-auto rounded-lg bg-white">
      <section class="flex flex-col gap-y-4 rounded-lg bg-white text-slate-900">
        <h2 class="md:text-lg">Add an event</h2>
        <Form class="grid gap-y-2" action={action} ref={formRef}>
          <fieldset class="flex flex-col items-start sm:flex-row gap-x-2">
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Event Name*
              <CustomInput name="eventName"></CustomInput>
              {action.value?.failed && (
                <span class="text-burnt-umber-700">
                  {action.value.fieldErrors.eventName}
                </span>
              )}
            </label>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Event Date*
              <CustomInput name="eventDate" type="date"></CustomInput>
              {action.value?.failed && (
                <span class="text-burnt-umber-700">
                  {action.value.fieldErrors.eventDate}
                </span>
              )}
            </label>
          </fieldset>
          <label class="flex w-full items-center gap-x-1 text-xs text-slate-800">
            Annually recurring event?
            <CustomInput
              name="isRecurring"
              type="checkbox"
              value="true"
            ></CustomInput>
          </label>
          <fieldset class="grid grid-cols-2 grid-rows-[auto_1fr_auto] items-center">
            <label
              for="personId"
              class="flex w-full flex-col gap-y-1 text-xs text-slate-800"
            >
              Friend*
            </label>
            <CustomButton
              variant="outline"
              class="text-right text-xs"
              type="button"
              onClick$={handleNavigation}
            >
              Add Friend
            </CustomButton>
            <CustomSelect
              class="col-span-2"
              id="personId"
              name="personId"
              options={peopleOptions.value || []}
            ></CustomSelect>
            {action.value?.failed && (
              <span class="text-burnt-umber-700 col-span-2 text-xs">
                {action.value.fieldErrors.personId}
              </span>
            )}
          </fieldset>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Event Description*
            <CustomInput name="eventDescription"></CustomInput>
            {action.value?.failed && (
              <span class="text-burnt-umber-700">
                {action.value.fieldErrors.eventDescription}
              </span>
            )}
          </label>
          <fieldset class="flex items-center justify-between mt-2">
            <SSRLink href="/dashboard" variant="secondary">
              BACK
            </SSRLink>
            <CustomButton variant="primary">ADD EVENT</CustomButton>
          </fieldset>
        </Form>
      </section>
    </div>
  );
});
