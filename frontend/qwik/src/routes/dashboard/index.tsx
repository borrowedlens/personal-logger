import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { ProfileBox } from "~/components/profile/profile-box";
import { type BaseResponseModel, UserProfileModel } from "~/data/models";

export const useUser = routeLoader$<
  BaseResponseModel<z.infer<typeof UserProfileModel>>
>(async (requestEvent) => {
  const res = await fetch("http://localhost:3000/user?email=test@test.com", {
    method: "GET",
  });
  if (!res.ok) {
    return requestEvent.fail(res.status, {
      data: null,
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch user, please refresh the page / try again later",
    });
  }
  const user = await res.json();
  console.log("🚀 ~ > ~ user:", user)
  try {
    UserProfileModel.parse(user);
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
  return { errorMessage: "", errorCode: 0, success: true, data: user };
});

export default component$(() => {
  const user = useUser();

  if (!user.value.data) {
    return <span>{user.value.errorMessage}</span>;
  }

  return (
    <ProfileBox
      firstName={user.value.data.firstName}
      lastName={user.value.data.lastName}
      email={user.value.data.email}
      dob={user.value.data.dob}
      phone={user.value.data.phone}
      events={user.value.data.events}
    />
  );
});
