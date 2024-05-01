import { component$ } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header class="flex h-14 w-full items-center justify-between px-6">
      <h1 class="text-3xl text-white">Personal Logger</h1>
      <span class="text-white">Test User</span>
    </header>
  );
});
