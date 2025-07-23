import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <main className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-300">
          <p>
            Your privacy is important to us at Coldmail.io. This policy explains
            what information we collect, how we use it, and your choices
            regarding your data.
          </p>

          <section>
            <h2 className="font-semibold mb-2">1. What We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account Info:</strong> When you sign up, we collect your
                name, email, and password.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect data about how you use
                our site to improve our services.
              </li>
              <li>
                <strong>Payment Info:</strong> If you make a purchase, payment
                details are processed securely by our payment provider (e.g.,
                Razorpay). We do not store your card details.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies only for essential site
                functionality, such as authentication and session management. We
                do not use cookies to store your preferences or for tracking
                purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and improve our services.</li>
              <li>To communicate with you about your account or updates.</li>
              <li>To process payments and prevent fraud.</li>
              <li>To comply with legal requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">3. Sharing & Security</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                We do <strong>not</strong> sell your data.
              </li>
              <li>
                We may share data with trusted providers (like payment
                processors) who help us run our business, but only as needed and
                with strict confidentiality.
              </li>
              <li>
                We use industry-standard security measures to protect your data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">4. Your Choices</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You can access, update, or delete your account information at
                any time.
              </li>
              <li>
                For any privacy-related requests, contact us at{" "}
                <a href="mailto:support@example.com" className="underline">
                  support@example.com
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">5. Changes</h2>
            <p>
              We may update this policy from time to time. We’ll notify you of
              any significant changes.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">6. Contact</h2>
            <p>
              Questions? Email us at{" "}
              <a href="mailto:kpadaliya1717@gmail.com" className="underline">
                kpadaliya1717@gmail.com
              </a>{" "}
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
