import { component$ } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header class="absolute left-0 right-0 top-0 flex h-14 w-full items-center justify-between px-6 border-b-1 border-slate-400 bg-white">
      <h1 class="text-xl text-havelock-blue-700">Personal Logger</h1>
      <div class="flex items-center gap-x-2">
        <span class="text-sm text-havelock-blue-700">Test User</span>
      </div>
    </header>
  );
});
