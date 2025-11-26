import { fetchMyApplications } from "@/api/application.api";
import { ApplicationCard, Heading, JobCard } from "@/components";
import { useSupabase } from "@/hooks";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { fetchJobsByRecruiter } from "@/api/jobs.api";

export const MyJobs = () => {
  const { isLoaded: sessionLoaded, user } = useUser();

  const role = user?.unsafeMetadata.role;
  const isRecruiter = role === "recruiter";

  const {
    fn: fnFetchMyApplications,
    data: myApplication,
    isLoading: myApplicationLoading,
  } = useSupabase(fetchMyApplications);

  const {
    fn: fnFetchPostedJobs,
    data: postedJobs,
    isLoading: postedJobsLoading,
  } = useSupabase(fetchJobsByRecruiter);

  useEffect(() => {
    if (!sessionLoaded) return;

    if (!isRecruiter) {
      fnFetchMyApplications({ user_id: user.id });
    }

    if (isRecruiter) {
      fnFetchPostedJobs({ user_id: user.id });
    }
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

      {/* Candidate View */}
      {!isRecruiter &&
        (myApplicationLoading ? (
          <div className="px-3">
            <BarLoader className="my-10" width={"100%"} color="white" />
          </div>
        ) : (
          <div className="px-4 py-10">
            {myApplication?.length > 0 ? (
              <div className="space-y-3">
                {myApplication.map((application) => (
                  <ApplicationCard
                    application={application}
                    key={application.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-400">
                You haven't applied for any job yet.
              </p>
            )}
          </div>
        ))}

      {/* Recruiter View */}
      {isRecruiter &&
        (postedJobsLoading ? (
          <div className="px-3">
            <BarLoader className="my-10" width={"100%"} color="white" />
          </div>
        ) : (
          <div className="px-4 py-10">
            {postedJobs?.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {postedJobs.map((job) => (
                  <JobCard key={job.id} job={job} isRecruiter={true} />
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-400">
                You haven't posted any job yet.
              </p>
            )}
          </div>
        ))}
    </div>
  );
};
