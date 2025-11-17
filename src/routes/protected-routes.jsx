import { TokenContextProvider } from "@/context/sessionContext";
import { useSession, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoutes = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const { isLoaded: sessionLoaded, session } = useSession();
  const [token, setToken] = useState("");

  if (userLoaded && !isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  useEffect(() => {
    async function getSupabaseAccessToken() {
      if (sessionLoaded && session) {
        const supabaseAccessToken = await session.getToken({
          template: "supabase",
        });
        setToken(supabaseAccessToken || "");
      }
    }
    getSupabaseAccessToken();
  }, [sessionLoaded, session]);

  // if (!userLoaded || !sessionLoaded) return null;

  return (
    <TokenContextProvider value={{ token, tokenLoading: sessionLoaded }}>
      <Outlet />
    </TokenContextProvider>
  );
};
