import { component$ } from "@builder.io/qwik";
import { differenceInCalendarDays, format } from "date-fns";

interface PersonProps {
  name: string;
  nickName: string;
  dob: Date;
  events: Array<{
    eventDate: Date;
  }>;
}

export default component$(({ name, nickName, dob, events }: PersonProps) => {
  return (
    <div class="border-l-havelock-blue-500 grid grid-cols-[1fr_auto] gap-x-2 rounded-lg border-l-4 px-2 py-1">
      <div class="flex flex-col items-start justify-center">
        <span class="text-sm font-bold">{nickName}</span>
        <span class="text-xs">{name}</span>
      </div>
      <div class="flex flex-col items-end">
        <span class=" bg-havelock-blue-200 rounded-sm px-1 text-xs font-semibold">
          DOB: {format(dob, "dd-MM")}
        </span>
        {/* {differenceInCalendarDays(nextEvent.eventDate, new Date()) < 5 ? (
          <span class="bg-burnt-umber-400 text-burnt-umber-700 rounded-sm text-xs">
            {differenceInCalendarDays(nextEvent.eventDate, new Date())} days
          </span>
        ) : null} */}
      </div>
    </div>
  );
});
