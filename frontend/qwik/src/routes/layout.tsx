import {
  component$,
  Slot,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Header } from "~/components/header/header";
import { ThemeContext } from "~/data/store";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const theme = useSignal("havelock-blue");
  useContextProvider(ThemeContext, theme);
  return (
    <>
      <Header />
      <main class="h-full bg-app-radial-gradient from-havelock-blue-300 from-40% to-45% pt-14">
        <Slot />
      </main>
    </>
  );
});
