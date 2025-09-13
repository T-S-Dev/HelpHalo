import { z } from "zod";

export const ChatbotBasicInfoSchema = z.object({
  icon: z
    .string()
    .nonempty("Chatbot icon is required")
    .max(5, "Chatbot icon must be a single emoji")
    .transform((val) => val.trim()),
  name: z
    .string()
    .nonempty("Chatbot name is required")
    .transform((val) => val.trim()),
  description: z
    .string()
    .nonempty("Chatbot description is required")
    .transform((val) => val.trim()),
  isActive: z.boolean().default(true),
});


export type ChatbotBasicInfo = z.infer<typeof ChatbotBasicInfoSchema>;