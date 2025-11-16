import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import ClipLoader from "react-spinners/ClipLoader";
import { getAllJobs } from "@/api/jobs.api";
import { BarLoader } from "react-spinners";

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
  });

  if (isLoading || !isLoaded) {
    return (
      <div className="px-2">
        <BarLoader color="white" width={"100%"} />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return <p className="py-5 text-center text-gray-500">No jobs found.</p>;
  }

  return (
    <div className="space-y-2 px-2">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="rounded-lg border p-4 shadow-sm transition hover:shadow"
        >
          <h2 className="text-lg font-semibold">{job.title}</h2>
          <p className="text-gray-600">{job.company}</p>
          <p className="mt-2 text-sm">{job.description}</p>
        </div>
      ))}
    </div>
  );
}
