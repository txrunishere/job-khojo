import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

export const useSupabase = (cb) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLoaded, session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      if (isLoaded) {
        const supabaseAccessToken = await session.getToken({
          template: "supabase",
        });

        const res = await cb(supabaseAccessToken, ...args);
        setData(res);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fn };
};
