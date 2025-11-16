import { useFormContext } from "react-hook-form";
import { InputField } from "..";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const IsOpenJobSelect = () => {
  const {
    setValue,
    formState: { errors: jobErrors },
  } = useFormContext();

  const handleJobStatusValueChange = (value) =>
    setValue("isOpen", value === "open" ? true : false, {
      shouldValidate: true,
    });

  return (
    <InputField>
      <Select defaultValue="open" onValueChange={handleJobStatusValueChange}>
        <SelectTrigger className={"w-full"}>
          <SelectValue placeholder="Select Job Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={"open"}>OPEN</SelectItem>
            <SelectItem value={"close"}>CLOSE</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {jobErrors.isOpen && (
        <p className="text-sm text-red-500">{jobErrors.isOpen.message}</p>
      )}
    </InputField>
  );
};
