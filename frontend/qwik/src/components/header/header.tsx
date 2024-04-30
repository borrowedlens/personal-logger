import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <header class="flex h-12 w-full items-center justify-between px-6">
      <h1 class="text-xl">Personal Logger</h1>
      <div>Test User</div>
    </header>
  );
});
