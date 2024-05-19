import type { AnchorHTMLAttributes } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

interface SSRLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: "primary" | "secondary" | "outline" | "icon";
}

export const SSRLink = component$<SSRLinkProps>(
  ({ variant, class: className, ...props }) => {
    return (
      <a
        class={cn(
          "rounded-md border-2 border-transparent",
          {
            "bg-havelock-blue-700 px-6 py-2 text-white hover:bg-havelock-blue-800":
              variant === "primary",
            "border-havelock-blue-800 bg-white px-6 py-2 text-havelock-blue-800":
              variant === "secondary",
            "border-none text-havelock-blue-700 hover:text-havelock-blue-800 hover:underline underline-offset-2":
              variant === "outline",
          },
          className
        )}
        {...props}
      >
        <Slot />
      </a>
    );
  }
);
