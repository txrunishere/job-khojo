import supabaseClient from "@/utils/supabase";
import { toast } from "sonner";

/**
 * companyData ->
 *   name of company
 *   location
 *   website_url
 *   logo_path
 *   logo
 */
const createCompany = async (token, companyData) => {
  const supabase = await supabaseClient(token);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("company-logo")
    .upload(companyData.fileName, companyData.file);

  if (uploadError) {
    console.log("Supabase Error :: Uploading company logo :: ", uploadError);
    toast.error(uploadError.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("company-logo")
    .getPublicUrl(uploadData.path);

  const companyInsertData = {
    name: companyData.name,
    location: companyData.location,
    website_url: companyData.website_url,
    logo_url: publicUrlData.publicUrl,
  };

  const { error: insertError, data } = await supabase
    .from("Company")
    .insert([companyInsertData])
    .select("*");

  if (insertError) {
    console.log("Supabase Error :: Inserting company :: ", insertError);
    toast.error(insertError.message);

    const { error: deleteError } = await supabase.storage
      .from("company-logo")
      .remove([uploadData.path]);

    if (deleteError) {
      console.log(
        "Supabase Error :: Deleting company logo after insert fail :: ",
        deleteError,
      );
      toast.error(deleteError.message);
    }

    return null;
  }

  toast.success("Company registered successfully!!");
  return data;
};

const getAllCompanies = async (token) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("Company").select("*");

  if (error) {
    console.log("Supbase Error :: While Fetching Companies :: Error", error);
    toast.error(error.message);
    return null;
  }

  return data;
};

export { createCompany, getAllCompanies };
