import { CircleCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleCheck
          className="mx-auto h-20 w-20 text-primary"
          color="#00F766"
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Payment Successful!!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your new subscription has been added. Enjoy easy <br />
          cold-emailing with Coldmail.io!
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
