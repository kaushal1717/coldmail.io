"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/authClient";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface HeaderClientProps {
  session: any;
}

export function HeaderClient({ session: serverSession }: HeaderClientProps) {
  const [mounted, setMounted] = useState(false);

  const { data: authSession } = authClient.useSession();
  const session = mounted ? authSession : serverSession;

  useEffect(() => {
    setMounted(true);
  }, []);

  const onGoogleSignIn = () => {
    return authClient.signIn.social({ provider: "google" });
  };

  const onGoogleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-gray-200" />;
  }

  return (
    <>
      {/* Desktop view */}
      {!session ? (
        <Button className="flex items-center gap-2" onClick={onGoogleSignIn}>
          <User2 size={16} />
          Login
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="px-2 py-1 rounded-md flex items-center gap-2">
              {session.user?.image ? (
                <Image
                  className="rounded-full"
                  src={session.user.image}
                  height={30}
                  width={30}
                  alt="user"
                />
              ) : (
                <div className="w-[30px] h-[30px] rounded-full bg-gray-300 flex items-center justify-center">
                  <User2 size={16} />
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/templates">Templates</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGoogleSignOut}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Mobile view */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger>
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Coldmail.io</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 sm:gap-6 items-start mt-6">
              <Link
                className="text-md font-medium hover:underline underline-offset-4"
                href="/templates"
              >
                Templates
              </Link>
              <Link
                className="text-md font-medium hover:underline underline-offset-4"
                href="/pricing"
              >
                Pricing
              </Link>

              {!session ? (
                <Button
                  className="flex items-center gap-2 w-full"
                  onClick={onGoogleSignIn}
                >
                  <User2 size={16} />
                  Login
                </Button>
              ) : (
                <div className="py-1 rounded-md w-full flex flex-col items-center justify-center gap-1">
                  <Link href="/profile">
                    {session.user?.image ? (
                      <Image
                        className="rounded-full"
                        src={session.user.image}
                        height={50}
                        width={50}
                        alt="user"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center">
                        <User2 size={24} />
                      </div>
                    )}
                  </Link>
                  <span className="text-xl font-bold">
                    {session.user?.name || "User"}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {session.user?.email || ""}
                  </span>
                  <Separator className="mt-3" />
                </div>
              )}

              {session && (
                <Button onClick={onGoogleSignOut} className="w-full mt-4">
                  Logout{" "}
                  <span className="ml-3">
                    <LogOutIcon size={20} />
                  </span>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
