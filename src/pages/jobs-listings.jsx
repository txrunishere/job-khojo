import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import { getAllJobs } from "@/api/jobs.api";
import { BarLoader } from "react-spinners";
import { Heading, JobCard } from "@/components";

export function JobListings() {
  const { session, isLoaded } = useSession();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const token = await session.getToken({
        template: "supabase",
      });

      const res = await getAllJobs(token);

      return res;
    },
    enabled: !isLoaded,
  });

  if (isLoading || !isLoaded) {
    return (
      <div className="px-2">
        <BarLoader color="white" width={"100%"} />
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4 sm:px-2">
      <section>
        <Heading>Latest Jobs</Heading>
      </section>
      <main className="py-10">
        <div className="mb-10">Filters</div>
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-neutral-400">No Jobs Found!!</p>
        )}
      </main>
    </div>
  );
}
