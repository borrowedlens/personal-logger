import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import {
  addMonths,
  endOfMonth,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth,
} from "date-fns";
import { BsArrowRightShort, BsArrowLeftShort } from "@qwikest/icons/bootstrap";

import { CustomButton } from "../button/custom-button";
import { cn } from "~/lib/utils";

export const Calendar = component$(() => {
  const displayedMonth = useSignal(new Date());

  const arrayOfDaysInMonth = useComputed$(() => {
    const firstDay = getDay(startOfMonth(displayedMonth.value));
    const lastDay = getDay(endOfMonth(displayedMonth.value));
    const nullBoxesInBeginning = firstDay;
    const nullBoxesInEnd = 6 - lastDay;
    const daysInMonth = getDaysInMonth(displayedMonth.value);
    const datesArray: Array<number | boolean> = Array.from({
      length: daysInMonth,
    }).map((_, index) => index + 1);
    datesArray.unshift(
      ...Array.from({ length: nullBoxesInBeginning }).map(() => false)
    );
    datesArray.push(...Array.from({ length: nullBoxesInEnd }).map(() => false));
    return datesArray;
  });

  const handleMonthChange = $((changeCount: number) => {
    displayedMonth.value = addMonths(displayedMonth.value, changeCount);
  });

  return (
    <>
      <div class="flex items-center justify-center gap-x-2">
        <CustomButton variant="outline" onClick$={() => handleMonthChange(-1)}>
          <BsArrowLeftShort />
        </CustomButton>
        <span class="w-[100px] text-center">
          {format(displayedMonth.value, "LLL yyyy")}
        </span>
        <CustomButton variant="outline" onClick$={() => handleMonthChange(1)}>
          <BsArrowRightShort />
        </CustomButton>
      </div>
      <div class="grid grid-cols-7 justify-items-center gap-y-1 text-xs">
        <span class="font-bold">Su</span>
        <span class="font-bold">Mo</span>
        <span class="font-bold">Tu</span>
        <span class="font-bold">We</span>
        <span class="font-bold">Th</span>
        <span class="font-bold">Fr</span>
        <span class="font-bold">Sa</span>
        {arrayOfDaysInMonth.value.map((date, index) => (
          <span
            key={index}
            class={cn("grid h-5 w-5 place-items-center rounded-sm", {
              "bg-white": date,
            })}
          >
            {date}
          </span>
        ))}
      </div>
    </>
  );
});
