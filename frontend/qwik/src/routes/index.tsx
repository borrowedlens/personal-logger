import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  zod$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { PrimaryButton } from "~/components/button/primary-button";
import { CustomInput } from "~/components/input/custom-input";
import { OutlineSSR } from "~/components/ssr-links/outline-ssr";
import { ENV } from "~/lib/constants";
import { LoginSchema } from "~/models/User";

export const useLogin = routeAction$(
  async (user, { fail, headers, redirect }) => {
    const res = await fetch(`${ENV.PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      return fail(res.status, {
        error: "Login failed",
      });
    }
    for (const [key, value] of res.headers.entries()) {
      headers.set(key, value);
    }
    const { data } = await res.json();
    if (data.id) {
      throw redirect(302, "/dashboard");
    }
  },
  zod$(LoginSchema),
);

export default component$(() => {
  const action = useLogin();
  return (
    <main class="grid h-full w-full place-items-center bg-app-login-radial from-havelock-blue-300 from-20% to-40% p-16">
      <section class="grid min-h-[80%] max-w-[80%] place-items-center rounded-lg bg-white p-6 text-slate-900 md:grid-cols-[60%_auto]">
        <article class="border-r-2 border-r-slate-300 p-8 text-left">
          <span>Welcome to your very own</span>
          <h2 class="py-4 text-6xl font-bold text-havelock-blue-700">
            Personal Logger.
          </h2>
        </article>
        <Form
          action={action}
          class="grid w-full justify-items-start gap-y-8 p-8"
        >
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Email
            <CustomInput name="email" value="vivek@test.com"></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Password
            <CustomInput name="password" value="Hello12345"></CustomInput>
          </label>
          <PrimaryButton class="justify-self-end">Login</PrimaryButton>
          <span>
            Don't have an account?{" "}
            <OutlineSSR
              class="underline-offset-2 hover:underline"
              href="/signup"
            >
              Signup
            </OutlineSSR>
          </span>
        </Form>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Personal Logger",
  meta: [
    {
      name: "description",
      content: "A passion project to log important things, built with qwik",
    },
  ],
};
