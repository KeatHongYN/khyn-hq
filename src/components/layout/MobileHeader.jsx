import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { isEq } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/shared/Sheet";
import { ToastAction } from "@/components/shared/Toast";
import { createClient } from "@/lib/supabase/component";
import AuthContext from "@/lib/AuthContext";

const MobileHeader = () => {
  const router = useRouter();
  const isActiveLink = (href) => isEq(router.pathname, href);
  const supabaseClient = createClient();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    console.log(error);
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }
    router.replace("/");
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="h-6 md:hidden w-6" />
      </SheetTrigger>
      <SheetContent className="z-[99999]" side="right">
        <nav className="flex flex-col items-center justify-center">
          <Link
            className={`text-slate-950 ${isActiveLink("/") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
            href="/"
          >
            <SheetTitle>KHYN HQ</SheetTitle>
          </Link>
          {user && (
            <Link
              className={`text-slate-950 ${isActiveLink("/submit") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
              href="/submit"
            >
              Submit
            </Link>
          )}
          <Link
            className={`text-slate-950 ${isActiveLink("/faq") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
            href="/faq"
          >
            FAQ
          </Link>
          {user ? (
            <>
              <Button className="w-full mt-4" onClick={handleLogout}>
                Logout
              </Button>
              <div className="flex flex-col space-y-1 mt-4 text-center">
                <p className="text-xs font-medium leading-none text-gray-600">
                  {user.user_metadata.username}
                </p>
                <p className="text-xs leading-none text-gray-400">Volunteer</p>
              </div>
            </>
          ) : (
            <Button
              className="w-full mt-4"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileHeader;
