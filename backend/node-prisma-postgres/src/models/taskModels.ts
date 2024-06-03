import { z } from "zod";
import { UserSpecificSchema } from "./userModels";

export const TaskSpecificSchema = z.object({
  id: z.coerce.number(),
});

export const TaskSchema = z.object({
  name: z.string(),
  complete: z.boolean(),
  date: z.coerce.date().nullable(),
});

export const TaskDetailsSchema = TaskSchema.merge(TaskSpecificSchema);

export const DateSpecificSchema = z.object({
  date: z.coerce.date().nullable(),
});

export const UserSpecificDateOptionalSchema =
  DateSpecificSchema.partial().merge(UserSpecificSchema);

export const UserSpecificTaskSchema = TaskSchema.merge(UserSpecificSchema);

export const UserSpecificTaskDetailsSchema =
  TaskDetailsSchema.merge(UserSpecificSchema);
