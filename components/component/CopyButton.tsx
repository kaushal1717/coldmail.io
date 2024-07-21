"use client";

import { CopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const CopyButton = ({ copyString }: { copyString: string }) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(copyString);
    toast({
      title: "Email body copied to clipboard",
      description: "check clipboard",
    });
  };
  return (
    <div>
      <Button className="gap-2" onClick={handleCopy}>
        <CopyIcon className="w-5 h-5" />
        Copy
      </Button>
    </div>
  );
};
export default CopyButton;
