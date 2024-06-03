import { component$ } from "@builder.io/qwik";
import {
  BsHouseFill,
  BsHouse,
  BsCalendar2Event,
  BsCalendar2EventFill,
  BsPerson,
  BsPersonHeart,
  // BsBoxArrowRight,
} from "@qwikest/icons/bootstrap";
import { OutlineSSRLink } from "../ssr-links/outline-ssr";
import { useLocation } from "@builder.io/qwik-city";
import { cn } from "~/lib/utils";
// import { OutlineButton } from "../button/outline-button";

export const Header = component$(() => {
  const { url } = useLocation();
  // const action = useLogoutAction();

  // const handleLogout = $(async () => {
  //   await action.submit();
  // });

  return (
    <header class="fixed left-0 right-0 top-0 flex h-14 w-full items-center gap-x-2 gap-y-4 border-b-1 border-slate-400 bg-white px-3 xl:h-full xl:w-56 xl:flex-col xl:px-6 xl:py-4">
      <h1 class="hidden text-left text-xl text-havelock-blue-700 sm:block xl:w-full">
        Personal Logger
      </h1>
      <nav class="flex flex-1 items-center justify-between xl:w-full xl:flex-col xl:items-end">
        <div class="flex w-full gap-x-2 gap-y-2 xl:h-full xl:w-full xl:flex-col">
          <OutlineSSRLink
            href="/dashboard"
            class={cn("flex items-start gap-x-1.5 p-2 text-lg xl:w-full", {
              "bg-havelock-blue-100": url.pathname.includes("/dashboard"),
            })}
          >
            {url.pathname.includes("/dashboard") ? (
              <BsHouseFill />
            ) : (
              <BsHouse />
            )}
            <span class="text-sm">Tasks</span>
          </OutlineSSRLink>
          <OutlineSSRLink
            href="/friends"
            class={cn("flex items-start gap-x-1.5 p-2 text-lg xl:w-full", {
              "bg-havelock-blue-100": url.pathname.includes("/friends"),
            })}
          >
            {url.pathname.includes("/friends") ? (
              <BsPersonHeart />
            ) : (
              <BsPerson />
            )}
            <span class="text-sm">Friends</span>
          </OutlineSSRLink>
          <OutlineSSRLink
            href="/event"
            class={cn("flex items-start gap-x-1.5 p-2 text-lg xl:w-full", {
              "bg-havelock-blue-100": url.pathname.includes("/event"),
            })}
          >
            {url.pathname.includes("/event") ? (
              <BsCalendar2EventFill />
            ) : (
              <BsCalendar2Event />
            )}
            <span class="text-sm">Events</span>
          </OutlineSSRLink>
        </div>
        {/* <OutlineButton
          class="flex items-start justify-end gap-x-1.5 p-2 text-lg"
          onClick$={handleLogout}
        >
          <span class="hidden text-sm xl:block">Logout</span>
          <BsBoxArrowRight />
        </OutlineButton> */}
      </nav>
    </header>
  );
});
