import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { ENV } from "~/lib/constants";
import type { BaseResponseSchema } from "~/models/Base";
import { PersonSchema } from "../../layout";
import { PersonDetails } from "~/components/friends/friends";

export const usePersonLoader = routeLoader$<
  BaseResponseSchema<z.infer<typeof PersonSchema>>
>(async ({ params, fail, request, headers }) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/person/${params.friendId}`, {
    method: "GET",
    headers: request.headers,
  });
  if (!res.ok) {
    return fail(res.status, {
      success: false,
      data: null,
      errorCode: res.status,
      errorMessage:
        "Could not fetch person, please refresh the page / try again later",
    });
  }

  for (const [key, value] of res.headers.entries()) {
    headers.set(key, value);
  }

  const { data } = await res.json();
  try {
    PersonSchema.parse(data.person);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail(409, {
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
  return <PersonDetails />;
});
