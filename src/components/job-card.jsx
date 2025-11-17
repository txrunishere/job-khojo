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

export const JobCard = ({ job }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{job.title}</CardTitle>
          <Button variant={"outline"} size={"icon-sm"}>
            <Heart />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <img className="h-7" src={job.company.logo_url} alt="" />
          <p className="flex items-center gap-2">
            <MapPin size={20} /> <span>{job.location}</span>
          </p>
        </div>
        <div className="my-4 h-px w-full bg-gray-300"></div>
        <CardDescription>{job.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button className={"w-full"}>More Details</Button>
      </CardFooter>
    </Card>
  );
};
