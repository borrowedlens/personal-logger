import { component$, useContext } from "@builder.io/qwik";
import { cn, generateThemeClass } from "~/lib/utils";
import { CustomButton } from "../button/custom-button";
import { ThemeContext } from "~/data/store";

export const Header = component$(() => {
  const theme = useContext(ThemeContext);
  return (
    <header class="absolute left-0 right-0 top-0 flex h-14 w-full items-center justify-between bg-slate-800 bg-opacity-30 px-6">
      <h1 class="text-xl text-white">Personal Logger</h1>
      <div class="flex items-center gap-x-2">
        <CustomButton
          variant="icon"
          class={cn(
            `h-5 w-5 rounded-sm border-[1px]`,
            generateThemeClass(theme.value, "bg", 500)
          )}
        ></CustomButton>
        <span class="text-sm text-white">Test User</span>
      </div>
    </header>
  );
});
