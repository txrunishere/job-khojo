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
  SelectItem,
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
    if (sessionLoaded) fnGetAllJobs({ title, company, location });
  }, [sessionLoaded]);

  useEffect(() => {
    if (!sessionLoaded) return;
    fnGetAllJobs({
      title,
      company,
      location,
    });
  }, [location, company]);

  const handleFilterLocationChange = (value) => setLocation(value);

  const handleFilterCompanyChange = (value) => setCompany(value);

  const handleTitleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleClearFilters = async () => {
    setTitle("");
    setCompany("");
    setLocation("");
    await fnGetAllJobs({});
  };

  const handleTitleSearch = async (e) => {
    e.preventDefault();
    if (!title) return;

    await fnGetAllJobs({
      title,
    });
  };

  if (!sessionLoaded) {
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );
  }

  return (
    <div>
      {/* HEADING */}
      <section>
        <Heading>Top Jobs</Heading>
      </section>
      <div className={"px-4 py-8"}>
        {!jobsLoading && (
          <div>
            {/* FILTERS */}
            <div className="mx-auto max-w-4xl space-y-3 py-6">
              <form className={"flex gap-2"} onSubmit={handleTitleSearch}>
                <Input
                  value={title}
                  onChange={handleTitleInputChange}
                  type={"text"}
                  placeholder={"Enter title or keyword"}
                />
                <Button>Search</Button>
              </form>
              <div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                    <Select onValueChange={handleFilterCompanyChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Companies</SelectLabel>
                          <SelectItem value={56}>IBM</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={handleFilterLocationChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Locations</SelectLabel>
                          <SelectItem value={"delhi"}>Delhi</SelectItem>
                          <SelectItem value={"Manipur"}>Manipur</SelectItem>
                          <SelectItem value={"Punjab"}>Punjab</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button
                      onClick={handleClearFilters}
                      className={"w-full"}
                      variant={"destructive"}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {jobs?.filter((job) => job.isOpen)?.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {jobs
                    .filter((job) => job.isOpen)
                    .map((job) => {
                      const key = job.id;
                      return <JobCard key={key} job={job} />;
                    })}
                </div>
              </div>
            ) : (
              <p className="py-10 text-center sm:text-lg">No Jobs Found!!</p>
            )}
          </div>
        )}
      </div>
      {jobsLoading && (
        <div className="px-4 py-8">
          <BarLoader width={"100%"} color={"white"} />
        </div>
      )}
    </div>
  );
}
