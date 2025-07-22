"use client";

import { Button } from "@/components/ui/button";
import { MailboxIcon } from "lucide-react";
import { authClient } from "@/lib/authClient";
import Image from "next/image";

export default function Page() {
  const onGoogleSignIn = () => {
    return authClient.signIn.social({ provider: "google" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-background shadow-xl rounded-xl p-6 flex flex-col items-center w-full max-w-md border">
        <MailboxIcon className="h-10 w-10 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-center">
          Sign in to Coldmail.io
        </h1>
        <p className="text-slate-500 mb-6 text-center text-sm">
          Access your workspace and manage your cold emails.
        </p>
        <Button
          className="flex items-center gap-2 w-full justify-center"
          onClick={onGoogleSignIn}
          variant="outline"
          size="lg"
        >
          <Image
            src="/google.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
