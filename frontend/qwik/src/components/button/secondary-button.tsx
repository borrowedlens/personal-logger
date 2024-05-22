import type { ButtonHTMLAttributes } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const SecondaryButton = component$<
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ class: className, ...props }) => {
  return (
    <button
      class={cn(
        "rounded-md border-1 border-havelock-blue-700 bg-white p-1 text-havelock-blue-700 md:px-6 md:py-2",
        className,
      )}
      {...props}
    >
      <Slot />
    </button>
  );
});

// "":
//   variant === "secondary",
// "text-havelock-blue-700 hover:text-havelock-blue-800":
//   variant === "outline",
