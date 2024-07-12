"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { editTemplate, handleGetWithId } from "@/actions/actions";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function page({ params }: { params: { id: string } }) {
  const [id, setId] = useState<string>();
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();
  const fetchEmail = async () => {
    const fetchedEmail = await handleGetWithId(params.id);
    if (fetchedEmail) {
      setSubject(fetchedEmail.subject);
      setContent(fetchedEmail.content);
      setId(fetchedEmail.id);
    }
  };

  const saveChanges = async () => {
    const edited = await editTemplate(id!, subject!, content!);
    if (edited) {
      toast({
        title: "Email edited Successfully",
        description: "Email edited!",
      });
      router.back();
    }
  };

  useEffect(() => {
    fetchEmail();
  }, []);
  return (
    <div className="flex items-center justify-center bg-muted m-4">
      <Card className="w-full h-full max-w-none border-none">
        <CardHeader>
          <CardTitle>Edit Template</CardTitle>
          <CardDescription>
            Update the subject and email content for this template.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 p-6">
          <div className="grid gap-3">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email Content</Label>
            <Textarea
              id="email"
              placeholder="Enter email content"
              className="flex-1 min-h-[400px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={saveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
