import { z } from "zod";

export const emailFormSchema = z.object({
  emailPurpose: z.enum([
    "follow-up",
    "job-application",
    "to-ceo",
    "referrals",
    "product-promotion",
  ]),
  subject: z.string().min(1, "Subject is required"),
  emailTone: z.enum(["Shorter", "Longer", "Simple", "Casual", "Professional"]),
  socialLinks: z
    .array(
      z.object({
        platForm: z.string().min(1, "Platform is required"),
        link: z.string().url("Must be valid URL"),
      })
    )
    .max(4, "You can only add upto 4 social links"),
});

export type emailFormType = z.infer<typeof emailFormSchema>;
