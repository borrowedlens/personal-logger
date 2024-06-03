import type { RequestHandler } from "@builder.io/qwik-city";
import { format } from "date-fns";

export const onGet: RequestHandler = async ({ query, redirect }) => {
  const date = query.get("date") ?? format(new Date(), "yyyy-MM-dd");
  throw redirect(302, `/dashboard/${date}`);
};
