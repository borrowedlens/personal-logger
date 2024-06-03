import { z } from "zod";

export const SignupSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.union([z.string().length(0), z.string().length(10)]),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    dob: z.coerce.date(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const UserSpecificSchema = z.object({
  userId: z.coerce.number(),
});
