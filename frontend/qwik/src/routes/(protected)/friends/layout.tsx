import { Slot, component$ } from "@builder.io/qwik";
import { People } from "~/components/friends/friends";

export default component$(() => {
  return (
    <>
      <People />
      <Slot />
    </>
  );
});
