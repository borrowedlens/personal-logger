import type { ButtonHTMLAttributes } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const SecondaryButton = component$<
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ class: className, ...props }) => {
  return (
    <button
      class={cn(
        "ring-offset-background focus-visible:ring-ring rounded-lg border-1 border-havelock-blue-700 bg-white px-4 py-2 text-havelock-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:px-6 md:py-2",
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
