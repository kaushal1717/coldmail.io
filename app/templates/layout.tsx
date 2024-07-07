import Header from "@/components/component/header";
import Terms from "@/components/component/terms";

export default function TemplateCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Header />
      <div>{children}</div>
    </div>
  );
}
