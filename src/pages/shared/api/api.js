import { getAllCompanies } from "@/api/company.api";
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

export { getCompanies, fetchStates };
