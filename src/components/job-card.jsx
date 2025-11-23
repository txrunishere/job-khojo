import { Heart, MapPin } from "lucide-react";
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

export const JobCard = ({ job }) => {
  const { savedJobs, toggleSave } = useSavedJobs();

  const isSaved = savedJobs?.includes(job.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{job.title}</CardTitle>
          <Button
            variant={"outline"}
            onClick={() => toggleSave(job.id)}
            size={"icon-sm"}
          >
            {isSaved ? <Heart fill="white" /> : <Heart />}
          </Button>
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
  );
};
