import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 bg-opacity-50 shadow-gray-700">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <Image
            alt="Email Template Builder"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            height="310"
            src="/email.svg"
            width="550"
            priority
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
                personalized email templates tailored to your needs. Save your
                templates and share them with your friends or colleagues.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild>
                <Link href="/templates/new">Create Template</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">Browse Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
