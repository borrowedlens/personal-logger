import { type AnchorHTMLAttributes, component$, Slot } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const SecondarySSR = component$(
  ({ class: className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a
        class={cn(
          "rounded-md border-1 border-havelock-blue-800 bg-white px-6 py-2 text-havelock-blue-800",
          className,
        )}
        {...props}
      >
        <Slot />
      </a>
    );
  },
);
