import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { ProfileBox } from "~/components/profile/profile-box";
import { type BaseResponseModel, PersonProfileModel } from "~/data/models";

export const usePerson = routeLoader$<
  BaseResponseModel<z.infer<typeof PersonProfileModel>>
>(async (requestEvent) => {
  const res = await fetch(
    `http://localhost:3000/person/${requestEvent.params.personId}`,
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
  const person = await res.json();
  console.log("🚀 ~ > ~ person:", person);
  try {
    PersonProfileModel.parse(person);
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
  return { data: person, errorCode: 0, errorMessage: "", success: true };
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
