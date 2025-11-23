import supabaseClient from "@/utils/supabase";

const getSavedJob = async (token, { user_id }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase
    .from("Saved_Jobs")
    .select("job_id")
    .eq("user_id", user_id);

  if (error) {
    console.log("Supabase Error :: While fetching saved jobs :: Error", error);
    throw new Error(error.message);
  }

  return data;
};

const insertSavedJob = async (token, { user_id, job_id }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase.from("Saved_Jobs").insert({
    user_id,
    job_id,
  });

  if (error) {
    console.log(
      "Supabase Error :: While inserting in Saved Jobs :: Error",
      error,
    );
    throw new Error(error.message);
  }

  return data;
};

const deleteSavedJob = async (token, { user_id, job_id }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase
    .from("Saved_Jobs")
    .delete()
    .eq("user_id", user_id)
    .eq("job_id", job_id);

  if (error) {
    console.log(
      "Supabase Error :: While deleting from Saved Jobs :: Error",
      error,
    );
    throw new Error(error.message);
  }

  return data;
};

export { getSavedJob, insertSavedJob, deleteSavedJob };
