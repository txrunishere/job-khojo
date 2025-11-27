import { DataContextProvider } from "@/context/DataContext";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoutes = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (userLoaded && !isSignedIn) return <Navigate to={"/?sign-in=true"} />;

  return <Outlet />;
};
