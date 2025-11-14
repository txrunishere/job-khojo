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

export const CompantForm = ({ states = [] }) => {
  const { fn, loading: createCompanyLoading } = useSupabase(createCompany);

  const handleAddCompany = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log("Company Added");
    } catch (error) {
      console.log(error);
    }
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
          <div className="px-4">
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <InputField>
                  <Label>Company Name</Label>
                  <Input type={"text"} />
                </InputField>
                <InputField>
                  <Label>Company Logo</Label>
                  <Input type={"file"} />
                </InputField>
                <InputField>
                  <Label>Website URL</Label>
                  <Input type={"text"} />
                </InputField>
              </div>
              <div className="">
                <InputField>
                  <Select>
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
                </InputField>
              </div>
              <div>
                <Button
                  disabled={createCompanyLoading}
                  onClick={handleAddCompany}
                  className={"w-full"}
                  type={"submit"}
                >
                  Submit
                </Button>
              </div>
            </form>
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
