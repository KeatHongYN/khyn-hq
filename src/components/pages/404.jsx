/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/shared/Button";

const Custom404 = () => {
  const router = useRouter();
  return (
    <MainLayout
      title="Error 404"
      className="mx-auto flex w-full max-w-screen-xl flex-col justify-center px-16"
    >
      <p className="font-semibold text-primary">404 error</p>
      <h1 className="text-4xl mt-2 font-semibold text-slate-900">
        We can't find that page
      </h1>
      <p className="text-md mt-2 text-slate-600">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Button className="mt-4 w-fit" onClick={() => router.push("/")}>
        Take me home
      </Button>
    </MainLayout>
  );
};

export default Custom404;
