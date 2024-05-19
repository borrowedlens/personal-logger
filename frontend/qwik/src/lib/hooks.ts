import {
  $,
  type QRL,
  useOnWindow,
  useSignal,
  useVisibleTask$,
  useTask$,
} from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";

export const useDebouncer = (fn: QRL<(args: any) => void>, delay: number) => {
  const timeoutId = useSignal<number>();

  return $((args: any) => {
    clearTimeout(timeoutId.value);
    timeoutId.value = Number(setTimeout(() => fn(args), delay));
  });
};

export const useBreakpoints = () => {
  const windowWidth = useSignal(0);

  const handleResize = $((width: number) => {
    windowWidth.value = width;
  });

  const debouncer = useDebouncer(handleResize, 1000);

  useOnWindow(
    "resize",
    $((event) => {
      debouncer((event.target as Window).innerWidth);
    })
  );

  useTask$(() => {
    if (isBrowser) {
      handleResize(window.innerWidth);
    }
  });

  return {
    isSM: windowWidth.value >= 640 && windowWidth.value < 768,
    isMD: windowWidth.value >= 768 && windowWidth.value < 1024,
    isLG: windowWidth.value >= 1024,
  };
};
