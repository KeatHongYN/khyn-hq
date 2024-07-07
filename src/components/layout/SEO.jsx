import Head from "next/head";
import React from "react";

const SEO = ({ title = "KHYN HQ" }) => (
  <Head>
    <meta charSet="utf-8" />
    <title>{title}</title>
    <meta name="robots" content="index, follow" />
    <meta name="description" content="Events monitoring for KHYN" />
  </Head>
);

export default SEO;
