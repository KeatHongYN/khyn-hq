import React from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/shared/Toast/toaster";
import { TooltipProvider } from "@/components/shared/Tooltip";
import { AuthProvider } from "@/lib/AuthContext";
import { SettingsProvider } from "@/lib/SettingsContext";

const Providers = ({ children }) => (
  <ErrorBoundary>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider delayDuration={200}>
          <Toaster />
          {children}
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default Providers;
