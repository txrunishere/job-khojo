import { InputField } from "..";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { jobInputSchema } from "@/schemas";
import { useSession } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { SelectJobLocation } from "./select-job-location";
import { SelectJobCompany } from "./select-job-company";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { IsOpenJobSelect } from "./isopen-job.select";
import { JobEmploymentTypeSelect } from "./job-employment-type-select";
import { RequirementsTextEditor } from "./requirements-text-editor";
import { useSupabase } from "@/hooks";
import { insertJobSupabase, fetchStates } from "@/api/jobs.api";
import { getAllCompanies } from "@/api/company.api";

export const PostJobForm = () => {
  const { isLoaded } = useSession();
  const [handleJobFormLoading, setHandleJobFormLoading] = useState(false);

  const {
    isLoading: companiesLoading,
    data: companiesData,
    fn: fnGetCompanies,
  } = useSupabase(getAllCompanies);

  const { fn: fnInsertJob } = useSupabase(insertJobSupabase);

  useEffect(() => {
    if (isLoaded) fnGetCompanies();
  }, [isLoaded]);

  const methods = useForm({
    resolver: zodResolver(jobInputSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      company: "",
      description: "",
      location: "",
      title: "",
      experience: 0,
      salary_end: 0,
      salary_start: 0,
      employment_type: "",
      isOpen: true,
      requirements: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: jobErrors },
  } = methods;

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: () => fetchStates(),
  });

  function safeParseCompany(val) {
    try {
      return JSON.parse(val)?.id ?? null;
    } catch {
      return null;
    }
  }

  const handleAddJob = useMutation({
    mutationFn: async (formData) => {
      setHandleJobFormLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        experience: Number(formData.experience),
        "salary-start": Number(formData.salary_start),
        "salary-end": Number(formData.salary_end),
        isOpen: formData.isOpen,
        company_id: safeParseCompany(formData.company),
        location: formData.location,
        employment_type: formData.employment_type,
      };

      const result = await fnInsertJob(payload); // return actual value
      return result;
    },

    onSuccess: () => {
      toast.success("Job added successfully!!");
      setHandleJobFormLoading(false);
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
      setHandleJobFormLoading(false);
    },
  });

  const isLoadingOverall =
    statesLoading || companiesLoading || !isLoaded || handleJobFormLoading;

  if (isLoadingOverall) {
    return (
      <div className="px-3">
        <BarLoader width={"100%"} color="white" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <FormProvider {...methods}>
        <form
          className="space-y-8"
          onSubmit={handleSubmit((formData) => handleAddJob.mutate(formData))}
        >
          {/* TITLE */}
          <InputField>
            <Label htmlFor="title">Job Title</Label>
            <Input
              {...register("title")}
              type="text"
              id="title"
              placeholder="ex. DevOps Engineer"
            />
            {jobErrors.title && (
              <p className="text-sm text-red-500">{jobErrors.title.message}</p>
            )}
          </InputField>

          {/* DESCRIPTION */}
          <InputField>
            <Label htmlFor="description">Job Description</Label>
            <Input type="text" id="description" {...register("description")} />
            {jobErrors.description && (
              <p className="text-sm text-red-500">
                {jobErrors.description.message}
              </p>
            )}
          </InputField>

          {/* LOCATION + COMPANY */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <SelectJobLocation statesData={statesData} />
            <SelectJobCompany
              statesData={statesData}
              companyList={companiesData}
            />
          </div>

          {/* EXPERIENCE + SALARY */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-3">
            <SalarySelect />
          </div>

          {/* REQUIREMENTS */}
          <RequirementsTextEditor />

          {/* EMPLOYMENT TYPE + ISOPEN */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <JobEmploymentTypeSelect />
            <IsOpenJobSelect />
          </div>

          {/* SUBMIT */}
          <Button
            disabled={handleJobFormLoading}
            className="w-full"
            type="submit"
          >
            {handleJobFormLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

const SalarySelect = () => {
  const {
    formState: { errors: jobErrors },
    register,
  } = useFormContext();

  return (
    <>
      <InputField>
        <Label htmlFor="experience">Experience (in months)</Label>
        <Input type="number" id="experience" {...register("experience")} />
        {jobErrors.experience && (
          <p className="text-sm text-red-500">{jobErrors.experience.message}</p>
        )}
      </InputField>

      <InputField>
        <Label htmlFor="salary-start">Salary Start</Label>
        <Input type="number" id="salary-start" {...register("salary_start")} />
        {jobErrors.salary_start && (
          <p className="text-sm text-red-500">
            {jobErrors.salary_start.message}
          </p>
        )}
      </InputField>

      <InputField>
        <Label htmlFor="salary-end">Salary End</Label>
        <Input type="number" id="salary-end" {...register("salary_end")} />
        {jobErrors.salary_end && (
          <p className="text-sm text-red-500">{jobErrors.salary_end.message}</p>
        )}
      </InputField>
    </>
  );
};
