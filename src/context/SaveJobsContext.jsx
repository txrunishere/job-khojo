import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "@/hooks";
import {
  deleteSavedJob,
  getSavedJob,
  insertSavedJob,
} from "@/api/saved-jobs.api";

const SaveJobsContext = createContext();

export const SaveJobsProvider = ({ children }) => {
  const { user } = useUser();
  const user_id = user?.id;
  const { fn: fnGetSavedJobs } = useSupabase(getSavedJob);
  const { fn: fnInsertSavedJob } = useSupabase(insertSavedJob);
  const { fn: fnDeleteSavedJob } = useSupabase(deleteSavedJob);

  const [savedJobIds, setSavedJobIds] = useState([]); // stores job_ids
  const [savedJobs, setSavedJobs] = useState([]); // all saved jobs of users to display on saved jobs page

  const loadSavedJobs = async () => {
    const data = await fnGetSavedJobs({ user_id });
    setSavedJobIds(data.map((item) => item.job_id));
    setSavedJobs(data);
  };

  // Load saved jobs only once when user loads
  useEffect(() => {
    if (!user_id) return;
    loadSavedJobs();
  }, [user_id]);

  // Toggle save/unsave
  const toggleSave = async (jobId) => {
    const isSaved = savedJobIds.includes(jobId);

    if (isSaved) {
      // UNSAVE
      await fnDeleteSavedJob({ user_id, job_id: jobId });
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } else {
      // SAVE
      await fnInsertSavedJob({ user_id, job_id: jobId });
      setSavedJobIds((prev) => [...prev, jobId]);
    }
  };

  return (
    <SaveJobsContext.Provider value={{ savedJobIds, savedJobs, toggleSave }}>
      {children}
    </SaveJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SaveJobsContext);
