import { component$, useTask$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { PrimaryButton } from "~/components/button/primary-button";
import { CustomInput } from "~/components/input/custom-input";
import { SecondarySSRLink } from "~/components/ssr-links/secondary-ssr";
import { ENV } from "~/lib/constants";
import { toast } from "qwik-sonner";

export const SignupSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.union([z.string().length(0), z.string().length(10)]),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    dob: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const useSignup = routeAction$(
  async (
    { firstName, lastName, email, password, confirmPassword, dob, phone },
    { fail },
  ) => {
    const stringifiedBody = JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
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
      return fail(res.status, {
        success: false,
        errorCode: res.status,
        errorMessage: "Something went wrong",
        data: null,
      });
    }
    const { data } = await res.json();
    return {
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: {
        id: data.id,
      },
    };
  },
  zod$(SignupSchema),
);

export default component$(() => {
  const action = useSignup();

  const navigate = useNavigate();

  useTask$(({ track }) => {
    const success = track(() => action.value?.success);
    if (success) {
      toast.success(
        "Account created successfully, please login with your credentials",
      );
      navigate("/");
    }
  });

  return (
    <>
      <main class="grid h-full w-full place-items-center bg-app-login-radial from-havelock-blue-300 from-20% to-40% md:px-12 md:py-4">
        <section class="flex flex-col gap-y-6 rounded-lg bg-white text-slate-900 md:px-12 md:py-10 lg:max-w-[50%]">
          <h2 class="text-3xl">Let's get you started!</h2>
          <Form class="grid gap-y-5" action={action}>
            <fieldset class="flex flex-col gap-x-2 gap-y-5 sm:flex-row">
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Firstname*
                <CustomInput name="firstName"></CustomInput>
                {action.value?.failed && (
                  <span class="text-burnt-umber-700">
                    {action.value.fieldErrors?.firstName}
                  </span>
                )}
              </label>
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Lastname*
                <CustomInput name="lastName"></CustomInput>
                {action.value?.failed && (
                  <span class="text-burnt-umber-700">
                    {action.value.fieldErrors?.lastName}
                  </span>
                )}
              </label>
            </fieldset>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Date of Birth* - This will be your first event
              <CustomInput name="dob" type="date"></CustomInput>
              {action.value?.failed && (
                <span class="text-burnt-umber-700">
                  {action.value.fieldErrors?.dob}
                </span>
              )}
            </label>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Phone
              <CustomInput name="phone"></CustomInput>
              {action.value?.failed && (
                <span class="text-burnt-umber-700">
                  {action.value.fieldErrors?.phone}
                </span>
              )}
            </label>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Email*
              <CustomInput name="email"></CustomInput>
              {action.value?.failed && (
                <span class="text-burnt-umber-700">
                  {action.value.fieldErrors?.email}
                </span>
              )}
            </label>
            <fieldset class="flex gap-x-2">
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Password*
                <CustomInput name="password" type="password"></CustomInput>
                {action.value?.failed && (
                  <span class="text-burnt-umber-700">
                    {action.value.fieldErrors?.password}
                  </span>
                )}
              </label>
              <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
                Confirm Password*
                <CustomInput
                  name="confirmPassword"
                  type="password"
                ></CustomInput>
                {action.value?.failed && (
                  <span class="text-burnt-umber-700">
                    {action.value.fieldErrors?.confirmPassword}
                  </span>
                )}
              </label>
            </fieldset>
            <fieldset class="flex items-center justify-between">
              <SecondarySSRLink href="/">Back</SecondarySSRLink>
              <PrimaryButton>Signup</PrimaryButton>
            </fieldset>
          </Form>
        </section>
      </main>
    </>
  );
});
