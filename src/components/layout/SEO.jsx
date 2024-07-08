import Head from "next/head";
import React from "react";

const SEO = ({ title = "KHYN HQ" }) => (
  <Head>
    <meta charSet="utf-8" />
    <title>{title}</title>
    <meta name="robots" content="index, follow" />
    <meta
      name="description"
      content="KHYN HQ revolutionizes event monitoring with cutting-edge technology. Real-time tracking of large scale events."
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="KHYN HQ - Real-time Event Monitoring" />
    <meta
      property="og:description"
      content="KHYN HQ revolutionizes event monitoring with cutting-edge technology. Real-time tracking of large scale events."
    />
    <meta
      property="og:image"
      content="https://khyn-hq.netlify.app/android-chrome-192x192.png"
    />
    <meta property="og:url" content="https://khyn-hq.netlify.app/" />
    <meta property="og:site_name" content="KHYN HQ" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="KHYN HQ - Real-time Event Monitoring" />
    <meta
      name="twitter:description"
      content="KHYN HQ revolutionizes event monitoring with cutting-edge technology. Real-time tracking of large scale events."
    />
    <meta
      name="twitter:image"
      content="https://raw.githubusercontent.com/KeatHongYN/khyn-hq/main/public/assets/marketing/marketing-github.png"
    />
  </Head>
);

export default SEO;
