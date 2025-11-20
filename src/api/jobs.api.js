import config from "@/config";
import supabaseClient from "@/utils/supabase";
import axios from "axios";

const getAllJobs = async (token) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("Job")
    .select("*, company:Company(logo_url, name)");

  if (error) {
    console.log("Supabase Error :: While Fetching Jobs :: Error", error);
    throw new Error(error.message);
  }

  console.log({ data });
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

  const { error, data } = await supabase
    .from("Job")
    .insert(jobData)
    .select("*");

  if (error) {
    console.log("Supabase Error :: While Insert Job :: Error", error);
    throw new Error(error.message);
  }

  return data;
};

const fetchStates = async () => {
  const res = await axios.get(
    "https://api.countrystatecity.in/v1/countries/IN/states",
    {
      headers: {
        "X-CSCAPI-KEY": config.STATES_API_KEY,
      },
    },
  );

  return res.data;
};

export { getAllJobs, insertJobSupabase, fetchStates };
