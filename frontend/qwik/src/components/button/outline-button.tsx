import type { ButtonHTMLAttributes } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const OutlineButton = component$<
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ class: className, ...props }) => {
  return (
    <button
      class={cn(
        "ring-offset-background focus-visible:ring-ring rounded-lg text-havelock-blue-700 transition-colors hover:bg-havelock-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      <Slot />
    </button>
  );
});
