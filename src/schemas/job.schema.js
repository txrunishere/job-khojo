import { z } from "zod";

const jobInputSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job Description is required!!").max(100),
  location: z.string().min(1, "Location is required"),
  company: z.string().min(1, "Company is required"),
});

export { jobInputSchema };
