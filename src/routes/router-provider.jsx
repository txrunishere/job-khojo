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
import { Outlet, Route, Routes } from "react-router";
import { ProtectedRoutes } from "./protected-routes";
import { DataContextProvider, SaveJobsProvider } from "@/context";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/jobs/:id" element={<Jobs />} />
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />

          {/* ROUTES USE CONTEXT */}
          <Route
            element={
              <SaveJobsProvider>
                <Outlet />
              </SaveJobsProvider>
            }
          >
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/my-jobs" element={<MyJobs />} />

            <Route
              element={
                <DataContextProvider>
                  <Outlet />
                </DataContextProvider>
              }
            >
              <Route path="/jobs" element={<JobListings />} />
              <Route
                path="/dashboard/candidate"
                element={<CandidateDashboard />}
              />
            </Route>
          </Route>

          <Route
            path="/post-job"
            element={
              <DataContextProvider>
                <PostJob />
              </DataContextProvider>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};
