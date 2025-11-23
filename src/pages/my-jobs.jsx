import { fetchMyApplications } from "@/api/application.api";
import { Heading, JobCard } from "@/components";
import { useSupabase } from "@/hooks";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

export const MyJobs = () => {
  const { isLoaded: sessionLoaded, user } = useUser();
  const {
    fn: fnFetchMyApplications,
    data: myApplication,
    isLoading: myApplicationLoading,
  } = useSupabase(fetchMyApplications);

  useEffect(() => {
    if (!sessionLoaded) return;
    fnFetchMyApplications({ user_id: user.id });
  }, [sessionLoaded]);

  if (!sessionLoaded) {
    return (
      <div className="px-3">
        <BarLoader width={"100%"} color="white" />
      </div>
    );
  }

  return (
    <div>
      <section>
        <Heading>My Jobs</Heading>
      </section>
      {myApplicationLoading ? (
        <div className="px-3">
          <BarLoader className="my-10" width={"100%"} color="white" />
        </div>
      ) : (
        <div className="px-4 py-10">
          {myApplication?.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {myApplication?.map((application) => (
                <JobCard key={application.id} job={application.job} />
              ))}
            </div>
          ) : (
            <p>You don't apply to for any job till now</p>
          )}
        </div>
      )}
    </div>
  );
};
