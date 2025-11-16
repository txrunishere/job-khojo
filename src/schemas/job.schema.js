import { z } from "zod";

export const jobInputSchema = z
  .object({
    title: z.string().trim().min(3, "Job title must be at least 3 characters"),

    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters")
      .max(5000, "Description cannot exceed 5000 characters"),

    location: z.string().trim().min(2, "Location is required"),

    company: z.string().trim().min(2, "Company name is required"),

    employment_type: z.enum(
      ["Full Time", "Part Time", "Contract", "Internship", "Remote"],
      { error: "Choose a type for job" },
    ),

    experience: z.coerce
      .number()
      .min(0, "Experience cannot be negative")
      .max(30, "Experience cannot exceed 30 years"),

    salary_start: z.coerce
      .number()
      .min(0, "Salary start cannot be negative")
      .max(5000000, "Salary cannot exceed 50 LPA"),
    salary_end: z.coerce
      .number()
      .min(0, "Salary end cannot be negative")
      .max(5000000, "Salary cannot exceed 50 LPA"),

    isOpen: z.boolean(),

    requirements: z
      .string()
      .min(5, "Requirements must be at least 5 characters"),
  })
  .refine((data) => data.salary_end >= data.salary_start, {
    message: "Salary end must be greater than or equal to salary start",
    path: ["salary_end"],
  });
