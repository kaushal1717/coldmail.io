import Header from "@/components/common/header";
import Terms from "@/components/terms";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Header />
      <div className="min-h-[calc(100vh-10px)]">{children}</div>
      <Terms />
    </div>
  );
}
