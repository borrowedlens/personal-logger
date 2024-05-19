import type { ButtonHTMLAttributes } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "outline";
}

export const CustomButton = component$<CustomButtonProps>(
  ({ variant, class: className, ...props }) => {
    return (
      <button
        class={cn(
          "rounded-md border-2 border-transparent px-1 py-1 md:px-6 md:py-2",
          {
            "bg-havelock-blue-700 text-white hover:bg-havelock-blue-800":
              variant === "primary",
            "border-havelock-blue-700 bg-white text-havelock-blue-700":
              variant === "secondary",
            "p-0 md:p-0 text-havelock-blue-700 hover:text-havelock-blue-800":
              variant === "outline",
          },
          className
        )}
        {...props}
      >
        <Slot />
      </button>
    );
  }
);
