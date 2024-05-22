import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, zod$ } from "@builder.io/qwik-city";
import { PrimaryButton } from "~/components/button/primary-button";
import { Header } from "~/components/header/header";
import { CustomInput } from "~/components/input/custom-input";
import { SecondarySSR } from "~/components/ssr-links/secondary-ssr";
import { type BaseResponseSchema } from "~/models/Person";
import { ENV } from "~/lib/constants";
import { SignupSchema } from "~/models/User";

export const useSignup = routeAction$(
  async ({
    firstName,
    lastName,
    email,
    password,
    dob,
    phone,
  }): Promise<BaseResponseSchema<{ userId: string }>> => {
    const stringifiedBody = JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      dob,
      phone: phone ? phone : "",
    });
    const res = await fetch(`${ENV.PUBLIC_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: stringifiedBody,
    });
    if (!res.ok) {
      return {
        success: false,
        errorCode: 500,
        errorMessage: "Something went wrong",
        data: null,
      };
    }
    const result = await res.json();
    return {
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: {
        userId: result.userId,
      },
    };
  },
  zod$(SignupSchema),
);

export default component$(() => {
  const action = useSignup();
  return (
    <>
      <Header />
      <main class="grid h-full w-full place-items-center px-12 py-4">
        <section class="flex flex-col gap-y-6 rounded-lg bg-white px-12 py-10 text-slate-900 lg:max-w-[50%]">
          <h2 class="text-3xl">Let's get you started!</h2>
          <Form class="grid gap-y-5" action={action}>
            <fieldset class="flex flex-col gap-x-2 sm:flex-row">
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Firstname*
                <CustomInput name="firstName"></CustomInput>
              </label>
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Lastname*
                <CustomInput name="lastName"></CustomInput>
              </label>
            </fieldset>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Date of Birth*
              <CustomInput name="dob" type="date"></CustomInput>
            </label>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Phone
              <CustomInput name="phone"></CustomInput>
            </label>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Email*
              <CustomInput name="email"></CustomInput>
            </label>
            <fieldset class="flex gap-x-2">
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Password*
                <CustomInput name="password" type="password"></CustomInput>
              </label>
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Confirm Password*
                <CustomInput
                  name="confirmPassword"
                  type="password"
                ></CustomInput>
              </label>
            </fieldset>
            <fieldset class="flex items-center justify-between">
              <SecondarySSR href="/">Back</SecondarySSR>
              <PrimaryButton>Signup</PrimaryButton>
            </fieldset>
          </Form>
        </section>
      </main>
    </>
  );
});
