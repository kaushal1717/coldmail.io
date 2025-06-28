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
import { PlusCircle, Send, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function page({ params }: { params: { id: string } }) {
  const [id, setId] = useState<string>();
  const [recipientEmail, setRecipientEmail] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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

  const deleteEmail = async () => {
    try {
      const response = await fetch(`/api/emails/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Email deleted",
          description: "The email has been successfully deleted.",
        });
        router.push("/templates"); // Redirect to templates page
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete email",
        variant: "destructive",
      });
    }
  };

  const addRecipient = () => {
    if (email.length == 0) {
      toast({
        title: "Email field is empty",
        description: "Please enter recipient email",
      });
      return;
    }
    if (recipientEmail.find((mail) => mail === email)) {
      toast({
        title: "Enter a new email",
        description: "Email already exists in the list!",
      });
      return;
    }
    setRecipientEmail((prev: string[]) => [...prev, email]);
    setEmail("");
  };

  const removeRecipient = (mail: string) => {
    setRecipientEmail(recipientEmail.filter((email) => email !== mail));
  };

  const openClientWithEmail = () => {
    window.location.href = `mailto:${recipientEmail.join(
      ","
    )}?subject=${subject}&body=${encodeURIComponent(content)}`;
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
        <CardFooter className="flex justify-between gap-2 p-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Email Template</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this email template? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteEmail}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={saveChanges}>Save Changes</Button>
          </div>

          <Dialog>
            <DialogTrigger className="flex flex-row bg-white font-sans  rounded-lg">
              <Button className="flex items-center gap-2">
                Send
                <Send size={14} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emails</DialogTitle>
                <DialogDescription>
                  <div className="flex mt-2 items-center gap-2">
                    <Input
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <PlusCircle
                      size={30}
                      color="white"
                      className="cursor-pointer"
                      onClick={addRecipient}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {recipientEmail.length > 0 &&
                      recipientEmail.map((email: string) => {
                        return (
                          <div key={email}>
                            <div className="bg-slate-300 px-2 py-1 text-sm flex items-center justify-between gap-2 text-black rounded-lg">
                              {email}
                              <X
                                size={16}
                                onClick={() => removeRecipient(email)}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {recipientEmail.length > 0 && (
                    <div className="mt-3 w-full">
                      <Button onClick={openClientWithEmail}>Send</Button>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
