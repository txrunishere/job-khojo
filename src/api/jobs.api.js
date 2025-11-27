import config from "@/config";
import supabaseClient from "@/utils/supabase";
import axios from "axios";

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

const getAllJobs = async (
  token,
  { location = "", company = "", title = "" } = {},
) => {
  const supabase = await supabaseClient(token);

  let query = supabase.from("Job").select("*, company: Company(name,logo_url)");

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (company) {
    query = query.eq("company_id", company);
  }

  if (title) {
    query = query.ilike("title", `%${title}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.log("Supabase Error :: While Fetching Jobs :: Error", error);
    throw new Error(error.message);
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

const getJobById = async (token, { job_id }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase
    .from("Job")
    .select(
      "*, company: Company(logo_url, website_url, name), applications: Application(*)",
    )
    .eq("id", job_id)
    .maybeSingle();

  if (error) {
    console.log(
      "Supabase Error :: While Fetching Job with job_id :: Error",
      error,
    );

    throw new Error(error.message);
  }

  return data;
};

const fetchJobsByRecruiter = async (token, { user_id }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase
    .from("Job")
    .select("*, company: Company(name, logo_url)")
    .eq("recruiter_id", user_id);

  if (error) {
    console.log(
      "Supabase Error :: While fetching recruiter's jobs :: Error",
      error,
    );
    throw new Error(error.message);
  }

  return data;
};

const deleteJob = async (token, { job_id }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase.from("Job").delete().eq("id", job_id);

  if (error) {
    console.log("Supabase Error :: While deleting jobs :: Error", error);
    throw new Error(error.message);
  }

  return data;
};

const changeJobStatus = async (token, { jobId, userId, isOpen }) => {
  const supabase = await supabaseClient(token);

  if (isOpen) {
    const { data, error } = await supabase
      .from("Job")
      .update({ isOpen })
      .eq("id", jobId)
      .eq("recruiter_id", userId);

    if (error) {
      console.log(
        "Supabase Error :: While updating job status jobs :: Error",
        error,
      );
      throw new Error(error.message);
    }

    return data;
  } else {
    const { data, error } = await supabase
      .from("Job")
      .update({ isOpen })
      .eq("id", jobId)
      .eq("recruiter_id", userId);

    if (error) {
      console.log(
        "Supabase Error :: While updating job status jobs :: Error",
        error,
      );
      throw new Error(error.message);
    }

    return data;
  }
};

const fetchJobsByRecruiterForDashboard = async (token, { userId }) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase
    .from("Job")
    .select("id, applications: Application(application_status, created_at)")
    .eq("recruiter_id", userId);

  if (error) {
    console.log(
      "Supabase Error :: While fetching recruiter's jobs :: Error",
      error,
    );
    throw new Error(error.message);
  }

  return data;
};

export {
  getAllJobs,
  insertJobSupabase,
  fetchStates,
  getJobById,
  fetchJobsByRecruiter,
  deleteJob,
  changeJobStatus,
  fetchJobsByRecruiterForDashboard,
};
