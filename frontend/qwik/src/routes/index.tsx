import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <div class="h-full w-full">Hello from qwik!</div>
    </>
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
