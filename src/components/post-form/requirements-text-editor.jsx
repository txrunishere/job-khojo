import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useFormContext, Controller } from "react-hook-form";

export const RequirementsTextEditor = () => {
  const {
    control,
    formState: { errors: jobErrors },
  } = useFormContext();

  return (
    <div className="container space-y-2">
      <Controller
        control={control}
        name="requirements"
        render={({ field: { onChange, value } }) => (
          <>
            <MDEditor onChange={onChange} value={value} />
          </>
        )}
      />
      {jobErrors.requirements && (
        <p className="text-sm text-red-500">{jobErrors.requirements.message}</p>
      )}
    </div>
  );
};

/*
  <MDEditor.Markdown
    source={value}
    style={{ whiteSpace: "pre-wrap" }}
  />
*/
