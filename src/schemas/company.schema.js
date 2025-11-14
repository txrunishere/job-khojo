import { z } from "zod";

const ALLOWED_LOGO_MIME = ["image/png", "image/jpeg", "image/svg+xml"];
const MAX_LOGO_BYTES = 5 * 1024 * 1024;

const companyInputSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website_url: z.string().url("Enter a valid website URL"),
  location: z.string().min(1, "Location is required"),
  logo: z
    .instanceof(File)
    .refine((file) => ALLOWED_LOGO_MIME.includes(file.type), {
      message: "Logo must be PNG, JPG, or SVG",
    })
    .refine((file) => file.size <= MAX_LOGO_BYTES, {
      message: "Max size is 5MB",
    }),
});

export { companyInputSchema };
