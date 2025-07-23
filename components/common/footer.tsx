import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative flex flex-col sm:flex-row justify-between mt-3 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      {/* Left: Copyright */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
        © 2024 Cold Email Generator. All rights reserved.
      </p>

      {/* Center: Navigation Links */}
      <nav className="flex gap-4 sm:gap-6 mb-2 sm:mb-0">
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="/terms"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="/privacy"
        >
          Privacy
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="/refunds"
        >
          Refunds & Cancellations
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="/contact"
        >
          Contact Us
        </Link>
      </nav>

      {/* Right: Contact Us Column */}
      <div className="text-xs text-gray-700 dark:text-gray-300 text-left">
        <div className="font-semibold mb-1">Contact Us</div>
        <div>Phone: +91-9909598984</div>
        <div>Email: kpadaliya1717@example.com</div>
        <div>Address: Surat, Gujarat, India</div>
      </div>
    </footer>
  );
};

export default Footer;
