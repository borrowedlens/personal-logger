import { $, component$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import {
  BsCheckLg,
  BsArrowRightSquareFill,
  BsArrowLeftSquareFill,
} from "@qwikest/icons/bootstrap";
import { format } from "date-fns";
import { OutlineButton } from "~/components/button/outline-button";
import { PrimaryButton } from "~/components/button/primary-button";
import { SecondaryButton } from "~/components/button/secondary-button";
import { TaskInput } from "~/components/task-input/task-input";
import { ENV } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { DateSpecificSchema, TasksSchema } from "~/models/Task";
import { useUpcomingEventsLoader } from "../../layout";
import { Calendar } from "~/components/calendar/calendar";
import { UpcomingEvents } from "~/components/events/events";
import type { BaseResponseSchema } from "~/models/Base";

export const useDayTasksLoader = routeLoader$<
  BaseResponseSchema<z.infer<typeof TasksSchema>>
>(async ({ params, request, fail }) => {
  const date = params.date;
  const res = await fetch(`${ENV.PUBLIC_API_URL}/tasks?date=${date}`, {
    method: "GET",
    headers: request.headers,
  });
  console.log("🚀 ~ > ~ res:upcomingEvents", res.statusText);
  console.log("🚀 ~ > ~ res:upcomingEvents", res.body);
  console.log("🚀 ~ > ~ res:upcomingEvents", res.text);
  if (!res.ok) {
    return fail(res.status, {
      data: [],
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch tasks, please refresh the page / try again later",
    });
  }
  const { data } = await res.json();
  try {
    TasksSchema.parse(data.tasks);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return fail(409, {
        data: [],
        errorCode: 409,
        success: false,
        errorMessage:
          "Could not fetch tasks, please refresh the page / try again later",
      });
    }
  }
  return { errorMessage: "", errorCode: 0, success: true, data: data.tasks };
});

export const useBacklogTasksLoader = routeLoader$<
  BaseResponseSchema<z.infer<typeof TasksSchema>>
>(async ({ request, fail }) => {
  const res = await fetch(`${ENV.PUBLIC_API_URL}/tasks`, {
    method: "GET",
    headers: request.headers,
  });
  console.log("🚀 ~ > ~ res:upcomingEvents", res.statusText);
  console.log("🚀 ~ > ~ res:upcomingEvents", res.body);
  console.log("🚀 ~ > ~ res:upcomingEvents", res.text);
  if (!res.ok) {
    return fail(res.status, {
      data: [],
      errorCode: res.status,
      success: false,
      errorMessage:
        "Could not fetch tasks, please refresh the page / try again later",
    });
  }
  const { data } = await res.json();
  console.log("🚀 ~ > ~ data:backlog", data);
  try {
    TasksSchema.parse(data.tasks);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return fail(409, {
        data: [],
        errorCode: 409,
        success: false,
        errorMessage:
          "Could not fetch tasks, please refresh the page / try again later",
      });
    }
  }
  return { errorMessage: "", errorCode: 0, success: true, data: data.tasks };
});

export const useCreateTaskAction = routeAction$(
  async ({ date }, { request, fail }) => {
    const stringifiedBody = JSON.stringify({
      name: "",
      date: date,
    });

    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key !== "content-length" && key !== "content-type") {
        headers.set(key, value);
      }
    }
    headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/task`, {
      method: "POST",
      body: stringifiedBody,
      headers: headers,
    });
    if (!res.ok) {
      return fail(res.status, {
        data: null,
        errorCode: res.status,
        success: false,
        errorMessage: "Could not create task",
      });
    }
    const { data } = await res.json();
    return {
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: data.task,
    };
  },
  zod$(DateSpecificSchema),
);

const UpdateTaskSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  complete: z.boolean().optional(),
  date: z.string().nullable().optional(),
});

export const useUpdateTaskAction = routeAction$(
  async ({ id, date, name, complete }, { request, fail }) => {
    const stringifiedBody = JSON.stringify({
      id,
      name,
      date,
      complete,
    });

    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key !== "content-length" && key !== "content-type") {
        headers.set(key, value);
      }
    }
    headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/task`, {
      method: "PATCH",
      body: stringifiedBody,
      headers: headers,
    });
    if (!res.ok) {
      return fail(res.status, {
        data: null,
        errorCode: res.status,
        success: false,
        errorMessage: "Could not update task",
      });
    }
    const { data } = await res.json();
    return {
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: data.task,
    };
  },
  zod$(UpdateTaskSchema),
);

const DeleteTaskSchema = z.object({
  id: z.number(),
});

export const useDeleteTaskAction = routeAction$(
  async ({ id }, { request, fail }) => {
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key !== "content-length" && key !== "content-type") {
        headers.set(key, value);
      }
    }
    headers.set("content-type", "application/json");

    const res = await fetch(`${ENV.PUBLIC_API_URL}/task/${id}`, {
      method: "DELETE",
      headers: headers,
    });
    if (!res.ok) {
      return fail(res.status, {
        data: null,
        errorCode: res.status,
        success: false,
        errorMessage: "Could not delete task",
      });
    }
    const { data } = await res.json();
    return {
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: data.task,
    };
  },
  zod$(DeleteTaskSchema),
);

export default component$(() => {
  const { params } = useLocation();
  const date = params.date;

  const events = useUpcomingEventsLoader();
  const tasks = useDayTasksLoader();
  const backlogTasks = useBacklogTasksLoader();

  const createTaskAction = useCreateTaskAction();
  const updateTaskAction = useUpdateTaskAction();
  const deleteTaskAction = useDeleteTaskAction();

  return (
    <>
      <div class="flex flex-col gap-x-3 gap-y-3 md:flex-row lg:flex-[0.4] lg:flex-col lg:gap-y-6">
        <Calendar
          upcomingDates={
            events.value.data
              ? events.value.data.map((event) =>
                  format(event.upcomingDate!, "MM-dd"),
                )
              : []
          }
        />
        <UpcomingEvents />
      </div>
      <div
        class="flex flex-1 gap-3 overflow-x-auto lg:gap-6 lg:overflow-hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <section
          class="flex min-w-full flex-col gap-y-3 rounded-lg bg-white p-2 sm:min-w-0 sm:flex-1 lg:p-3"
          style={{ scrollSnapAlign: "start" }}
        >
          <h2 class="text-center text-base lg:text-lg">
            {format(date, "LLL do, yyyy")}
          </h2>
          <div class="flex flex-col gap-y-1">
            {tasks.value.data?.map((task) => (
              <div
                key={`${task.id}-${task.name}`}
                class="flex items-center gap-x-1 px-3"
              >
                <SecondaryButton
                  class="rounded-sm p-0.5 md:p-0.5"
                  onClick$={async () => {
                    await updateTaskAction.submit({
                      id: task.id,
                      complete: task.complete ? false : true,
                    });
                  }}
                >
                  <span
                    class={cn(
                      "text-sm text-havelock-blue-700 opacity-0 transition-opacity duration-200",
                      {
                        "opacity-100": !!task.complete,
                      },
                    )}
                  >
                    <BsCheckLg />
                  </span>
                </SecondaryButton>
                <TaskInput
                  class={cn("flex-1", {
                    "line-through": task.complete,
                  })}
                  type="text"
                  taskName={task.name}
                  onTaskNameUpdate={$(async (name: string) => {
                    await updateTaskAction.submit({
                      id: task.id,
                      name: name,
                    });
                  })}
                  onTaskDelete={$(async () => {
                    await deleteTaskAction.submit({ id: task.id });
                  })}
                  disabled={!!task.complete}
                />
                <OutlineButton
                  title="Move to Backlog"
                  aria-label="Move to Backlog"
                  class="p-2 text-lg"
                  onClick$={async () => {
                    await updateTaskAction.submit({
                      id: task.id,
                      date: null,
                    });
                  }}
                >
                  <BsArrowRightSquareFill />
                </OutlineButton>
              </div>
            ))}
          </div>
          <PrimaryButton
            class="sm:mx-10"
            onClick$={async () => await createTaskAction.submit({ date: date })}
          >
            Add Task
          </PrimaryButton>
        </section>
        <section
          class="flex min-w-full flex-col gap-y-3 rounded-lg bg-white p-2 sm:min-w-0 sm:flex-1 lg:p-3"
          style={{ scrollSnapAlign: "start" }}
        >
          <h2 class="text-center text-base lg:text-lg">Backlog</h2>
          <div class="flex flex-col gap-y-1">
            {backlogTasks.value.data?.map((task) => (
              <div key={task.id} class="flex items-center gap-x-1">
                <OutlineButton
                  title="Move to Today"
                  aria-label="Mvoe to Today"
                  class="p-2 text-lg"
                  onClick$={async () => {
                    await updateTaskAction.submit({
                      id: task.id,
                      date: date,
                    });
                  }}
                >
                  <BsArrowLeftSquareFill />
                </OutlineButton>
                <TaskInput
                  class="flex-1"
                  type="text"
                  key={task.id}
                  taskName={task.name}
                  onTaskNameUpdate={$(async (name: string) => {
                    await updateTaskAction.submit({
                      id: task.id,
                      name: name,
                    });
                  })}
                  onTaskDelete={$(async () => {
                    await deleteTaskAction.submit({ id: task.id });
                  })}
                />
              </div>
            ))}
          </div>
          <PrimaryButton
            class="sm:mx-10"
            onClick$={async () => await createTaskAction.submit({ date: null })}
          >
            Add Task
          </PrimaryButton>
        </section>
      </div>
    </>
  );
});
