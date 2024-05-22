import type { ButtonHTMLAttributes } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const OutlineButton = component$<
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ class: className, ...props }) => {
  return (
    <button
      class={cn(
        "rounded-md text-havelock-blue-700 hover:text-havelock-blue-800",
        className,
      )}
      {...props}
    >
      <Slot />
    </button>
  );
});
