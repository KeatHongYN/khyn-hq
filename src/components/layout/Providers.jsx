import React from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/shared/Toast/toaster";
import { TooltipProvider } from "@/components/shared/Tooltip";

const Providers = ({ children, supabaseClient, pageProps }) => (
  <ErrorBoundary>
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <TooltipProvider delayDuration={200}>
        <Toaster />
        {children}
      </TooltipProvider>
    </SessionContextProvider>
  </ErrorBoundary>
);

export default Providers;
