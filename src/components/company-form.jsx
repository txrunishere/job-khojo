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
import { useSupabase } from "@/hooks";
import { createCompany } from "@/api/company.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyInputSchema } from "@/schemas/company.schema";

export const CompantForm = ({ states = [] }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(companyInputSchema),
    defaultValues: {
      location: "",
      logo: "",
      name: "",
      website_url: "",
    },
    mode: "onSubmit",
  });
  const { fn: createCompanySupabaseFn, loading: createCompanyLoading } =
    useSupabase(createCompany);

  const handleAddCompany = async (data) => {
    try {
      const fileName = Date.now() + data.logo.name;
      const res = await createCompanySupabaseFn({
        name: data.name,
        location: data.location,
        website_url: data.website_url,
        fileName,
        file: data.logo,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUploadInputChange = (e) => {
    if (e.target?.files[0]) {
      setValue("logo", e.target.files[0], {
        shouldValidate: true,
      });
    }
  };

  const handleStateInputChange = (value) => {
    setValue("location", value, { shouldValidate: true });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Company</Button>
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
                <Select onValueChange={handleStateInputChange}>
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
                disabled={createCompanyLoading}
                className={"w-full"}
                onClick={handleSubmit(handleAddCompany)}
                type={"submit"}
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
