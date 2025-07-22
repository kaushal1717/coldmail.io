import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}
