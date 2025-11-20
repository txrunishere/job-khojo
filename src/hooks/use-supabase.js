import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

export const useSupabase = (cb) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, session } = useSession();

  const fn = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isLoaded || !session) {
        throw new Error("Session not ready");
      }

      // ✅ Correct: get Supabase token
      const supabaseAccessToken = await session?.getToken({
        template: "supabase",
      });

      if (!supabaseAccessToken) {
        throw new Error("Failed to fetch Supabase access token");
      }

      // Run your callback with token + rest of args
      const result = await cb(supabaseAccessToken, ...args);
      setData(result);
      return result;
    } catch (err) {
      console.error("useSupabase error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, fn };
};
