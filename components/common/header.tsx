import { MailboxIcon } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "@/lib/get-server-session";
import { HeaderClient } from "./header-client";
import { Suspense } from "react";

const Header = async () => {
  // Get session server-side
  const session = await getServerSession();
  
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <MailboxIcon className="h-6 w-6" />
        <span className="ml-4 text-md font-medium">Coldmail.io</span>
      </Link>
      
      {/* Static navigation links - server rendered */}
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
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
        
        {/* Client component for interactive elements - wrapped in Suspense */}
        <Suspense fallback={<div className="w-10 h-10 rounded-full bg-gray-200"></div>}>
          <HeaderClient session={session} />
        </Suspense>
      </nav>
    </header>
  );
};

export default Header;
