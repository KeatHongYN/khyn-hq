import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/shared/Button";
import { isEq } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/shared/Sheet";
import { ToastAction } from "@/components/shared/Toast";

const MobileHeader = () => {
  const router = useRouter();
  const user = useUser();
  const isActiveLink = (href) => isEq(router.pathname, href);

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
      <SheetContent side="right">
        <nav className="flex flex-col items-center justify-center">
          <Link
            className={`text-slate-950 ${isActiveLink("/") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
            href="/"
          >
            <SheetTitle>KHYN HQ</SheetTitle>
          </Link>
          <Link
            className={`text-slate-950 ${isActiveLink("/submit") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
            href="/submit"
          >
            Submit
          </Link>
          <Link
            className={`text-slate-950 ${isActiveLink("/faq") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
            href="/faq"
          >
            FAQ
          </Link>
          {user ? (
            <Button className="w-full mt-4" onClick={handleLogout}>
              Logout
            </Button>
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
