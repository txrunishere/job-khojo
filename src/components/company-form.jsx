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
import { companyInputSchema } from "@/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCompany } from "@/api/company.api";
import { useSupabase } from "@/hooks";
import { useState } from "react";

export const CompanyForm = ({ states = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { fn: fnCreateCompany } = useSupabase(createCompany);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyInputSchema),
    defaultValues: {
      name: "",
      website_url: "",
      location: "",
      logo: null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const addCompanyMutation = useMutation({
    mutationFn: async (formData) => {
      if (!formData.logo) {
        throw new Error("Please upload a company logo!");
      }
      const fileName = `${Date.now()}-${formData.logo.name}`;

      return await fnCreateCompany({
        name: formData.name,
        location: formData.location,
        website_url: formData.website_url,
        fileName,
        file: formData.logo,
      });
    },

    onSuccess: () => {
      toast.success("Company added successfully!");
      setIsOpen(false);
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleFileChange = (e) => {
    if (e.target?.files[0]) {
      setValue("logo", e.target.files[0], { shouldValidate: true });
    }
  };

  const handleSelectLocation = (value) => {
    setValue("location", value, { shouldValidate: true });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Company</Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto max-w-4xl">
          {/* HEADER */}
          <DrawerHeader className="mb-4">
            <DrawerTitle>Add a New Company</DrawerTitle>
          </DrawerHeader>

          {/* FORM */}
          <div className="space-y-6 px-4">
            {/* NAME - LOGO - WEBSITE */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* NAME */}
              <InputField>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  placeholder="ex. Google, Meta, Netflix"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </InputField>

              {/* LOGO */}
              <InputField>
                <Label htmlFor="logo">Company Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleFileChange}
                />
                {errors.logo && (
                  <p className="text-sm text-red-500">{errors.logo.message}</p>
                )}
              </InputField>

              {/* WEBSITE */}
              <InputField>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  placeholder="ex. https://google.com"
                  {...register("website_url")}
                />
                {errors.website_url && (
                  <p className="text-sm text-red-500">
                    {errors.website_url.message}
                  </p>
                )}
              </InputField>
            </div>

            {/* LOCATION */}
            <InputField>
              <Label>Location</Label>
              <Select onValueChange={handleSelectLocation}>
                <SelectTrigger className="w-full">
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

              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </InputField>

            {/* SUBMIT */}
            <Button
              onClick={handleSubmit((formData) =>
                addCompanyMutation.mutate(formData),
              )}
              className="w-full"
              disabled={addCompanyMutation.isPending}
            >
              {addCompanyMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>

          {/* FOOTER */}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
