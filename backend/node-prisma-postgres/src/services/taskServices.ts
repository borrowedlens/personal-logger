import { z } from "zod";
import {
  DateSpecificSchema,
  TaskSchema,
  TaskSpecificSchema,
  UserSpecificDateOptionalSchema,
} from "../models/taskModels";
import { prismaClient } from "../app";
import { UserSpecificSchema } from "../models/userModels";

const CreateTaskSchema = TaskSchema.partial({
  complete: true,
}).merge(UserSpecificSchema);

export const createTaskService = async ({
  name,
  date,
  userId,
}: z.infer<typeof CreateTaskSchema>) => {
  const task = await prismaClient.task.create({
    data: {
      name,
      date,
      complete: false,
      userId,
    },
  });
  return task;
};

const UpdateTaskSchema = TaskSchema.partial()
  .merge(TaskSpecificSchema)
  .merge(UserSpecificSchema);

export const updateTaskService = async ({
  id,
  userId,
  ...task
}: z.infer<typeof UpdateTaskSchema>) => {
  const updatedTask = prismaClient.task.update({
    where: {
      id: id,
      AND: {
        userId: userId,
      },
    },
    data: {
      ...task,
    },
  });
  return updatedTask;
};

export const getTasksService = async ({
  userId,
  date,
}: z.infer<typeof UserSpecificDateOptionalSchema>) => {
  const where = date
    ? {
        date: date,
        AND: {
          userId: userId,
        },
      }
    : { date: null, AND: { userId: userId } };
  const tasks = await prismaClient.task.findMany({
    where: where,
    orderBy: {
      createdAt: "desc",
    },
  });
  return tasks;
};

const DeleteTaskSchema = TaskSpecificSchema.merge(UserSpecificSchema);

export const deleteTaskService = async ({
  userId,
  id,
}: z.infer<typeof DeleteTaskSchema>) => {
  const deletedTask = await prismaClient.task.delete({
    where: {
      id,
      AND: {
        userId: userId,
      },
    },
  });
  return deletedTask;
};
