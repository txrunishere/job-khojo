import { CompantForm, Heading, InputField } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { useSession } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStates, getCompanies } from "@/shared/api/api";

export const PostJob = () => {
  const { isLoaded, session } = useSession();

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: () => fetchStates(),
  });

  const { data: companyList, isLoading: companyLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => await getCompanies(session),
  });

  const handleAddJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Job Added");
  };

  if (statesLoading && !isLoaded && companyLoading) {
    return (
      <div className="px-3">
        <BarLoader width={"100%"} color="white" />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4">
      <section>
        <Heading>Post a Job</Heading>
      </section>
      <div className="mx-auto max-w-5xl">
        <form className="space-y-8" onSubmit={handleAddJob}>
          <InputField>
            <Label htmlFor="title">Job Title</Label>
            <Input type="text" id="title" placeholder="ex. Devops Enginner" />
          </InputField>
          <InputField>
            <Label htmlFor="description">Job Description</Label>
            <Input type="text" id="description" />
          </InputField>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Select>
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
            </div>
            <div className="flex gap-2">
              <Select>
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
                      <SelectItem key={company.id} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <CompantForm states={statesData} />
            </div>
          </div>
          <div>
            <Button className={"w-full"} type={"submit"}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
