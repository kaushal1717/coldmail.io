import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coldmail.io",
  description: "Personalized Cold Emails Made Easy",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
