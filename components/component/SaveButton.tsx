"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { handleSave } from "@/actions/actions";
import { useToast } from "../ui/use-toast";
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
  const { data } = useSession();
  const router = useRouter();
  const save = async () => {
    if (!data) {
      signIn("google");
      return;
    }

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
