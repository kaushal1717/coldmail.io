import { FeatureCard } from "@/components/home/feature-card";
import { MailboxIcon, Share, User, Layers } from "lucide-react";

export function FeatureCardsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-center">
        Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:mx-32 gap-7 m-6">
        <FeatureCard
          icon={<MailboxIcon className="h-8 w-8 text-blue-500" />}
          title="Email Templates"
          description="Create and customize email templates for different industries and job types. Save your templates for easy access and reuse."
        />

        <FeatureCard
          icon={<Share className="h-8 w-8 text-blue-500" />}
          title="Sharing"
          description="Share your email templates with your team or the community. Collaborate on creating the perfect cold email."
        />

        <FeatureCard
          icon={<User className="h-8 w-8 text-blue-500" />}
          title="User Accounts"
          description="Create a user account to access all the features of the app. Manage your templates, campaigns, and settings in one place."
        />

        <FeatureCard
          icon={<Layers className="h-8 w-8 text-blue-500" />}
          title="Customization"
          description="Tailor your email templates to match your brand and target audience. Personalize your outreach for maximum impact."
        />
      </div>
    </section>
  );
}