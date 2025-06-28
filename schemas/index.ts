import { z } from "zod";

export const emailFormSchema = z.object({
  senderName: z.string().min(1, "This field is required"),
  emailPurpose: z.enum([
    "follow-up",
    "job-application",
    "to-ceo",
    "referrals",
    "product-promotion",
  ]),
  subject: z.string().min(1, "This field is required"),
  emailTone: z.enum([
    "formal",
    "informal",
    "enthusiastic",
    "concise",
    "friendly",
  ]),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, "This field is required"),
        link: z.string().url("Invalid URL"),
      })
    )
    .max(4, "You can add up to 4 social links"),
  skills: z.string().min(1, "Skills/USP is required"),
});

export type emailFormType = z.infer<typeof emailFormSchema>;
