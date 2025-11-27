import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "@/hooks";
import {
  fetchJobsByRecruiter,
  fetchJobsByRecruiterForDashboard,
} from "@/api/jobs.api";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

const applicationsData = [
  { month: "Jan", count: 40 },
  { month: "Feb", count: 55 },
  { month: "Mar", count: 70 },
  { month: "Apr", count: 65 },
  { month: "May", count: 90 },
];

const jobPerformance = [
  { job: "Frontend Dev", apps: 120 },
  { job: "Backend Dev", apps: 90 },
  { job: "DevOps Eng", apps: 70 },
  { job: "UI/UX Designer", apps: 32 },
];

export function RecruiterDashboard() {
  const { isLoaded: isSessionLoaded, user } = useUser();

  const {
    fn: fnFetchJobsByRecruiter,
    isLoading: fetchRecruiterJobsLoading,
    data: totalPostedJobsByRecruiter,
  } = useSupabase(fetchJobsByRecruiterForDashboard);

  useEffect(() => {
    if (isSessionLoaded) fnFetchJobsByRecruiter({ userId: user.id });
  }, [isSessionLoaded]);

  const stats = [
    { label: "Total Jobs Posted", value: totalPostedJobsByRecruiter?.length },
    {
      label: "Applications Received",
      value: totalPostedJobsByRecruiter?.reduce(
        (acc, curr) => acc + curr.applications.length,
        0,
      ),
    },
    {
      label: "Hires Completed",
      value: totalPostedJobsByRecruiter?.reduce(
        (acc, curr) =>
          acc +
          curr.applications.filter(
            (status) => status.application_status === "hired",
          ).length,
        0,
      ),
    },
  ];

  if (!isSessionLoaded || fetchRecruiterJobsLoading) {
    return (
      <div className="px-4">
        <BarLoader color="white" width={"100%"} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Title */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Recruiter Dashboard
        </h1>
        <Button className="flex w-full items-center justify-center gap-2 md:w-auto">
          Post New Job <ArrowUpRight size={18} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-xl shadow-sm">
            <CardHeader className="">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="">
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Line Chart */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-52 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Job Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-52 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobPerformance}>
                <XAxis dataKey="job" fontSize={10} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="apps" fill="currentColor" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications Table */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="p-3">Candidate</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Applied On</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b text-sm hover:bg-neutral-800">
                <td className="p-3">John Doe</td>
                <td className="p-3">Frontend Developer</td>
                <td className="p-3">Reviewing</td>
                <td className="p-3">20 Nov 2025</td>
              </tr>
              <tr className="border-b text-sm hover:bg-neutral-800">
                <td className="p-3">Priya Sharma</td>
                <td className="p-3">UI Designer</td>
                <td className="p-3">Shortlisted</td>
                <td className="p-3">18 Nov 2025</td>
              </tr>
              <tr className="text-sm hover:bg-neutral-800">
                <td className="p-3">Arjun Patel</td>
                <td className="p-3">Backend Developer</td>
                <td className="p-3">Interview Scheduled</td>
                <td className="p-3">17 Nov 2025</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
