import { type AnchorHTMLAttributes, component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { cn } from "~/lib/utils";

export const OutlineCSRLink = component$(
  ({ class: className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <Link
        class={cn(
          "rounded-lg text-havelock-blue-700 hover:bg-havelock-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <Slot />
      </Link>
    );
  },
);
