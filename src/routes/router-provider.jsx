import { MainLayout } from "@/layouts/main-layout";
import {
  Landing,
  JobListings,
  Jobs,
  MyJobs,
  PostJob,
  SavedJobs,
  CandidateDashboard,
  RecruiterDashboard,
} from "@/pages";
import { Route, Routes } from "react-router";
import { ProtectedRoutes } from "./protected-routes";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<Jobs />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};
