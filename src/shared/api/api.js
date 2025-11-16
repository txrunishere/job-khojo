import { createCompany, getAllCompanies } from "@/api/company.api";
import { insertJobSupabase } from "@/api/jobs.api";
import axios from "axios";
import config from "@/config";

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

const getCompanies = async (session) => {
  const supabaseAccessToken = await session.getToken({
    template: "supabase",
  });

  const res = await getAllCompanies(supabaseAccessToken);
  return res;
};

const handleAddCompanySupabase = async (session, companyData) => {
  const supabaseAccessToken = await session.getToken({
    template: "supabase",
  });

  const res = await createCompany(supabaseAccessToken, companyData);
  return res;
};

const insertJob = async (session, jobData) => {
  const supabaseAccessToken = await session.getToken({
    template: "supabase",
  });

  const res = await insertJobSupabase(supabaseAccessToken, jobData);

  return res;
};

export { getCompanies, fetchStates, handleAddCompanySupabase, insertJob };
