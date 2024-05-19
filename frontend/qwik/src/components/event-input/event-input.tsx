import { component$ } from "@builder.io/qwik";
import { CustomInput } from "../input/custom-input";

interface EventInputProps {
  index: number;
  name?: string;
  date?: string;
  description?: string;
  isRecurring?: boolean;
}

export const EventInput = component$(
  ({ index, name, date, description, isRecurring }: EventInputProps) => {
    return (
      <div class="rounded-lg bg-havelock-blue-100 p-2">
        <section class="flex flex-col gap-y-2 rounded-lg text-slate-900">
          <fieldset class="flex flex-col sm:flex-row gap-x-2">
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Event Name*
              <CustomInput
                name={`events.${index}.eventName`}
                defaultValue={name}
              ></CustomInput>
            </label>
            <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
              Event Date*
              <CustomInput
                name={`events.${index}.eventDate`}
                type="date"
                defaultValue={date}
              ></CustomInput>
            </label>
          </fieldset>
          <label class="flex w-full items-center gap-x-1 text-xs text-slate-800">
            Annually recurring event?
            <CustomInput
              class="accent-havelock-blue-700"
              name={`events.${index}.isRecurring`}
              type="checkbox"
              value="true"
              checked={isRecurring}
            ></CustomInput>
          </label>
          <label class="flex w-full flex-col gap-y-1 text-xs text-slate-800">
            Event Description*
            <CustomInput
              name={`events.${index}.eventDescription`}
              defaultValue={description}
            ></CustomInput>
          </label>
        </section>
      </div>
    );
  }
);
