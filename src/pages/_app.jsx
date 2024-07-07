import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import "@/styles/globals.css";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";
import Providers from "@/components/layout/Providers";

export default function App({ Component, pageProps }) {
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
