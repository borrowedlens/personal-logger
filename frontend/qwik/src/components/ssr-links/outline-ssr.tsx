import { type AnchorHTMLAttributes, component$, Slot } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const OutlineSSRLink = component$(
  ({ class: className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a
        class={cn(
          "ring-offset-background focus-visible:ring-ring text-havelock-blue-700 transition-colors hover:text-havelock-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        <Slot />
      </a>
    );
  },
);
