import { RequestHandler } from "express";
import {
  DateSpecificSchema,
  TaskDetailsSchema,
  TaskSchema,
  TaskSpecificSchema,
} from "../models/taskModels";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  updateTaskService,
} from "../services/taskServices";

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const { name, date } = TaskSchema.partial({ complete: true }).parse(
      req.body
    );
    const task = await createTaskService({ name, date, userId });
    res.status(200).json({
      data: {
        task,
      },
      errorCode: 0,
      errorMessage: "",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const { name, date, complete, id } = TaskSchema.partial()
      .merge(TaskSpecificSchema)
      .parse(req.body);
    const task = await updateTaskService({ name, date, userId, complete, id });
    res.status(200).json({
      data: {
        task,
      },
      errorCode: 0,
      errorMessage: "",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const { id } = TaskSpecificSchema.parse(req.params);
    const task = await deleteTaskService({ id, userId });
    res.status(200).json({
      data: {
        task,
      },
      errorCode: 0,
      errorMessage: "",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getBacklog: RequestHandler = (req, res, next) => {
  try {
    const userId = req.session.user!;
  } catch (error) {
    next(error);
  }
};

export const getTaskCounts: RequestHandler = (req, res, next) => {
  try {
    const userId = req.session.user!;
  } catch (error) {
    next(error);
  }
};

export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const { date } = DateSpecificSchema.partial({ date: true }).parse(
      req.query
    );
    const tasks = await getTasksService({ userId, date });
    res.status(200).json({
      success: true,
      data: {
        tasks,
      },
      errorCode: 0,
      errorMessage: "",
    });
  } catch (error) {
    next(error);
  }
};
