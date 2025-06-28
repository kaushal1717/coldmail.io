"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";

interface Member {
  id: string;
  role: string;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface WorkspaceMemberListProps {
  members: Member[];
  workspaceId: string;
  currentUserId: string;
  currentUserRole: string;
}

export function WorkspaceMemberList({
  members,
  workspaceId,
  currentUserId,
  currentUserRole,
}: WorkspaceMemberListProps) {
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const canRemoveMembers = ["owner", "admin"].includes(currentUserRole);

  const removeMember = async (userId: string, userName: string) => {
    setRemovingMemberId(userId);
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/members?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to remove member");
      }

      toast({
        title: "Member removed",
        description: `${userName} has been removed from the workspace.`,
      });

      router.refresh();
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to remove member",
        variant: "destructive",
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={member.user.image || undefined} />
              <AvatarFallback>
                {member.user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {member.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant={
                member.role === "owner"
                  ? "default"
                  : member.role === "admin"
                  ? "secondary"
                  : "outline"
              }
            >
              {member.role}
            </Badge>

            {canRemoveMembers &&
              member.role !== "owner" &&
              member.user.id !== currentUserId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={removingMemberId === member.user.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {member.user.name} from
                        this workspace? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          removeMember(member.user.id, member.user.name)
                        }
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
