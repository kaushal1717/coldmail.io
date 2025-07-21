import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Coldmail.io",
  description: "Terms and Conditions for using Coldmail.io services",
};

export default function TermsPage() {
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='prose prose-gray dark:prose-invert max-w-none'>
        <h1 className='text-3xl font-bold mb-8 text-center'>
          Terms and Conditions
        </h1>

        <div className='bg-card border rounded-lg p-6 shadow-sm'>
          <p className='text-muted-foreground mb-6'>
            Welcome to coldmail. By using our website and services (including
            AI-powered email generation and sending tools), you agree to these
            Terms and Conditions.
          </p>

          <div className='space-y-6'>
            <section>
              <h2 className='text-xl font-semibold mb-3'>1. Services</h2>
              <ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
                <li>
                  We provide a digital service to help users create,
                  personalize, and send emails using AI.
                </li>
                <li>
                  This is a subscription-based or free digital service only,
                  with no physical products delivered.
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-xl font-semibold mb-3'>2. Account Usage</h2>
              <ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
                <li>
                  We reserve the right to suspend accounts for suspicious or
                  abusive activity.
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-xl font-semibold mb-3'>3. Payments</h2>
              <ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
                <li>Payments are processed via Razorpay payment gateway</li>
                <li>
                  All prices are listed in INR and include applicable taxes.
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-xl font-semibold mb-3'>4. Prohibited Use</h2>
              <p className='text-muted-foreground mb-3'>
                You agree not to use the service to:
              </p>
              <ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
                <li>Send spam, phishing, or harmful content.</li>
                <li>Violate any law or regulation.</li>
              </ul>
            </section>

            <section>
              <h2 className='text-xl font-semibold mb-3'>5. Modifications</h2>
              <ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
                <li>
                  We reserve the right to modify or discontinue the service at
                  any time.
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-xl font-semibold mb-3'>6. Governing Law</h2>
              <p className='text-muted-foreground'>
                These Terms shall be governed by the laws of India.
              </p>
            </section>
          </div>

          <div className='mt-8 pt-6 border-t'>
            <p className='text-sm text-muted-foreground'>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
