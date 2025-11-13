import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoutes = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to="/?sign-in=true" />;
  }

  return <Outlet />;
};
