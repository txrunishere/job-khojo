import { Heading } from "@/components";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

export const Dashboard = () => {
  const { isLoaded: isSessionLoaded, user } = useUser();

  if (!isSessionLoaded) {
    return (
      <div className="px-4">
        <BarLoader width={"100%"} color={"white"} />
      </div>
    );
  }

  return (
    <div className="">
      <section className="px-2">
        <Heading className="sm:max-w-2xl">
          Welcome Back, {user?.firstName}
        </Heading>
      </section>
      <div>
        {/* STATS CARDS */}
        <div></div>
      </div>
    </div>
  );
};
