"use client";
import { LogOutIcon, MailboxIcon, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

const Header = () => {
  const { data } = useSession();
  const router = useRouter();
  const onGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/templates" });
  };
  const onGoogleSignOut = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };
  return (
    <div>
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MailboxIcon className="h-6 w-6" />
          <span className="ml-4 text-md font-medium">Coldmail.io</span>
        </Link>
        <nav className="ml-auto hidden sm:flex gap-4 sm:gap-6 items-center">
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
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
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
        <div className="w-full flex  justify-end sm:hidden">
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
              <nav className="flex  flex-col-reverse gap-4 sm:gap-6 items-start mt-6">
                {data && (
                  <Button onClick={onGoogleSignOut} className="w-full">
                    Logout{" "}
                    <span className="ml-3">
                      <LogOutIcon size={20} />
                    </span>
                  </Button>
                )}
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

                {!data ? (
                  <Button
                    className="flex items-center gap-2 w-full"
                    onClick={onGoogleSignIn}
                  >
                    <User2 size={16} />
                    Login
                  </Button>
                ) : (
                  <div className="  py-1 rounded-md w-full flex flex-col items-center justify-center gap-1">
                    <Link href="/profile">
                      <Image
                        className="rounded-full"
                        src={data.user?.image || ""}
                        height={50}
                        width={50}
                        alt="user"
                      />
                    </Link>
                    <span className="text-xl font-bold">{data.user?.name}</span>
                    <span className="text-slate-400 text-sm">
                      {data.user?.email}
                    </span>
                    <Separator className="mt-3" />
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
};
export default Header;
