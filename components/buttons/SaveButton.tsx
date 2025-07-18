"use client";
import { Button } from "@/components/ui/button";
import { handleSave } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const SaveButton = ({
  subject,
  content,
  category,
}: {
  subject: string;
  content: string;
  category: string;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const save = async () => {
    const email = await handleSave(content, subject, category);
    if (email) {
      toast({
        title: "Template saved",
        description: "check your saved templates",
      });
      router.push("/templates");
    }
  };
  return (
    <div>
      <Button onClick={save}>Save</Button>
    </div>
  );
};
export default SaveButton;
