import React from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/shared/Toast/toaster";
import { TooltipProvider } from "@/components/shared/Tooltip";
import { AuthProvider } from "@/lib/AuthContext";

const Providers = ({ children }) => (
  <ErrorBoundary>
    <AuthProvider>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        {children}
      </TooltipProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default Providers;
