import type { AnchorHTMLAttributes } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { cn } from "~/lib/utils";

export const PrimaryCSRLink = component$<
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ class: className, ...props }) => {
  return (
    <Link
      class={cn(
        "ring-offset-background focus-visible:ring-ring rounded-lg border-1 border-transparent bg-havelock-blue-700 px-4 py-2 text-white transition-colors hover:bg-havelock-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 md:px-6 md:py-2",
        className,
      )}
      {...props}
    >
      <Slot />
    </Link>
  );
});
