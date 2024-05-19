import { LoginSchema } from "./userModels";

export const GetUserIdSchema = LoginSchema.omit({ password: true });
