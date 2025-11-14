import { Header } from "@/components";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

export const MainLayout = () => {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Header />
      <main className="container mx-auto py-6 sm:py-10">
        <Outlet />
      </main>
    </>
  );
};
