"use client";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Layers, Share, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export function HeroSection() {
  const router = useRouter();
  const { data } = useSession();
  const onGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/templates",
    });
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
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
                  from our app, with options to edit and delete—all in one
                  place.
                </p>
              </div>
              {data && (
                <div className="space-x-4">
                  <Button
                    className="text-lg dark:hover:bg-gray-800 dark:hover:text-gray-50"
                    onClick={() => router.push("/templates")}
                  >
                    Get Started
                  </Button>
                </div>
              )}
              {!data && (
                <Dialog>
                  <DialogTrigger className="bg-white text-black px-3 py-2 text-lg font-sans font-semibold rounded-lg dark:hover:bg-gray-800 dark:hover:text-gray-50">
                    Get Started
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Login</DialogTitle>
                      <DialogDescription>
                        <Button
                          className="w-full mt-2 font-semibold text-lg gap-2"
                          onClick={onGoogleSignIn}
                        >
                          <Image
                            src="/google.png"
                            width="20"
                            height="20"
                            alt="google-logo"
                          />
                          Google
                        </Button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 bg-opacity-50 shadow-gray-700">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <Image
                alt="Email Template Builder"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/email.svg"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    Email Templates
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Craft Personalized Emails in Minutes
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Our AI-powered template builder allows you to quickly create
                    personalized email templates tailored to your needs. Save
                    your templates and share them with your friends or
                    colleagues.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-md font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="/templates/new"
                  >
                    Create Template
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-md font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="/pricing"
                  >
                    Browse Plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:mx-32 gap-7 m-6 ">
            <Card className="hover:shadow-gray-700 shadow-md">
              <CardHeader className="flex">
                <MailboxIcon className="h-8 w-8 text-blue-500" />
                <CardTitle>Email Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Create and customize email templates for different industries
                  and job types. Save your templates for easy access and reuse.
                </p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader className="flex ">
                <ShoppingCart className="h-8 w-8 text-blue-500" />
                <CardTitle>Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse and purchase email templates created by other users.
                  Expand your template library with high-performing content.
                </p>
              </CardContent>
            </Card> */}

            <Card className="hover:shadow-gray-700 shadow-md">
              <CardHeader className="flex ">
                <Share className="h-8 w-8 text-blue-500" />
                <CardTitle>Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Share your email templates with your team or the community.
                  Collaborate on creating the perfect cold email.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-gray-700 shadow-md">
              <CardHeader className="flex ">
                <User className="h-8 w-8 text-blue-500" />
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Create a user account to access all the features of the app.
                  Manage your templates, campaigns, and settings in one place
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-gray-700 shadow-md">
              <CardHeader className="flex ">
                <Layers className="h-8 w-8 text-blue-500" />
                <CardTitle>Customization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Tailor your email templates to match your brand and target
                  audience. Personalize your outreach for maximum impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}

function MailboxIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
      <polyline points="15,9 18,9 18,11" />
      <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" />
      <line x1="6" x2="7" y1="10" y2="10" />
    </svg>
  );
}
