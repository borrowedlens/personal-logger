import { component$, useComputed$ } from "@builder.io/qwik";
import { format } from "date-fns";
import { type z } from "@builder.io/qwik-city";
import { type PersonProfileSchema } from "~/models/Person";

interface ProfileBoxProps
  extends Omit<z.infer<typeof PersonProfileSchema>, "nickName" | "id"> {}

export const ProfileBox = component$(
  ({ firstName, lastName, email, phone, dob, events }: ProfileBoxProps) => {
    const fullName = useComputed$(() => {
      return `${firstName} ${lastName}`;
    });

    return (
      <>
        <h2 class="w-full text-center text-2xl">Profile</h2>
        <div class="font-display flex flex-col items-center justify-center gap-y-6 p-8">
          <div class="flex h-40 w-40 items-center justify-center rounded-full bg-havelock-blue-100 text-8xl text-white">
            {firstName[0].toUpperCase()}
          </div>
          <span class="text-center text-4xl font-bold text-havelock-blue-700">
            {fullName}
          </span>
          <div class="flex w-full flex-wrap items-center justify-center gap-6">
            <label class="flex flex-col items-center justify-center text-center text-xs text-slate-600">
              Email
              <span class="text-2xl text-black">{email}</span>
            </label>
            <label class="flex flex-col items-center justify-center text-center text-xs text-slate-600">
              Phone
              <span class="text-2xl text-black">{phone}</span>
            </label>
            <label class="flex flex-col items-center justify-center text-center text-xs text-slate-600">
              Date of Birth
              <span class="text-2xl text-black">
                {format(dob, "MM-dd-yyyy")}
              </span>
            </label>
          </div>
          <div class="flex flex-col">
            {events?.map((event) => (
              <span key={event.id}>{event.eventName}</span>
            ))}
          </div>
        </div>
      </>
    );
  },
);
