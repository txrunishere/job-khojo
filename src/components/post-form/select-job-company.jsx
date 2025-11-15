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
import { CompanyForm } from "..";

export const SelectJobCompany = ({ statesData = [], companyList = [] }) => {
  const {
    setValue,
    formState: { errors: jobErrors },
  } = useFormContext();

  const handleCompanyValueChange = (value) =>
    setValue("company", value, { shouldValidate: true });

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select defaultValue="" onValueChange={handleCompanyValueChange}>
          <SelectTrigger className={"w-full"}>
            <SelectValue placeholder="Select a Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                {companyList?.length > 0
                  ? "Companies"
                  : "Companies Not Found!!"}
              </SelectLabel>
              {companyList?.map((company) => (
                <SelectItem key={company.id} value={JSON.stringify(company)}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <CompanyForm states={statesData} />
      </div>
      {jobErrors.company && (
        <p className="text-sm text-red-500">{jobErrors.company.message}</p>
      )}
    </div>
  );
};
