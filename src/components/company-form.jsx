import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { InputField } from "./input-field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyInputSchema } from "@/schemas/company.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import { handleAddCompanySupabase } from "@/shared/api/api";
import { useState } from "react";
import { toast } from "sonner";

export const CompantForm = ({ states = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSession();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(companyInputSchema),
    defaultValues: {
      location: "",
      logo: null,
      name: "",
      website_url: "",
    },
    mode: "onSubmit",
  });

  const handleAddCompany = useMutation({
    mutationFn: async (data) => {
      const fileName = Date.now() + "-" + data.logo.name;

      if (!data.logo) {
        throw new Error("Please upload a company logo!!");
      }

      return await handleAddCompanySupabase(session, {
        name: data.name,
        location: data.location,
        website_url: data.website_url,
        fileName,
        file: data.logo,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      toast.success("The company was successfully added!");
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleFileUploadInputChange = (e) => {
    if (e.target?.files[0]) {
      setValue("logo", e.target.files[0], {
        shouldValidate: true,
      });
    }
  };

  const handleStateInputChange = (value) =>
    setValue("location", value, { shouldValidate: true });

  const handleIsOpenDrawer = () => {
    setIsOpen(true);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" onClick={handleIsOpenDrawer}>
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className={"mx-auto max-w-4xl"}>
          {/* header */}
          <DrawerHeader className={"mb-4"}>
            <DrawerTitle>Add a New Company</DrawerTitle>
          </DrawerHeader>
          {/* main content */}
          <div className="space-y-4 px-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <InputField>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id={"name"}
                  placeholder="ex. Google, Meta, Netflix"
                  type={"text"}
                  {...register("name")}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">
                    {formErrors.name.message}
                  </p>
                )}
              </InputField>
              <InputField>
                <Label htmlFor={"logo"}>Company Logo</Label>
                <Input
                  id="logo"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleFileUploadInputChange}
                  type={"file"}
                />
                {formErrors.logo && (
                  <p className="text-sm text-red-500">
                    {formErrors.logo.message}
                  </p>
                )}
              </InputField>
              <InputField>
                <Label htmlFor={"website_url"}>Website URL</Label>
                <Input
                  {...register("website_url")}
                  id="website_url"
                  placeholder={"ex. https://google.com"}
                  type={"text"}
                />
                {formErrors.website_url && (
                  <p className="text-sm text-red-500">
                    {formErrors.website_url.message}
                  </p>
                )}
              </InputField>
            </div>
            <div className="">
              <InputField>
                <Select defaultValue="" onValueChange={handleStateInputChange}>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select a Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Locations</SelectLabel>
                      {states?.map((state) => (
                        <SelectItem key={state.id} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formErrors.location && (
                  <p className="text-sm text-red-500">
                    {formErrors.location.message}
                  </p>
                )}
              </InputField>
            </div>
            <div>
              <Button
                disabled={handleAddCompany.isLoading}
                className={"w-full"}
                onClick={handleSubmit((formData) =>
                  handleAddCompany.mutate(formData),
                )}
              >
                Submit
              </Button>
            </div>
          </div>
          {/* footer */}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
