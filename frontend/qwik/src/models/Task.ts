import { z } from "@builder.io/qwik-city";

export const TaskSpecificSchema = z.object({
  id: z.coerce.number(),
});

export const TaskSchema = z.object({
  name: z.string(),
  complete: z.boolean(),
  date: z.string().nullable(),
});

export const TaskDetailsSchema = TaskSchema.merge(TaskSpecificSchema);

export const TasksSchema = z.array(TaskDetailsSchema);

export const DateSpecificSchema = z.object({
  date: z.string().nullable(),
});
