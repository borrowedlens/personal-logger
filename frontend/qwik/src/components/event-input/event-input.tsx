import { component$ } from "@builder.io/qwik";
import { CustomInput } from "../input/custom-input";

interface EventInputProps {
  index?: number;
  eventName?: string;
  eventDate?: string;
  eventDescription?: string;
  isRecurring?: boolean;
  inEditMode: boolean;
}

export const EventInput = component$(
  ({
    index,
    eventName,
    eventDate,
    eventDescription,
    isRecurring,
    inEditMode,
  }: EventInputProps) => {
    return (
      <>
        <fieldset class="flex flex-col gap-x-2 sm:flex-row">
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Event Name*
            <CustomInput
              name={index ? `events.${index}.eventName` : "eventName"}
              defaultValue={eventName}
              disabled={!inEditMode}
              class="disabled:border-none disabled:bg-transparent disabled:p-0"
            ></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Event Date*
            <CustomInput
              name={index ? `events.${index}.eventDate` : "eventDate"}
              type="date"
              defaultValue={eventDate}
              disabled={!inEditMode}
              class="disabled:border-none disabled:bg-transparent disabled:p-0"
            ></CustomInput>
          </label>
        </fieldset>
        <label class="flex w-full items-center gap-x-1 text-xs text-slate-800">
          Annually recurring event?
          <CustomInput
            class="accent-havelock-blue-700"
            name={index ? `events.${index}.isRecurring` : "isRecurring"}
            type="checkbox"
            value="true"
            checked={isRecurring}
            disabled={!inEditMode}
          ></CustomInput>
        </label>
        <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
          Event Description*
          <CustomInput
            name={
              index ? `events.${index}.eventDescription` : "eventDescription"
            }
            defaultValue={eventDescription}
            disabled={!inEditMode}
            class="disabled:border-none disabled:bg-transparent disabled:p-0"
          ></CustomInput>
        </label>
      </>
    );
  },
);
