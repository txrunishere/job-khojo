import { fetchMyApplications } from "@/api/application.api";
import { getAllCompanies } from "@/api/company.api";
import { fetchStates } from "@/api/jobs.api";
import { useSupabase } from "@/hooks";
import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const { isLoaded: isSessionLoaded, user } = useUser();
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);

  const { fn: fnFetchMyApplications } = useSupabase(fetchMyApplications);
  const { fn: fnGetAllCompanies } = useSupabase(getAllCompanies);

  const fetchData = async () => {
    setLoading(true);
    const uid = user?.id;

    const [apps, companies, states] = await Promise.all([
      fnFetchMyApplications({ user_id: uid }),

      fnGetAllCompanies(),

      fetchStates(),
    ]);

    setApplications(apps || []);
    setCompanies(companies || []);
    setStates(states || []);

    setLoading(false);
  };

  useEffect(() => {
    if (isSessionLoaded) {
      fetchData();
    }
  }, [isSessionLoaded]);

  return (
    <DataContext.Provider value={{ loading, applications, companies, states }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
