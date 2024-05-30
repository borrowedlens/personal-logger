import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  startOfMonth,
} from "date-fns";
import { BsArrowRightShort, BsArrowLeftShort } from "@qwikest/icons/bootstrap";

import { OutlineButton } from "../button/outline-button";
import { cn } from "~/lib/utils";

interface CalendarProps {
  upcomingDates: Array<string>;
}

export const Calendar = component$(({ upcomingDates }: CalendarProps) => {
  const displayedMonth = useSignal(new Date());

  const arrayOfDaysInMonth = useComputed$(() => {
    const start = startOfMonth(displayedMonth.value);
    const end = endOfMonth(displayedMonth.value);
    const firstDay = getDay(start);
    const lastDay = getDay(end);
    const nullBoxesInBeginning = firstDay;
    const nullBoxesInEnd = 6 - lastDay;
    const daysInMonth = getDaysInMonth(displayedMonth.value);
    const datesArray: Array<Date | null> = Array.from({
      length: daysInMonth,
    }).map((_, index) => {
      return addDays(startOfMonth(displayedMonth.value), index);
    });
    datesArray.unshift(
      ...Array.from({ length: nullBoxesInBeginning }).map(() => null),
    );
    datesArray.push(...Array.from({ length: nullBoxesInEnd }).map(() => null));
    return datesArray;
  });

  const handleMonthChange = $((changeCount: number) => {
    displayedMonth.value = addMonths(displayedMonth.value, changeCount);
  });

  return (
    <>
      <div class="flex items-center justify-center gap-x-2">
        <OutlineButton onClick$={() => handleMonthChange(-1)}>
          <BsArrowLeftShort />
        </OutlineButton>
        <span class="w-[100px] text-center">
          {format(displayedMonth.value, "LLL yyyy")}
        </span>
        <OutlineButton onClick$={() => handleMonthChange(1)}>
          <BsArrowRightShort />
        </OutlineButton>
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
              "bg-havelock-blue-400":
                date && upcomingDates.includes(format(date, "dd-MM")),
            })}
          >
            {date ? getDate(date) : ""}
          </span>
        ))}
      </div>
    </>
  );
});
