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

export { getAllJobs };
