import { getJobById } from "@/api/jobs.api";
import { InputField } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSupabase } from "@/hooks";
import { useUser } from "@clerk/clerk-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import MDEditor from "@uiw/react-md-editor";
import {
  Banknote,
  BriefcaseBusiness,
  DoorClosed,
  DoorOpen,
  MapPin,
  StickyNote,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { BarLoader } from "react-spinners";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationInputSchema } from "@/schemas";
import { insertApplication } from "@/api/application.api";

export const Jobs = () => {
  const { id } = useParams();
  const { isLoaded: sessionLoaded, user } = useUser();
  const {
    data: jobData,
    fn: fnGetJobById,
    isLoading: jobLoading,
  } = useSupabase(getJobById);

  const {
    register,
    formState: { errors: applicationFormError },
    handleSubmit,
    setValue,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(applicationInputSchema),
    defaultValues: {
      education: "",
      experience: 0,
      resume: null,
      skills: "",
    },
  });

  const educationStatusArray = ["Graduate", "Post Graduate", "Under Graduate"];

  const handleApplicationForm = async (data) => {
    console.log(data);
  };

  const handleFileChange = (e) => {
    if (e.target?.files[0]) {
      setValue("resume", e.target.files[0], { shouldValidate: true });
    }
  };

  const handleEducationStatusChange = (value) =>
    setValue("education", value, {
      shouldValidate: true,
    });

  useEffect(() => {
    if (sessionLoaded) fnGetJobById({ job_id: id });
  }, [sessionLoaded]);

  if (!sessionLoaded || jobLoading) {
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );
  }

  return (
    <div>
      {!jobLoading && (
        <div className="space-y-8 px-4 py-6">
          {/* TITLE + COMPANY LOGO */}
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <section>
              <h1 className="max-w-md bg-linear-to-r from-neutral-400 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent sm:max-w-xl sm:text-5xl">
                {jobData?.[0].title}
              </h1>
            </section>
            <div>
              <img
                className="h-10"
                src={jobData?.[0].company.logo_url}
                alt=""
              />
            </div>
          </div>

          {/* JOB INFO */}
          <div className="space-y-6 py-6 text-sm font-bold sm:text-lg">
            <div>
              <p className="flex items-center gap-1">
                <MapPin size={18} /> <span>{jobData?.[0].location}</span>
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1">
                <StickyNote size={20} />
                {jobData?.[0].applications.length} applications
              </p>
            </div>
            <div className="">
              {jobData?.[0].isOpen ? (
                <p className="flex gap-1">
                  <DoorOpen size={20} /> <span>OPEN</span>
                </p>
              ) : (
                <p className="flex gap-1">
                  <DoorClosed size={20} /> <span>CLOSED</span>
                </p>
              )}
            </div>
            <div>
              <p className="flex items-center gap-1">
                <Banknote size={20} />
                {jobData?.[0]["salary-start"]} - {jobData?.[0]["salary-end"]}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1">
                <BriefcaseBusiness size={20} />
                {jobData?.[0].experience} (months) required
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
            <Drawer>
              <DrawerTrigger
                className={
                  "bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md py-1 font-bold"
                }
              >
                Apply
              </DrawerTrigger>
              <DrawerContent className={"pb-4"}>
                <DrawerHeader className={"w-full justify-start"}>
                  <DrawerTitle>
                    Apply for {jobData?.[0].title} at{" "}
                    {jobData?.[0].company.name}
                  </DrawerTitle>
                  <DrawerDescription>Fill the form below</DrawerDescription>
                </DrawerHeader>
                <div className="space-y-3 p-4">
                  <InputField>
                    <Input
                      {...register("experience")}
                      type={"text"}
                      placeholder={"Expirence (in months)"}
                    />
                    {applicationFormError.experience && (
                      <p className="text-sm text-red-500">
                        {applicationFormError.experience.message}
                      </p>
                    )}
                  </InputField>
                  <InputField>
                    <Input
                      {...register("skills")}
                      type={"text"}
                      placeholder={"Skills (comma seperated)"}
                    />
                    {applicationFormError.skills && (
                      <p className="text-sm text-red-500">
                        {applicationFormError.skills.message}
                      </p>
                    )}
                  </InputField>
                  <InputField>
                    <RadioGroup
                      onValueChange={handleEducationStatusChange}
                      defaultValue=""
                    >
                      {educationStatusArray.map((i, idx) => (
                        <div key={i} className="flex items-center gap-3">
                          <RadioGroupItem
                            value={i.trim().toLowerCase().split(" ").join("_")}
                            id={`r-${idx + 1}`}
                          />
                          <Label htmlFor={`r-${idx + 1}`}>{i}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {applicationFormError.education && (
                      <p className="text-sm text-red-500">
                        {applicationFormError.education.message}
                      </p>
                    )}
                  </InputField>
                  <InputField>
                    <Input
                      // accept="image/png, image/jpeg, image/svg+xml, image/jpg"
                      onChange={handleFileChange}
                      type={"file"}
                    />
                    {applicationFormError.resume && (
                      <p className="text-sm text-red-500">
                        {applicationFormError.resume.message}
                      </p>
                    )}
                  </InputField>
                </div>
                <DrawerFooter className={""}>
                  <Button onClick={handleSubmit(handleApplicationForm)}>
                    Submit
                  </Button>
                  <DrawerClose className={"rounded-md border-2 py-1"}>
                    Cancel
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </div>
  );
};
