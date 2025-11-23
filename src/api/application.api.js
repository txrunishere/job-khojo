import supabaseClient from "@/utils/supabase";

// TODO: Remove image if error occour while inserting application
const insertApplication = async (token, applicationData) => {
  const supabase = await supabaseClient(token);

  const fileData = {
    file: applicationData.file.file,
    filePath: applicationData.file.filePath,
  };

  const res = await uplaodApplicationResume(supabase, fileData);

  if (res) {
    const { data } = await supabase.storage
      .from("resumes")
      .getPublicUrl(applicationData.file.filePath);

    const insertData = {
      user_id: applicationData.user_id,
      job_id: applicationData.job_id,
      skills: applicationData.skills,
      experience: applicationData.experience,
      education_status: applicationData.education,
      resume: data.publicUrl,
    };

    const { data: insertApplicationData, error: insertApplicationError } =
      await supabase.from("Application").insert(insertData).select("*");

    if (insertApplicationError) {
      console.log(
        "Supabase Error :: While inserting application :: Error",
        insertApplicationError,
      );
      throw new Error(insertApplicationError.message);
    }

    return insertApplicationData;
  } else {
    throw new Error(
      "Supabase Error :: Something went wrong while uploading image :: Error",
    );
  }
};

const uplaodApplicationResume = async (supabase, fileData) => {
  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(fileData.filePath, fileData.file);

  if (error) {
    console.log("Supabase Error :: While uploading resume :: Error", error);
    throw new Error(error.message);
  }

  return data;
};

const fetchMyApplications = async (token, { user_id }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase
    .from("Application")
    .select(
      "id, job: Job(id, company_id, description, title, location, company: Company(name, logo_url))",
    )
    .eq("user_id", user_id);

  if (error) {
    console.log(
      "Supabase Error :: While fetching user's applications :: Error",
      error,
    );
    throw new Error(error.message);
  }

  return data;
};

export { insertApplication, fetchMyApplications };
