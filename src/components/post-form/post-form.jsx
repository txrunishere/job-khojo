import { CompanyForm, Heading, InputField } from "../";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { jobInputSchema } from "@/schemas";
import { fetchStates, getCompanies } from "@/shared/api/api";
import { useSession } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";

export const PostForm = () => {
  const { isLoaded, session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: jobErrors, isSubmitting: handleJobFormLoading },
  } = useForm({
    resolver: zodResolver(jobInputSchema),
    defaultValues: {
      company: "",
      description: "",
      location: "",
      title: "",
    },
  });

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

  const handleLocationValueChange = (value) =>
    setValue("location", value, { shouldValidate: true });

  const handleCompanyValueChange = (value) =>
    setValue("company", value, { shouldValidate: true });

  if (statesLoading && !isLoaded && companyLoading) {
    return (
      <div className="px-3">
        <BarLoader width={"100%"} color="white" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
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
          <div className="space-y-2">
            <Select defaultValue="" onValueChange={handleLocationValueChange}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select a Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Locations</SelectLabel>
                  {statesData?.map((state) => (
                    <SelectItem key={state.id} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {jobErrors.location && (
              <p className="text-sm text-red-500">
                {jobErrors.location.message}
              </p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Select defaultValue="" onValueChange={handleCompanyValueChange}>
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {companyList?.length > 0
                        ? "Companies"
                        : "Companies Not Found!!"}
                    </SelectLabel>
                    {companyList?.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={JSON.stringify(company)}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <CompanyForm states={statesData} />
            </div>
            {jobErrors.company && (
              <p className="text-sm text-red-500">
                {jobErrors.company.message}
              </p>
            )}
          </div>
        </div>

        {/* isOpen, expirence, and salary */}
        <div></div>
        <div>
          <Button className={"w-full"} type={"submit"}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
