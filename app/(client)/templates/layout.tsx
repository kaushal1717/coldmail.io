import Header from "@/components/common/header";
import Terms from "@/components/terms";
import { SkeletonTheme } from "react-loading-skeleton";
export default function TemplateCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Header />
      <SkeletonTheme baseColor="#374151" highlightColor="#4c5c75">
        <div className="min-h-[calc(100vh-10px)]">{children}</div>
      </SkeletonTheme>
      <Terms />
    </div>
  );
}
