"use client";

import { Button } from "@/components/ui/button";
import { EyeIcon, Pencil, Share, TrashIcon, CopyIcon } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { handleDelete } from "@/actions/actions";

interface Template {
  id: string;
  content: string;
  category: string;
  subject: string;
  uniqueIdentifier: string;
}

interface TemplatesClientProps {
  template: Template;
}

export default function TemplatesClient({ template }: TemplatesClientProps) {
  const { toast } = useToast();
  const router = useRouter();

  const deleteTemplate = async (emailId: string) => {
    const deleted = await handleDelete(emailId);
    if (deleted) {
      toast({
        title: "Template Successfully deleted",
        description: "Your template has been deleted",
      });
      // Refresh the page to update the list
      router.refresh();
    }
  };

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Share this link to others to share the template",
    });
  };

  return (
    <div className="bg-background rounded-lg shadow-lg overflow-hidden border-gray-800 border-2">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-left">
          {template.subject}
        </h2>
        <p className="text-muted-foreground text-sm line-clamp-5 text-left">
          {template.content}
        </p>
        <div className="flex items-center justify-end mt-4">
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost">
                <EyeIcon className="w-5 h-5 text-slate-300" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{template.subject}</DialogTitle>
              </DialogHeader>
              <Textarea
                className="h-[450px] resize-none my-4 rounded-lg outline-none focus-visible:ring-transparent border-none focus:ring-0 scroll"
                readOnly={true}
                defaultValue={template.content}
              />

              <Button
                className="gap-2 font-semibold"
                onClick={() => router.push(`/templates/edit/${template.id}`)}
              >
                Edit
                <Pencil size={16} />
              </Button>
            </DialogContent>
          </Dialog>

          <span className="text-slate-400">|</span>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="ghost">
                <TrashIcon className="w-5 h-5 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your email template.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTemplate(template.id)}>
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span className="text-slate-400">|</span>
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost">
                <Share className="w-5 h-5 text-slate-300" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share</DialogTitle>
              </DialogHeader>
              <Input
                readOnly
                value={`${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/share/${template.uniqueIdentifier}`}
              />
              <Button
                className="gap-2"
                onClick={() =>
                  copyShareLink(
                    `${
                      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                    }/share/${template.uniqueIdentifier}`
                  )
                }
              >
                <CopyIcon className="w-5 h-5" />
                Copy
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
