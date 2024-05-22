import { type AnchorHTMLAttributes, component$, Slot } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const OutlineSSR = component$(
  ({ class: className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a
        class={cn(
          "text-havelock-blue-700 hover:text-havelock-blue-800",
          className,
        )}
        {...props}
      >
        <Slot />
      </a>
    );
  },
);
