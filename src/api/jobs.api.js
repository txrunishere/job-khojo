import supabaseClient from "@/utils/supabase";

const getAllJobs = async (token) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("Job").select("*");

  if (error) {
    console.log("Supabase Error :: While Fetching Jobs :: Error", error);
    return null;
  }

  return data;
};

/**
 * Job Data
 *
 * company: "",
 * description: "",
 * location: "",
 * title: "",
 * experience: 0,
 * salary_end: 0,
 * salary_start: 0,
 * employment_type: "",
 * isOpen: true,
 * skills: "",
 */
const insertJobSupabase = async (token, jobData) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase.from("Job").insert(jobData);

  if (error) {
    console.log("Supabase Error :: While Insert Job :: Error", error);
    throw new Error(error.message);
  }

  return data;
};

export { getAllJobs, insertJobSupabase };
