"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface WorkspaceEmailCardProps {
  email: {
    id: string;
    subject: string;
    author: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
  currentUserId: string;
  currentUserRole: string;
  onEmailDeleted: () => void;
}

export function WorkspaceEmailCard({
  email,
  currentUserId,
  currentUserRole,
  onEmailDeleted,
}: WorkspaceEmailCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const canDelete =
    email.author.id === currentUserId ||
    ["admin", "owner"].includes(currentUserRole);

  const deleteEmail = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/emails/${email.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Email deleted",
          description: "The email has been successfully deleted.",
        });
        onEmailDeleted();
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
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-4 relative">
      {canDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 focus:text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Email</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{email.subject}"? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteEmail}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="space-y-2">
        <h3 className="font-medium text-sm line-clamp-2">{email.subject}</h3>
        <p className="text-xs text-muted-foreground">by {email.author.name}</p>
        <Link href={`/templates/edit/${email.id}`} className="block">
          <Button variant="outline" className="w-full mt-4">
            View Email
          </Button>
        </Link>
      </div>
    </Card>
  );
}
