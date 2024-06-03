import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { PrimaryButton } from "~/components/button/primary-button";
import { CustomInput } from "~/components/input/custom-input";
import { OutlineSSRLink } from "~/components/ssr-links/outline-ssr";
import { ENV } from "~/lib/constants";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const useLoginAction = routeAction$(
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
        success: false,
        errorCode: 500,
        errorMessage: "Something went wrong",
        data: null,
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
  const action = useLoginAction();
  return (
    <main class="grid h-full w-full place-items-center bg-app-login-radial from-havelock-blue-300 from-20% to-40% lg:p-16">
      <section class="grid min-h-[80%] max-w-[80%] place-items-center rounded-lg bg-white p-6 text-slate-900 lg:grid-cols-[60%_auto]">
        <article class="text-center lg:border-r-2 lg:border-r-slate-300 lg:p-8 lg:text-left">
          <span class="text-sm">Welcome to your very own</span>
          <h2 class="py-4 text-4xl font-bold text-havelock-blue-700 lg:text-6xl">
            Personal Logger.
          </h2>
        </article>
        <Form
          action={action}
          class="grid w-full justify-items-start gap-y-6 lg:gap-y-8 lg:p-8"
        >
          <label class="flex w-full flex-col gap-y-1 text-sm text-slate-800">
            Email
            <CustomInput name="email" value="vivek@test.com"></CustomInput>
            {action.value?.failed && (
              <span class="text-burnt-umber-700">
                {action.value.fieldErrors?.email}
              </span>
            )}
          </label>
          <label class="flex w-full flex-col gap-y-1 text-sm text-slate-800">
            Password
            <CustomInput name="password" value="Hello12345"></CustomInput>
            {action.value?.failed && (
              <span class="text-burnt-umber-700">
                {action.value.fieldErrors?.password}
              </span>
            )}
          </label>
          <PrimaryButton class="justify-self-end" disabled={action.isRunning}>
            {action.isRunning ? "Logging in" : "Login"}
          </PrimaryButton>
          {action.value?.failed && (
            <span class="text-burnt-umber-700">
              {action.value.errorMessage}
            </span>
          )}
          <div class="w-full text-center lg:text-left">
            Don't have an account?{" "}
            <OutlineSSRLink
              class="underline-offset-2 hover:underline"
              href="/signup"
            >
              Signup
            </OutlineSSRLink>
          </div>
        </Form>
      </section>
    </main>
  );
});
