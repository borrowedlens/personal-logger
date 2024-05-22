import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { ProfileBox } from "~/components/profile/profile-box";
import { type BaseResponseSchema, PersonProfileSchema } from "~/models/Person";
import { ENV } from "~/lib/constants";

export const usePerson = routeLoader$<
  BaseResponseSchema<z.infer<typeof PersonProfileSchema>>
>(async (requestEvent) => {
  const res = await fetch(
    `${ENV.PUBLIC_API_URL}/person/${requestEvent.params.personId}`
  );
  if (!res.ok) {
    return requestEvent.fail(res.status, {
      success: false,
      data: null,
      errorCode: res.status,
      errorMessage:
        "Could not fetch person, please refresh the page / try again later",
    });
  }
  const { data } = await res.json();
  try {
    PersonProfileSchema.parse(data.person);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return requestEvent.fail(409, {
        success: false,
        data: null,
        errorCode: res.status,
        errorMessage: error.message,
      });
    }
  }
  return { data: data.person, errorCode: 0, errorMessage: "", success: true };
});

export default component$(() => {
  const person = usePerson();

  if (!person.value.data) {
    return <span>{person.value.errorMessage}</span>;
  }

  return (
    <ProfileBox
      firstName={person.value.data.firstName}
      lastName={person.value.data.lastName}
      email={person.value.data.email}
      dob={person.value.data.dob}
      phone={person.value.data.phone}
      events={person.value.data.events}
    />
  );
});
