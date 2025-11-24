import { Heading, JobCard } from "@/components";
import { useSavedJobs } from "@/context/SaveJobsContext";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

export const SavedJobs = () => {
  const { savedJobs } = useSavedJobs();
  const { isLoaded: isSessionLoaded } = useUser();

  if (!isSessionLoaded) {
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );
  }

  return (
    <div>
      <section>
        <Heading>Saved Jobs</Heading>
      </section>
      <div className="mt-10 px-4">
        {savedJobs?.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {savedJobs?.map((job) => (
              <JobCard key={job?.job?.id} job={job.job} />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400">No Saved jobs yet!!</p>
        )}
      </div>
    </div>
  );
};
