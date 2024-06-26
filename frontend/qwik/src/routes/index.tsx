import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { ENV } from "~/lib/constants";

export const onGet: RequestHandler = async ({ request, redirect }) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/auth`, {
    method: "GET",
    headers: request.headers,
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw redirect(302, "/login");
    }
  } else {
    throw redirect(302, "/dashboard");
  }
};

export const head: DocumentHead = {
  title: "Personal Logger",
  meta: [
    {
      name: "description",
      content: "A passion project to log important things, built with qwik",
    },
  ],
};
