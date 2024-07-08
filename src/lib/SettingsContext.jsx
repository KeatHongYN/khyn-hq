/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState } from "react";

// Create context
const SettingsContext = createContext();

// Auth provider component
export const SettingsProvider = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);

  return (
    <SettingsContext.Provider value={{ showHeader, setShowHeader }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
