import { changeJobStatus, getJobById } from "@/api/jobs.api";
import { ApplicationCard, InputField } from "@/components";
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
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router";
import { BarLoader } from "react-spinners";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationInputSchema } from "@/schemas";
import {
  insertApplication,
  updateApplicationStatus,
} from "@/api/application.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applicationStatusList,
  educationStatusArray,
} from "@/common/constants";

export const Jobs = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApplicationListOpen, setIsApplicationListOpen] = useState(false);
  const { id } = useParams();
  const { isLoaded: sessionLoaded, user } = useUser();

  const {
    data: jobData,
    fn: fnGetJobById,
    isLoading: jobLoading,
  } = useSupabase(getJobById);

  const { fn: fnChangeJobStatus } = useSupabase(changeJobStatus);

  const { fn: fnInsertApplication, isLoading: insertApplicationLoading } =
    useSupabase(insertApplication);

  const {
    register,
    formState: { errors: applicationFormError },
    handleSubmit,
    setValue,
    reset,
    control,
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

  const role = user?.unsafeMetadata?.role;
  const isRecruiter = role === "recruiter";
  const isUserEnrolled = jobData?.applications?.some(
    (a) => a.user_id === user.id,
  );

  const handleChangeJobStatus = async (value) => {
    let status = value === "OPEN" ? true : false;

    if (jobData.isOpen === status) return;

    await fnChangeJobStatus({
      userId: user.id,
      jobId: jobData.id,
      isOpen: status,
    });
  };

  const handleFileChange = (e) => {
    if (e.target?.files[0]) {
      setValue("resume", e.target.files[0], { shouldValidate: true });
    }
  };

  const handleApplicationForm = useMutation({
    mutationFn: async (formData) => {
      const filePath = `${Date.now()} - ${formData.resume.name}`;

      const insertApplicationFormData = {
        file: {
          file: formData.resume,
          filePath,
        },
        user_id: user.id,
        job_id: jobData.id,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.education,
        name: user.fullName,
      };

      const res = await fnInsertApplication(insertApplicationFormData);
      return res;
    },
    onSuccess: () => {
      toast.success(`You have successfully applied for ${jobData.title}`);
      reset();
      setIsDrawerOpen(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const handleOpenApplicationList = () => setIsApplicationListOpen(true);

  useEffect(() => {
    if (sessionLoaded && id) fnGetJobById({ job_id: id });
  }, [sessionLoaded, id]);

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
          <JobHeader jobData={jobData} />

          <JobInfoSection
            jobData={jobData}
            isRecruiter={isRecruiter}
            handleChangeJobStatus={handleChangeJobStatus}
          />

          <JobRequirementsSection requirements={jobData?.requirements} />

          {!isRecruiter && (
            <ApplyDrawerForm
              {...{
                isDrawerOpen,
                setIsDrawerOpen,
                jobData,
                register,
                control,
                applicationFormError,
                handleFileChange,
                handleSubmit,
                handleApplicationForm,
                insertApplicationLoading,
                isUserEnrolled,
              }}
            />
          )}

          {isRecruiter && (
            <>
              {!isApplicationListOpen ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleOpenApplicationList}
                >
                  See Application
                </Button>
              ) : (
                <ApplicationsList
                  isRecruiter={isRecruiter}
                  jobData={jobData}
                  applicationStatusList={applicationStatusList}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* JOB HEADER */
const JobHeader = ({ jobData }) => (
  <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
    <section>
      <h1 className="bg-linear-to-r from-neutral-200 to-neutral-400 bg-clip-text text-center text-3xl font-bold text-transparent sm:text-start">
        {jobData?.title}
      </h1>
    </section>

    <div>
      <img className="h-10" src={jobData?.company.logo_url} alt="" />
    </div>
  </div>
);

/* JOB INFO SECTION */
const JobInfoSection = ({ jobData, isRecruiter, handleChangeJobStatus }) => (
  <div className="space-y-6 py-6 text-sm font-bold sm:text-lg">
    <p className="flex items-center gap-1">
      <MapPin size={18} /> <span>{jobData?.location}</span>
    </p>

    <p className="flex items-center gap-1.5">
      <StickyNote size={20} />
      {jobData?.applications.length} applications
    </p>

    <div>
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

    {isRecruiter && (
      <Select onValueChange={handleChangeJobStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Job Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"OPEN"}>OPEN</SelectItem>
          <SelectItem value={"CLOSE"}>CLOSE</SelectItem>
        </SelectContent>
      </Select>
    )}

    <p className="flex items-center gap-1">
      <Banknote size={20} /> ₹{jobData?.["salary-start"]} -{" "}
      {jobData?.["salary-end"]}
    </p>

    <p className="flex items-center gap-1">
      <BriefcaseBusiness size={20} />
      {jobData?.experience} (months) required
    </p>
  </div>
);

/* REQUIREMENTS SECTION */
const JobRequirementsSection = ({ requirements }) => (
  <MDEditor.Markdown
    source={requirements}
    style={{
      whiteSpace: "pre-wrap",
      display: "flex",
      flexDirection: "column",
      padding: "40px",
      borderRadius: "10px",
    }}
  />
);

/* APPLY DRAWER FORM */
const ApplyDrawerForm = ({
  isDrawerOpen,
  setIsDrawerOpen,
  jobData,
  register,
  control,
  applicationFormError,
  handleFileChange,
  handleSubmit,
  handleApplicationForm,
  insertApplicationLoading,
  isUserEnrolled,
}) => (
  <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
    <DrawerTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md py-1 font-bold">
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
            placeholder="Experience (in months)"
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
            placeholder="Skills (comma separated)"
          />
          {applicationFormError.skills && (
            <p className="text-sm text-red-500">
              {applicationFormError.skills.message}
            </p>
          )}
        </InputField>

        {/* RHF CONTROLLER */}
        <InputField>
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                {educationStatusArray.map((i, idx) => {
                  const value = i.trim().toLowerCase().replace(/\s/g, "_");
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <RadioGroupItem id={`r-${idx}`} value={value} />
                      <Label htmlFor={`r-${idx}`}>{i}</Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}
          />

          {applicationFormError.education && (
            <p className="text-sm text-red-500">
              {applicationFormError.education.message}
            </p>
          )}
        </InputField>

        <InputField>
          <Input type="file" onChange={handleFileChange} />
          {applicationFormError.resume && (
            <p className="text-sm text-red-500">
              {applicationFormError.resume.message}
            </p>
          )}
        </InputField>
      </div>

      <DrawerFooter>
        <Button
          disabled={insertApplicationLoading || isUserEnrolled}
          onClick={handleSubmit((formData) =>
            handleApplicationForm.mutate(formData),
          )}
        >
          Submit
        </Button>

        <DrawerClose className="rounded-md border-2 py-1">Cancel</DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);

/* APPLICATION LIST */
const ApplicationsList = ({ jobData, applicationStatusList, isRecruiter }) => (
  <div className="space-y-3">
    {jobData.length > 0 ? (
      jobData.applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          applicationStatusList={applicationStatusList}
          isRecruiter={isRecruiter}
        />
      ))
    ) : (
      <p className="mt-4 text-center text-neutral-400">
        No one apply for this job yet!!
      </p>
    )}
  </div>
);
