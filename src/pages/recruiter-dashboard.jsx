import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const RecruiterDashboard = () => {
  const { isLoaded: isSessionLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSessionLoaded) return;
    if (user.unsafeMetadata.role !== "recruiter")
      navigate("/dashboard/candidate");
  }, [isSessionLoaded]);

  return <div>Recruiter Dashboard</div>;
};
