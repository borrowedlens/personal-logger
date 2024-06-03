import { type AnchorHTMLAttributes, component$, Slot } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const SecondarySSRLink = component$(
  ({ class: className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a
        class={cn(
          "ring-offset-background focus-visible:ring-ring rounded-lg border-1 border-havelock-blue-800 bg-white px-4 py-2 text-havelock-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:px-6 md:py-2",
          className,
        )}
        {...props}
      >
        <Slot />
      </a>
    );
  },
);
