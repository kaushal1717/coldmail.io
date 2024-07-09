import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Terms from "./terms";

const Footer = () => {
  return (
    <>
      <div>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Boost Your Cold Outreach?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Sign up today and start creating personalized email templates
                for your next cold email campaign.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit">Get Started</Button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Terms />
    </>
  );
};

export default Footer;
