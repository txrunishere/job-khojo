import supabaseClient from "@/utils/supabase";

const createCompany = async (token, companyData) => {
  const supabase = await supabaseClient(token);

  const { error, data } = await supabase
    .from("Company")
    .insert([companyData])
    .select("*");

  if (error) {
    console.log("Supabase Error :: While inserting in Company :: Error", error);
    return null;
  }

  return data;
};

export { createCompany };
