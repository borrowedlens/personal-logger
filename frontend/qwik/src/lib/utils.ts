import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SUPPORTED_THEMES } from "./constants";

export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes));

export const generateThemeClass = (
  theme: string,
  coloringStyle: "bg" | "text",
  variant: number,
) => {
  return {
    [`${coloringStyle}-${theme}-${variant}`]: true,
  };
};

export const generateRandomTheme = (currentTheme: string): string => {
  const randomIndex = Math.floor(Math.random() * SUPPORTED_THEMES.length);
  if (SUPPORTED_THEMES[randomIndex] === currentTheme) {
    return generateRandomTheme(currentTheme);
  }
  return SUPPORTED_THEMES[randomIndex];
};

export const setSearchParam = (url: URL, formData: FormData, param: string) => {
  if (formData.get(param)) {
    url.searchParams.set(param, formData.get(param)?.toString() || "");
  }
};
