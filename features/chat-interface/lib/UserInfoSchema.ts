import { z } from "zod";

export const UserInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email address is required"),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;
