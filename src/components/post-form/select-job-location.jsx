import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const SelectJobLocation = ({ statesData = [] }) => {
  const {
    setValue,
    formState: { errors: jobErrors },
  } = useFormContext();

  const handleLocationValueChange = (value) =>
    setValue("location", value, { shouldValidate: true });

  return (
    <div className="space-y-2">
      <Select defaultValue="" onValueChange={handleLocationValueChange}>
        <SelectTrigger className={"w-full"}>
          <SelectValue placeholder="Select a Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Locations</SelectLabel>
            {statesData?.map((state) => (
              <SelectItem key={state.id} value={state.name}>
                {state.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {jobErrors.location && (
        <p className="text-sm text-red-500">{jobErrors.location.message}</p>
      )}
    </div>
  );
};
