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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { BarLoader } from "react-spinners";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationInputSchema } from "@/schemas";
import { insertApplication } from "@/api/application.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const Jobs = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const { id } = useParams();
  const { isLoaded: sessionLoaded, user } = useUser();
  const {
    data: jobData,
    fn: fnGetJobById,
    isLoading: jobLoading,
  } = useSupabase(getJobById);

  const { fn: fnInsertApplication, isLoading: insertApplicationLoading } =
    useSupabase(insertApplication);

  const {
    register,
    formState: { errors: applicationFormError },
    handleSubmit,
    setValue,
    reset,
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

  const handleFileChange = (e) => {
    if (e.target?.files[0]) {
      setValue("resume", e.target.files[0], { shouldValidate: true });
    }
  };

  const handleEducationStatusChange = (value) =>
    setValue("education", value, {
      shouldValidate: true,
    });

  const handleApplicationForm = useMutation({
    mutationFn: async (formData) => {
      const filePath = `${Date.now()} - ${formData.resume.name}`;
      const insertApplicationFormData = {
        file: {
          file: formData.resume,
          filePath,
        },
        user_id: user.id,
        job_id: jobData[0].id,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.education,
      };

      const res = await fnInsertApplication(insertApplicationFormData);
      return res;
    },
    onSuccess: () => {
      toast.success(`Applied for ${jobData[0].title} successfully!!`);
      reset();
      setIsDrawerOpen(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (sessionLoaded) {
      fnGetJobById({ job_id: id });
    }
  }, [sessionLoaded]);

  useEffect(() => {
    const applications = jobData?.applications.map(
      (application) => application.user_id,
    );
    if (applications?.includes(user.id)) {
      setIsUserEnrolled(true);
    }
  }, [jobData, sessionLoaded]);

  if (!sessionLoaded || jobLoading) {
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );
  }

  // TODO: fix it with maybeSingle() method in api file

  return (
    <div>
      {!jobLoading && (
        <div className="space-y-8 px-4 py-6">
          {/* TITLE + COMPANY LOGO */}
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <section>
              <h1 className="max-w-md bg-linear-to-r from-neutral-400 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent sm:max-w-xl sm:text-5xl">
                {jobData?.title}
              </h1>
            </section>
            <div>
              <img className="h-10" src={jobData?.company.logo_url} alt="" />
            </div>
          </div>

          {/* JOB INFO */}
          <div className="space-y-6 py-6 text-sm font-bold sm:text-lg">
            <div>
              <p className="flex items-center gap-1">
                <MapPin size={18} /> <span>{jobData?.location}</span>
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5">
                <StickyNote size={20} />
                {jobData?.applications.length} applications
              </p>
            </div>
            <div className="">
              {jobData?.isOpen ? (
                <p className="flex items-center gap-1">
                  <DoorOpen size={20} /> <span>OPEN</span>
                </p>
              ) : (
                <p className="flex items-center gap-1">
                  <DoorClosed size={20} /> <span>CLOSED</span>
                </p>
              )}
            </div>
            <div>
              <p className="flex items-center gap-1">
                <Banknote size={20} /> ₹{jobData?.["salary-start"]} -{" "}
                {jobData?.["salary-end"]}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1">
                <BriefcaseBusiness size={20} />
                {jobData?.experience} (months) required
              </p>
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div>
            <MDEditor.Markdown
              source={jobData?.requirements}
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
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
                    Apply for {jobData?.title} at {jobData?.company.name}
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
                  <Button
                    onClick={handleSubmit((formData) =>
                      handleApplicationForm.mutate(formData),
                    )}
                    disabled={insertApplicationLoading || isUserEnrolled}
                  >
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
