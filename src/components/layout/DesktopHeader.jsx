import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { User } from "lucide-react";
import { isEq } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { ToastAction } from "@/components/shared/Toast";
import { useToast } from "@/components/shared/Toast/use-toast";
import { createClient } from "@/lib/supabase/component";
import AuthContext from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/shared/DropdownMenu";
import CommandMenu from "@/components/shared/CommandMenu";
import SettingsContext from "@/lib/SettingsContext";

const DesktopHeader = () => {
  const { toast } = useToast();
  const router = useRouter();
  const supabaseClient = createClient();
  const { user } = useContext(AuthContext);
  const { showHeader, setShowHeader } = useContext(SettingsContext);
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

      <div className="w-full md:w-auto md:flex-none">
        <CommandMenu />
      </div>

      <span>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <User className="hover:bg-gray-100 p-2 cursor-pointer h-10 w-10 rounded-full text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-600">
                    {user.user_metadata.username}
                  </p>
                  <p className="text-xs leading-none text-gray-400">
                    Volunteer
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setShowHeader((curr) => !curr)}
                >
                  {showHeader ? "Hide Header" : "Show Header"}
                  <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="hidden md:flex"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        )}
      </span>
    </nav>
  );
};

export default DesktopHeader;
