import { Blocks, Download, School } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSupabase } from "@/hooks";
import { updateApplicationStatus } from "@/api/application.api";
import { toast } from "sonner";

dayjs.extend(advancedFormat);

export const ApplicationCard = ({
  application,
  applicationStatusList = [],
  isRecruiter = false,
}) => {
  let educationStatus = application.education_status
    .split("_")
    .map((e) => e[0].toUpperCase() + e.slice(1))
    .join(" ");

  const applicationStatus =
    application.application_status.trim()[0].toUpperCase() +
    application.application_status.slice(1);

  const handleOpenResume = () => {
    const link = document.createElement("a");
    link.setAttribute("href", application?.resume);
    link.setAttribute("target", "_blank");
    link.click();
  };

  const { fn: fnUpdateApplicationStatus, isLoading: changeApplicationLoading } =
    useSupabase(updateApplicationStatus);

  const handleApplicationStatusChange = async (value, applicationId) => {
    await fnUpdateApplicationStatus({
      applicationId,
      applicationStatus: value,
    });
    toast.success(`Application status changed to ${value} successfully!!`);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{application.name}</CardTitle>
        <CardDescription>
          <Button
            onClick={handleOpenResume}
            variant={"icon-sm"}
            className={"cursor-pointer"}
          >
            <Download />
          </Button>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-3 font-semibold">
          <p>{application.experience} months of experience</p>
          <p className="flex items-center gap-1">
            <School size={14} /> {educationStatus}
          </p>
          <p className="flex items-center gap-1">
            <Blocks size={14} /> {application.skills.join(", ")}
          </p>
        </div>
        <div className="mt-6 h-px w-full bg-neutral-600"></div>
      </CardContent>

      <CardFooter className="flex-wrap justify-between gap-3">
        <p>{dayjs(application.created_at).format("MMMM Do YYYY, h:mm a")}</p>

        <div className="flex items-center gap-2">
          <p>Status:</p>
          {isRecruiter ? (
            <Select
              disabled={changeApplicationLoading}
              defaultValue={application.application_status}
              onValueChange={(value) =>
                handleApplicationStatusChange(value, application.id)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {applicationStatusList.map((status) => (
                  <SelectItem key={status} value={status.toLowerCase()}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>{applicationStatus}</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
