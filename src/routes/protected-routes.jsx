import { SaveJobsProvider } from "@/context/SaveJobsContext";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoutes = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (userLoaded && !isSignedIn) return <Navigate to={"/?sign-in=true"} />;

  return (
    <SaveJobsProvider>
      <Outlet />
    </SaveJobsProvider>
  );
};
