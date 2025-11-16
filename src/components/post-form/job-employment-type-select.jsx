import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const JobEmploymentTypeSelect = () => {
  const employment_type_values = [
    "Full Time",
    "Part Time",
    "Contract",
    "Internship",
    "Remote",
  ];

  const {
    setValue,
    formState: { errors: jobErrors },
  } = useFormContext();

  const handleJobEmploymentTypeValueChange = (value) =>
    setValue("employment_type", value, { shouldValidate: true });

  return (
    <div className="space-y-2">
      <Select onValueChange={handleJobEmploymentTypeValueChange}>
        <SelectTrigger className={"w-full"}>
          <SelectValue placeholder="Select Employment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {employment_type_values.map((item) => (
              <SelectItem value={item} key={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {jobErrors.employment_type && (
        <p className="text-sm text-red-500">
          {jobErrors.employment_type.message}
        </p>
      )}
    </div>
  );
};
