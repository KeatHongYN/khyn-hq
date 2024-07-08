import { useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import "@/styles/globals.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  ENVIRONMENT,
  FIREBASE_CONFIG,
  SUPABASE_ANON_KEY,
  SUPABASE_URL
} from "@/lib/config";
import Providers from "@/components/layout/Providers";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // hide console.log in PROD
  if (ENVIRONMENT === "PROD") console.log = () => {};
  // hide recharts defaultProps error
  const { error } = console;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  const app = initializeApp(FIREBASE_CONFIG);
  const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: SUPABASE_URL,
      supabaseKey: SUPABASE_ANON_KEY
    })
  );
  return (
    <Providers supabaseClient={supabaseClient} pageProps={pageProps}>
      <Component {...pageProps} />
    </Providers>
  );
}
