import { getAllJobs } from "@/api/jobs.api";
import { Heading, JobCard } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/hooks";
import { useSession } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function JobListings() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");

  const {
    fn: fnGetAllJobs,
    data: jobs,
    isLoading: jobsLoading,
  } = useSupabase(getAllJobs);
  const { isLoaded: sessionLoaded } = useSession();

  useEffect(() => {
    if (sessionLoaded) fnGetAllJobs();
  }, [sessionLoaded]);

  if (!sessionLoaded)
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );

  return (
    <div>
      <section>
        <Heading>Top Jobs</Heading>
      </section>
      {jobsLoading && (
        <div className="px-4 py-8">
          <BarLoader width={"100%"} color={"white"} />
        </div>
      )}
      <div className={"px-4 py-8"}>
        {!jobsLoading &&
          (jobs?.length > 0 ? (
            <div>
              <div className="mx-auto max-w-4xl space-y-3 py-6">
                <div className="flex gap-2">
                  <Input type={"text"} placeholder={"Enter title or keyword"} />
                  <Button>Search</Button>
                </div>
                <div>
                  <div className="flex gap-3">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Companies</SelectLabel>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Locations</SelectLabel>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <div>
                      <Button variant={"destructive"}>Clear Filters</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => {
                  const key = job.id;
                  return <JobCard key={key} job={job} />;
                })}
              </div>
            </div>
          ) : (
            <p className="py-10 text-center sm:text-lg">No Jobs Found!!</p>
          ))}
      </div>
    </div>
  );
}
