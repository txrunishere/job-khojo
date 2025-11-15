import { InputField } from "../";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { jobInputSchema } from "@/schemas";
import { fetchStates, getCompanies } from "@/shared/api/api";
import { useSession } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { SelectJobLocation } from "./select-job-location";
import { SelectJobCompany } from "./select-job-company";
import { cn } from "@/lib/utils";

export const PostForm = () => {
  const { isLoaded, session } = useSession();

  const methods = useForm({
    resolver: zodResolver(jobInputSchema),
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
      skills: "",
    },
  });

  const employment_type_values = [
    "Full Time",
    "Part Time",
    "Contract",
    "Internship",
    "Remote",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: jobErrors, isSubmitting: handleJobFormLoading },
  } = methods;

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: () => fetchStates(),
  });

  const { data: companyList, isLoading: companyLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => await getCompanies(session),
  });

  const handleAddJob = (data) => {
    console.log("Job Added", data);
  };

  const handleJobStatusValueChange = (value) =>
    setValue("isOpen", value === "open" ? true : false, {
      shouldValidate: true,
    });

  const handleJobEmploymentTypeValueChange = (value) =>
    setValue("employment_type", value, { shouldValidate: true });

  if (statesLoading && !isLoaded && companyLoading) {
    return (
      <div className="px-3">
        <BarLoader width={"100%"} color="white" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <FormProvider {...methods}>
        <form className="space-y-8" onSubmit={handleSubmit(handleAddJob)}>
          {/* Title Field */}

          <InputField>
            <Label htmlFor="title">Job Title</Label>
            <Input
              {...register("title")}
              type="text"
              id="title"
              placeholder="ex. Devops Enginner"
            />
            {jobErrors.title && (
              <p className="text-sm text-red-500">{jobErrors.title.message}</p>
            )}
          </InputField>
          {/* Description Field */}

          <InputField>
            {/* Add a text count  */}
            <Label htmlFor="description">Job Description</Label>
            <Input type="text" id="description" {...register("description")} />
            {jobErrors.description && (
              <p className="text-sm text-red-500">
                {jobErrors.description.message}
              </p>
            )}
          </InputField>
          {/* Location and Company field */}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* Location */}
            <SelectJobLocation statesData={statesData} />

            {/* Company */}
            <SelectJobCompany
              statesData={statesData}
              companyList={companyList}
            />
          </div>
          {/* isOpen, expirence, and salary */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            <InputField>
              <Label htmlFor="expirence">Expirence (in months)</Label>
              <Input
                type={"number"}
                id="expirence"
                {...register("experience")}
              />
              {jobErrors.experience && (
                <p className="text-sm text-red-500">
                  {jobErrors.experience.message}
                </p>
              )}
            </InputField>
            <InputField>
              <Label htmlFor="salary-start">Salary (start)</Label>
              <Input
                type={"number"}
                id="salary-start"
                {...register("salary_start")}
              />
              {jobErrors.salary_start && (
                <p className="text-sm text-red-500">
                  {jobErrors.salary_start.message}
                </p>
              )}
            </InputField>
            <InputField>
              <Label htmlFor="salary-end">Salary (end)</Label>
              <Input
                type={"number"}
                id="salary-end"
                {...register("salary_end")}
              />
              {jobErrors.salary_end && (
                <p className="text-sm text-red-500">
                  {jobErrors.salary_end.message}
                </p>
              )}
            </InputField>
            <div className={cn("flex")}>
              <InputField>
                <div className="py-[7px]"></div>
                <Select
                  defaultValue="open"
                  onValueChange={handleJobStatusValueChange}
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select Job Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"open"}>OPEN</SelectItem>
                      <SelectItem value={"close"}>CLOSE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {jobErrors.isOpen && (
                  <p className="text-sm text-red-500">
                    {jobErrors.isOpen.message}
                  </p>
                )}
              </InputField>
            </div>
          </div>
          {/* Employment Type and skills */}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-end">
              <div
                className={cn(
                  "w-full",
                  jobErrors.employment_type ? "space-y-3" : "space-y-0",
                )}
              >
                <Select onValueChange={handleJobEmploymentTypeValueChange}>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {employment_type_values.map((item) => (
                        <SelectItem
                          value={item.trim().split(" ").join("-").toLowerCase()}
                          key={item}
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {jobErrors.employment_type && (
                  <p className="text-sm text-red-500">
                    {jobErrors.employment_type.message}
                  </p>
                )}
              </div>
            </div>
            <InputField>
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder={"Enter skills separated by commas"}
                {...register("skills")}
              />
              {jobErrors.skills && (
                <p className="text-sm text-red-500">
                  {jobErrors.skills.message}
                </p>
              )}
            </InputField>
          </div>
          {/* Submit Button */}

          <div>
            <Button
              disabled={handleJobFormLoading}
              className={"w-full"}
              type={"submit"}
            >
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
