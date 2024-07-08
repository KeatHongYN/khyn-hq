/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/component";

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const supabaseClient = createClient();
  // Effect to handle authentication state changes
  useEffect(() => {
    // Initial fetch of user session
    (async () => {
      const fetchUser = await supabaseClient.auth.getUser();
      setUser(fetchUser?.data?.user ?? null);
    })();

    // Subscribe to authentication state changes
    const { data } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session);
      if (
        event === "SIGNED_IN" ||
        event === "USER_UPDATED" ||
        event === "TOKEN_REFRESHED"
      ) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    // Clean up subscription on unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
