import { z } from "zod";

const ALLOWED_LOGO_MIME = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/jpg",
];
const MAX_LOGO_BYTES = 5 * 1024 * 1024;

const applicationInputSchema = z.object({
  experience: z.coerce
    .number({
      required_error: "Experience is required",
      invalid_type_error: "Experience must be a number",
    })
    .min(0, "Experience must be positive"),

  skills: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .refine((arr) => arr.length > 0, {
      message: "At least one skill is required",
    }),

  education: z.enum(["graduate", "post_graduate", "under_graduate"], {
    required_error: "Education status is required",
  }),

  resume: z
    .instanceof(File)
    .refine((file) => ALLOWED_LOGO_MIME.includes(file.type), {
      message: "Logo must be PNG, JPG, or SVG",
    })
    .refine((file) => file.size <= MAX_LOGO_BYTES, {
      message: "Max size is 5MB",
    }),
});

export { applicationInputSchema };
