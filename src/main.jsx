import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components";
import { BrowserRouter } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <ThemeProvider storageKey="vite-ui-theme" defaultTheme="dark">
    <BrowserRouter>
      <ClerkProvider
        appearance={{
          theme: dark,
        }}
        publishableKey={PUBLISHABLE_KEY}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  </ThemeProvider>,
);
