import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginButton } from "@/components/auth/login-button";
import { Suspense } from "react";

interface HeroSectionProps {
  session: any;
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Personalized Cold Emails Made Easy
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Generate highly personalized email templates for your cold
              outreach campaigns. Save, copy, and send your emails directly
              from our app, with options to edit and delete—all in one place.
            </p>
          </div>

          {/* Conditionally render based on session */}
          <Suspense fallback={<div className="h-10"></div>}>
            {session ? (
              <div className="space-x-4">
                <Button
                  className="text-lg dark:hover:bg-gray-800 dark:hover:text-gray-50"
                  asChild
                >
                  <Link href="/templates">Get Started</Link>
                </Button>
              </div>
            ) : (
              <LoginButton />
            )}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
