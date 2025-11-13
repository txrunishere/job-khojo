import { Header } from "@/components";
import { Outlet } from "react-router";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto sm:py-10 py-6">
        <Outlet />
      </main>
    </>
  );
};
