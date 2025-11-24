import { Heading } from "@/components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useData } from "@/context/DataContext";
import { useSavedJobs } from "@/context/SaveJobsContext";
import { useUser } from "@clerk/clerk-react";
import { Bookmark, Briefcase, Calendar } from "lucide-react";
import { BarLoader } from "react-spinners";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export const Dashboard = () => {
  const { isLoaded: isSessionLoaded, user } = useUser();
  const { applications, dataLoading } = useData();
  const { savedJobIds, loading: savedJobsLoading } = useSavedJobs();

  if (!isSessionLoaded || dataLoading || savedJobsLoading) {
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );
  }

  const interviewCount = applications.filter(
    (application) => application.application_status === "interviewing",
  );

  const statsData = [
    {
      icon: Calendar,
      title: "Interviews Scheduled",
      totalNo: interviewCount?.length || 0,
    },
    {
      icon: Briefcase,
      title: "Applications Submitted",
      totalNo: applications?.length || 0,
    },
    {
      icon: Bookmark,
      title: "Saved Jobs",
      totalNo: savedJobIds.length || 0,
    },
  ];

  const chartData = [
    {
      status: "Applied",
      value:
        applications.filter(
          (application) => application.application_status === "applied",
        ).length || 0,
    },
    {
      status: "Interviewing",
      value:
        applications.filter(
          (application) => application.application_status === "interviewing",
        ).length || 0,
    },
    {
      status: "Hired",
      value:
        applications.filter(
          (application) => application.application_status === "hired",
        ).length || 0,
    },
    {
      status: "Rejected",
      value:
        applications.filter(
          (application) => application.application_status === "rejected",
        ).length || 0,
    },
  ];

  const chartConfig = {
    value: {
      color: "var(--chart-2)",
    },
  };

  return (
    <div className="space-y-10">
      <section className="px-2">
        <Heading className="sm:max-w-2xl">
          Welcome Back, {user?.firstName}
        </Heading>
      </section>
      <div className="space-y-8 px-6">
        {/* STATS CARDS */}
        <div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
            {statsData.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className={"flex-row items-center gap-6"}
                >
                  <CardHeader>
                    <div className="rounded-full bg-neutral-700 p-4">
                      <Icon />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.title}</p>
                    <h1 className="text-2xl font-bold md:text-4xl">
                      {item.totalNo}
                    </h1>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* APPLICATION STATUS GRAPH */}
        <div>
          <Card>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="h-[220px] w-full sm:h-[500px]"
              >
                <AreaChart
                  data={chartData}
                  margin={{ left: 12, right: 12, bottom: 20 }}
                >
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#cbd5e1" }}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />

                  <defs>
                    <linearGradient
                      id="fillLightBlue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#7dd3fc"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>

                  <Area
                    dataKey="value"
                    type="natural"
                    fill="url(#fillLightBlue)"
                    fillOpacity={0.4}
                    stroke="#7dd3fc"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
