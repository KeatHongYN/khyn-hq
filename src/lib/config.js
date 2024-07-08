const PORT = 3000;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "PROD";
export const PROD_HOST_URL = "https://khyn-hq.netlify.app";
const HOST_URLS = {
  PROD: PROD_HOST_URL,
  DEV: `http://localhost:${PORT}`
};
export const HOST_URL = HOST_URLS[ENVIRONMENT];
export const VERSION = "v1.0.0";

// SUPABASE
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// REGEX
export const EMAIL_INCLUDED_REGEX =
  /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
export const HTTPS_INCLUDED_REGEX = /(https?:\/\/\S+)/gi;
export const EMAIL_OR_HTTPS_INCLUDED_REGEX =
  /(https?:\/\/\S+|[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

// URL
export const KHYN_IG_URL = "https://www.instagram.com/keathongyouths/";
export const KEI_LOK_GITHUB_URL = "https://github.com/keiloktql";

// FIREBASE
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
