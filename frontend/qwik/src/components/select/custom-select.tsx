import { component$, type SelectHTMLAttributes } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ label: string; value: number }>;
}

export const CustomSelect = component$(
  ({ class: className, options, ...props }: CustomSelectProps) => {
    return (
      <select
        class={cn(
          "text-xs rounded-md border-2 border-slate-300 p-2 font-inter focus:border-havelock-blue-700 focus:shadow-sm focus:shadow-havelock-blue-700 focus:outline-none",
          className
        )}
        {...props}
      >
        <option value="" disabled selected>
          Select
        </option>
        {options.map((option) => (
          <option class="px-2 py-1" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
