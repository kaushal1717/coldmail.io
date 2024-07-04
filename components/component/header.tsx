"use client";
import { LogOutIcon, MailboxIcon, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = () => {
  const { data } = useSession();
  const onGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/pricing" });
  };
  const onGoogleSignOut = () => {
    signOut();
  };
  return (
    <div>
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MailboxIcon className="h-6 w-6" />
          <span className="sr-only">Cold Email Generator</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/templates"
          >
            Templates
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/pricing"
          >
            Pricing
          </Link>
          {!data ? (
            <Button
              className="flex items-center gap-2"
              onClick={onGoogleSignIn}
            >
              <User2 size={16} />
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className=" px-2 py-1 rounded-md flex items-center gap-2">
                  <Image
                    className="rounded-full"
                    src={data.user?.image || ""}
                    height={30}
                    width={30}
                    alt="user"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem onClick={onGoogleSignOut}>
                  Logout{" "}
                  <span className="ml-3">
                    <LogOutIcon />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </header>
    </div>
  );
};
export default Header;
