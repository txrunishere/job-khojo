import { getJobById } from "@/api/jobs.api";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/hooks";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Banknote,
  BriefcaseBusiness,
  DoorClosed,
  DoorOpen,
  MapPin,
} from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { BarLoader } from "react-spinners";

export const Jobs = () => {
  const { id } = useParams();
  const { isLoaded: sessionLoaded } = useUser();
  const { data: jobData, fn: fnGetJobById } = useSupabase(getJobById);

  console.log(jobData);

  useEffect(() => {
    if (sessionLoaded) fnGetJobById({ job_id: id });
  }, [sessionLoaded]);

  if (!sessionLoaded) {
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* TITLE + COMPANY LOGO */}
      <div className="flex items-center justify-between p-4">
        <section>
          <h1 className="max-w-md bg-linear-to-r from-neutral-400 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent sm:max-w-xl sm:text-5xl">
            {jobData?.[0]?.title}
          </h1>
        </section>
        <div>
          <img className="h-10" src={jobData?.[0]?.company.logo_url} alt="" />
        </div>
      </div>

      {/* LOCATION + TOTAL NUMBER OF APPLICATION + ISOPEN STATUS */}
      <div className="mx-auto flex max-w-3xl justify-between">
        <div>
          <p className="flex items-center gap-1 font-bold">
            <MapPin size={20} /> <span>{jobData?.[0]?.location}</span>
          </p>
        </div>
        <div>
          <p className="font-bold">
            {jobData?.[0].applications?.length} applications
          </p>
        </div>
        <div className="font-bold">
          {jobData?.[0]?.isOpen ? (
            <p className="flex gap-1">
              <DoorOpen /> <span>OPEN</span>
            </p>
          ) : (
            <p className="flex gap-1">
              <DoorClosed /> <span>CLOSED</span>
            </p>
          )}
        </div>
      </div>

      {/* SALARY + EXPERIENCE */}
      <div>
        <div>
          <p className="flex items-center gap-1">
            <Banknote size={20} />
            {jobData?.[0]?.["salary-start"]} - {jobData?.[0]?.["salary-end"]}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1">
            <BriefcaseBusiness size={20} />
            {jobData?.[0]?.experience} (months) required
          </p>
        </div>
      </div>

      {/* REQUIREMENTS */}
      <div>
        <MDEditor.Markdown
          source={jobData?.[0].requirements}
          style={{
            whiteSpace: "pre-wrap",
            display: "flex",
            flexDirection: "column",
            padding: "40px",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* APPLY BUTTON */}
      <div>
        <Button className={"w-full"}>Apply</Button>
      </div>
    </div>
  );
};
