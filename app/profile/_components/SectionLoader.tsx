import { Loader2 } from "lucide-react";
export default function SectionLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full py-4">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
