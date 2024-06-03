import {
  type InputHTMLAttributes,
  component$,
  type QRL,
} from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

type TaskInputProps = InputHTMLAttributes<HTMLInputElement> & {
  taskName: string;
  class?: string;
  onTaskNameUpdate: QRL<(name: string) => void>;
  onTaskDelete: QRL<() => void>;
};

export const TaskInput = component$(
  ({
    class: className,
    onTaskNameUpdate,
    onTaskDelete,
    taskName,
    ...props
  }: TaskInputProps) => {
    return (
      <>
        <input
          class={twMerge(
            "rounded-md p-2 text-sm focus:bg-havelock-blue-100 focus:outline-none disabled:opacity-50",
            className,
          )}
          value={taskName}
          onKeyDown$={(e) => {
            if (e.key === "Escape") {
              (e.target as HTMLInputElement).value = taskName;
              (e.target as HTMLInputElement).blur();
            }
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
            if (
              e.key === "Backspace" &&
              (e.target as HTMLInputElement).value === ""
            ) {
              onTaskDelete();
            }
          }}
          onBlur$={(e) => {
            const newValue = (e.target as HTMLInputElement).value.trim();
            if (newValue !== taskName) {
              onTaskNameUpdate(newValue);
            }
          }}
          {...props}
        />
      </>
    );
  },
);
