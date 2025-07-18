import { MailboxIcon } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "@/lib/get-server-session";
import { HeaderClient } from "./header-client";
import { Suspense } from "react";

// Force dynamic rendering for this component
export const dynamic = "force-dynamic";

const Header = async () => {
  // Get session server-side
  const session = await getServerSession();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <MailboxIcon className="h-6 w-6" />
        <span className="ml-4 text-md font-medium">Coldmail.io</span>
      </Link>

      {/* Static navigation links - server rendered - hidden on mobile */}
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
        <Link
          className="text-md font-medium hover:underline underline-offset-4"
          href="/templates"
        >
          Templates
        </Link>
        <Link
          className="text-md font-medium hover:underline underline-offset-4"
          href="/workspaces"
        >
          Workspaces
        </Link>
        <Link
          className="text-md font-medium hover:underline underline-offset-4"
          href="/pricing"
        >
          Pricing
        </Link>

        {/* Desktop user menu - wrapped in Suspense */}
        <Suspense
          fallback={<div className="w-10 h-10 rounded-full bg-gray-200"></div>}
        >
          <HeaderClient session={session} />
        </Suspense>
      </nav>

      {/* Mobile menu - always visible on mobile */}
      <div className="ml-auto md:hidden">
        <Suspense
          fallback={<div className="w-6 h-6 rounded bg-gray-200"></div>}
        >
          <HeaderClient session={session} />
        </Suspense>
      </div>
    </header>
  );
};

export default Header;
