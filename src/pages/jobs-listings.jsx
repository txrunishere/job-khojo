import { getAllJobs } from "@/api/jobs.api";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";

export const JobListings = () => {
  const { isLoaded, session } = useSession();

  const fetchJobs = async () => {
    const token = await session.getToken({
      template: "supabase",
    });

    const res = await getAllJobs(token);
    console.log(res);
  };

  useEffect(() => {
    if (isLoaded && session !== undefined) fetchJobs();
  }, [isLoaded]);

  return <h1>Job Listings</h1>;
};
