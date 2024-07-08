import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { isEq } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { ToastAction } from "@/components/shared/Toast";
import { useToast } from "@/components/shared/Toast/use-toast";
import { createClient } from "@/lib/supabase/component";

// import CommandMenu from "@/components/shared/CommandMenu";

const DesktopHeader = () => {
  const { toast } = useToast();
  const router = useRouter();
  const supabaseClient = createClient();
  const [user, setUser] = useState(null);
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
    toast({
      title: "Logout success",
      description: "See you again!"
    });
    router.replace("/");
  };

  useEffect(() => {
    (async () => {
      const getUser = await supabaseClient.auth.getUser();
      setUser(getUser.data.user);
    })();
  }, []);

  return (
    <nav className="w-full h-full justify-between items-center hidden md:flex">
      <span className="flex gap-x-6">
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
      </span>

      <span>
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button
            className="hidden md:flex"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        )}
      </span>
      {/* <div className="w-full flex-1 md:w-auto md:flex-none">
        <CommandMenu />
      </div> */}
    </nav>
  );
};

export default DesktopHeader;
