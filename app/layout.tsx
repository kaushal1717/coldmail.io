import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import CustomProvider from "./CustomProvider";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coldmail.io",
  description: "Personalized Cold Emails Made Easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="system">
        <body className={inter.className}>
          <CustomProvider>{children}</CustomProvider>
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
}
