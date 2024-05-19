import { type InputHTMLAttributes, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export const CustomInput = component$<InputHTMLAttributes<HTMLInputElement>>(
  ({ class: className, ...props }) => {
    return (
      <input
        class={cn(
          "rounded-md border-2 border-slate-300 p-2 font-inter focus:border-havelock-blue-700 focus:shadow-sm focus:shadow-havelock-blue-700 focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
