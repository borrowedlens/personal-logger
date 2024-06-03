import { type Signal, createContextId } from "@builder.io/qwik";

export const ThemeContext = createContextId<Signal<string>>("theme");
