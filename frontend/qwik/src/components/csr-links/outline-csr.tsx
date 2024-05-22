import { type AnchorHTMLAttributes, component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { cn } from "~/lib/utils";

export const OutlineCSR = component$(
  ({ class: className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <Link
        class={cn(
          "text-havelock-blue-700 hover:text-havelock-blue-800",
          className,
        )}
        {...props}
      >
        <Slot />
      </Link>
    );
  },
);
