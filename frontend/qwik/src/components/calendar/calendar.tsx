import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  isEqual,
  isFuture,
  isPast,
  isToday,
  startOfMonth,
} from "date-fns";
import { BsArrowRightShort, BsArrowLeftShort } from "@qwikest/icons/bootstrap";

import { OutlineButton } from "../button/outline-button";
import { cn } from "~/lib/utils";
import { useLocation } from "@builder.io/qwik-city";

interface CalendarProps {
  upcomingDates: Array<string>;
}

export const Calendar = component$(({ upcomingDates }: CalendarProps) => {
  const { params } = useLocation();
  const selectedDate = params.date || new Date();
  const displayedMonth = useSignal(selectedDate);

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
    <div class="flex-1 rounded-md bg-white p-2 lg:flex-initial">
      <div class="flex items-center justify-center gap-x-2 pb-4">
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
      <div class="grid grid-cols-7 justify-items-center text-xs">
        <span class="font-bold">Su</span>
        <span class="font-bold">Mo</span>
        <span class="font-bold">Tu</span>
        <span class="font-bold">We</span>
        <span class="font-bold">Th</span>
        <span class="font-bold">Fr</span>
        <span class="font-bold">Sa</span>
        {arrayOfDaysInMonth.value.map((date, index) =>
          date ? (
            <CalendarDate
              key={index}
              date={date}
              hasPastEvent={
                upcomingDates.includes(format(date, "MM-dd")) && isPast(date)
              }
              hasUpcomingEvent={
                upcomingDates.includes(format(date, "MM-dd")) && isFuture(date)
              }
            />
          ) : (
            <span key={index}></span>
          ),
        )}
      </div>
    </div>
  );
});

interface CalendarDateProps {
  date: Date;
  // isActive: boolean;
  // completeTasksCount: number;
  // totalTasksCount: number;
  hasPastEvent: boolean;
  hasUpcomingEvent: boolean;
}

export const CalendarDate = component$(
  ({ date, hasPastEvent, hasUpcomingEvent }: CalendarDateProps) => {
    const { params } = useLocation();
    const selectedDate = params.date || new Date();
    const formattedDate = format(date, "yyyy-MM-dd");

    return (
      <a
        href={`/dashboard/${formattedDate}`}
        class={cn(
          "relative grid h-6 w-6 place-items-center rounded-full bg-white hover:bg-havelock-blue-300",
          {
            "bg-havelock-blue-300": isEqual(formattedDate, selectedDate),
            "font-bold underline": isToday(date),
            "border-2 border-havelock-blue-700": hasUpcomingEvent,
            "border-2 border-slate-300": hasPastEvent,
          },
        )}
      >
        {getDate(date)}
      </a>
    );
  },
);
