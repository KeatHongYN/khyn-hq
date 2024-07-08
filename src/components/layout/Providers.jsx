import React from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/shared/Toast/toaster";
import { TooltipProvider } from "@/components/shared/Tooltip";

const Providers = ({ children }) => (
  <ErrorBoundary>
    <TooltipProvider delayDuration={200}>
      <Toaster />
      {children}
    </TooltipProvider>
  </ErrorBoundary>
);

export default Providers;
