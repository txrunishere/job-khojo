import { Heart, MapPin, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router";
import { useSavedJobs } from "@/context/SaveJobsContext";
import { useState } from "react";
import { useSupabase } from "@/hooks";
import { deleteJob } from "@/api/jobs.api";
import { toast } from "sonner";

export const JobCard = ({ job, isRecruiter = false }) => {
  const { savedJobIds, toggleSave } = useSavedJobs();
  const [isModelOpen, setIsModelOpen] = useState(false);

  const { fn: fnDeleteJob, isLoading: deleteJobLoading } =
    useSupabase(deleteJob);

  const isSaved = savedJobIds?.includes(job?.id);

  const handleOpenDeleteModel = () => setIsModelOpen(true);

  const handleCloseDeleteModel = () => setIsModelOpen(false);

  const handleDeleteJob = async () => {
    await fnDeleteJob({ job_id: job.id });
    setIsModelOpen(false);
    toast.success("Job Deleted Successfully!!");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{job.title}</CardTitle>
            {!isRecruiter ? (
              <Button
                variant={"outline"}
                onClick={() => toggleSave(job.id)}
                size={"icon-sm"}
              >
                {isSaved ? <Heart fill="white" /> : <Heart />}
              </Button>
            ) : (
              <Button
                onClick={handleOpenDeleteModel}
                variant={"outline"}
                size={"icon-sm"}
              >
                <Trash />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <img className="h-7" src={job.company.logo_url} alt="" />
            <p className="flex items-center gap-1 text-sm">
              <MapPin size={18} /> <span>{job.location}</span>
            </p>
          </div>
          <div className="my-4 h-px w-full bg-gray-300"></div>
          <CardDescription>{job.description}</CardDescription>
        </CardContent>
        <CardFooter className={"mt-auto"}>
          <Link className="w-full" to={`/jobs/${job.id}`}>
            <Button className={"w-full"}>More Details</Button>
          </Link>
        </CardFooter>
      </Card>
      {isModelOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-card border-muted space-y-4 rounded-xl border p-6">
            <p className="text-lg font-bold">
              Are you sure! You want to delete this job ?
            </p>
            <div className="flex w-full flex-col gap-2">
              <Button
                onClick={handleDeleteJob}
                disabled={deleteJobLoading}
                variant={"destructive"}
                size={"sm"}
              >
                Delete
              </Button>
              <Button
                onClick={handleCloseDeleteModel}
                variant={"outline"}
                size={"sm"}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
