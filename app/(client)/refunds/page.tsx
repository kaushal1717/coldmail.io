import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RefundsPolicy() {
  return (
    <main className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Refunds & Cancellations Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-300">
          <section>
            <p>
              At Coldmail.io, we strive to provide the best possible service.
              Please read our Refunds & Cancellations Policy carefully before
              making a purchase.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">
              1. Subscription Cancellations
            </h2>
            <p>
              You may cancel your subscription at any time from your account
              dashboard. Upon cancellation, you will continue to have access to
              premium features until the end of your current billing cycle. No
              further payments will be charged after cancellation.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">2. Refund Policy</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                If you are not satisfied with our service, you may request a
                refund within 7 days of your initial purchase.
              </li>
              <li>
                Refunds are not applicable for renewal payments or if you have
                violated our terms of service.
              </li>
              <li>
                Approved refunds will be processed within{" "}
                <strong>5-7 working days</strong> and the amount will be
                credited to your original payment method.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">3. How to Request a Refund</h2>
            <p>
              To request a refund, please contact us at{" "}
              <a href="mailto:support@example.com" className="underline">
                support@example.com
              </a>{" "}
              with your order details and reason for the request. Our team will
              review your request and respond promptly.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">4. Contact</h2>
            <p>
              For any questions about this policy, email us at{" "}
              <a href="mailto:support@example.com" className="underline">
                support@example.com
              </a>{" "}
              or write to: 123, Example Street, Mumbai, India.
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
