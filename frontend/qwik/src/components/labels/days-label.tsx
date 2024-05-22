import { component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

interface DaysLabelProps {
  daysRemaining: number;
}

export const DaysLabel = component$(({ daysRemaining }: DaysLabelProps) => {
  return (
    <span
      class={cn("rounded-md px-1 text-right text-xs", {
        "bg-red-100 text-red-800": daysRemaining < 7,
        "bg-yellow-100 text-yellow-800":
          daysRemaining >= 7 && daysRemaining < 14,
        "bg-green-100 text-green-800": daysRemaining >= 14,
      })}
    >
      in {daysRemaining} days
    </span>
  );
});
