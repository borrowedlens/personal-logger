import { component$, useComputed$ } from "@builder.io/qwik";
import { OutlineSSRLink } from "../ssr-links/outline-ssr";
import {
  BsPlusSquareFill,
  BsTrash3Fill,
  BsCheckCircleFill,
  BsXCircleFill,
} from "@qwikest/icons/bootstrap";
import {
  type PersonSchema,
  usePeopleLoader,
} from "~/routes/(protected)/layout";
import type { z } from "@builder.io/qwik-city";
import { format } from "date-fns";
import { OutlineButton } from "../button/outline-button";
import { cn } from "~/lib/utils";
import { usePersonLoader } from "~/routes/(protected)/friends/[friendId]";

export const People = component$(() => {
  const people = usePeopleLoader();

  return (
    <section class="flex max-h-60 flex-col gap-y-2 rounded-lg bg-white p-2 md:flex-1 lg:max-h-none lg:min-h-0 lg:flex-[0.6] lg:p-3">
      <h2 class="flex items-center justify-between text-base lg:text-lg">
        <span>All friends</span>
        <OutlineSSRLink href="/friends#add-friend" class="p-1">
          <BsPlusSquareFill />
        </OutlineSSRLink>
      </h2>
      <div class="flex flex-col overflow-y-auto py-2">
        {people.value.success ? (
          people.value.data?.map(
            ({ id, nickName, firstName, lastName, events }) => (
              <PersonCard
                key={id}
                id={id}
                nickName={nickName}
                firstName={firstName}
                lastName={lastName}
                events={events}
              />
            ),
          )
        ) : (
          <span>{people.value.errorMessage}</span>
        )}
      </div>
    </section>
  );
});

type PersonCardProps = Omit<
  z.infer<typeof PersonSchema>,
  "dob" | "email" | "phone"
>;

export const PersonCard = component$(
  ({ id, nickName, firstName, lastName, events }: PersonCardProps) => {
    const fullName = useComputed$(() => {
      return `${firstName} ${lastName}`;
    });
    return (
      <a
        href={`/friends/${id}`}
        class="flex flex-col gap-x-2 gap-y-3 border-b-1 border-b-slate-300 p-2 text-sm hover:cursor-pointer hover:bg-havelock-blue-100"
      >
        <div class="flex w-full justify-between gap-x-1">
          <div class="flex items-center justify-start gap-x-1 text-left">
            <span>{fullName.value}</span>
            {nickName ? <span>{`(${nickName})`}</span> : null}
          </div>
          <div class="flex items-center">
            <OutlineButton class="p-1 text-sm lg:p-2">
              <BsTrash3Fill />
            </OutlineButton>
          </div>
        </div>
        {events?.map((event) => (
          <div
            key={event.id}
            class="flex items-center gap-x-1 gap-y-1 pl-2 text-xs"
          >
            <span>{event.eventName}:</span>
            <strong>{format(event.eventDate, "do LLL, yyyy")}</strong>
          </div>
        ))}
      </a>
    );
  },
);

export const PersonDetails = component$(() => {
  const person = usePersonLoader();

  if (!person.value.data) {
    return <span>{person.value.errorMessage}</span>;
  }

  const { firstName, lastName, email, phone, events } = person.value.data;

  const fullName = useComputed$(() => {
    return `${firstName} ${lastName}`;
  });

  return (
    <section class="relative flex h-full flex-col gap-y-4 rounded-lg bg-white p-6 text-slate-900 lg:flex-1 lg:p-8">
      <div
        class="absolute left-0 top-0 flex h-60 w-full items-end justify-start rounded-se-lg rounded-ss-lg bg-no-repeat p-6 before:absolute before:left-0 before:top-0 before:z-0 before:h-full before:w-full before:rounded-se-lg before:rounded-ss-lg before:bg-havelock-blue-950 before:bg-opacity-60 before:backdrop-blur-sm lg:p-8"
        style={{
          backgroundImage: "url('/images/friends.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span class="relative z-10 text-2xl font-bold text-white sm:text-5xl">
          {fullName.value}
        </span>
      </div>
      <div class="font-inter flex h-full flex-col items-start gap-y-6 pt-60">
        <label class="flex flex-col items-start gap-y-1 text-left text-xs text-slate-600 sm:text-base">
          Email
          <span class="text-sm text-black sm:text-lg">{email}</span>
        </label>
        {phone ? (
          <label class="flex flex-col items-start gap-y-1 text-left text-xs text-slate-600 sm:text-base">
            Phone
            <span class="text-sm text-black sm:text-lg">{phone}</span>
          </label>
        ) : null}
        <label class="flex flex-col items-start gap-y-1 text-left text-xs text-slate-600 sm:text-base">
          Events
          <div
            class="flex min-h-0 w-full flex-col flex-wrap items-start gap-2 overflow-x-auto text-left text-base"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {events?.map((event) => (
              <>
                <div
                  key={event.id}
                  class="flex flex-col gap-y-1 rounded-md border-1 border-havelock-blue-600 bg-havelock-blue-100 p-2 text-sm text-slate-600 sm:text-base lg:px-4"
                  style={{ scrollSnapAlign: "end" }}
                >
                  <div class="flex items-center gap-x-1">
                    <span>{event.eventName}:</span>
                    <span>{format(event.eventDate, "do LLL, yyyy")}</span>
                  </div>
                  <div class="flex items-center gap-x-1">
                    <span>Annually Recurring</span>
                    <span
                      class={cn("flex justify-center", {
                        "text-green-800": event.isRecurring,
                      })}
                    >
                      {event.isRecurring ? (
                        <BsCheckCircleFill />
                      ) : (
                        <BsXCircleFill />
                      )}
                    </span>
                  </div>
                </div>
              </>
            ))}
          </div>
        </label>
      </div>
    </section>
  );
});
