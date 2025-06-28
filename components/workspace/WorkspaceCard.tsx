"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail } from "lucide-react";
import Link from "next/link";

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    members: Array<{
      role: string;
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
      };
    }>;
    _count: {
      emails: number;
    };
    updatedAt: Date;
  };
  currentUserId?: string;
}

export function WorkspaceCard({
  workspace,
  currentUserId,
}: WorkspaceCardProps) {
  const memberCount = workspace.members.length;
  const emailCount = workspace._count.emails;

  // Find current user's role in this workspace
  const userRole =
    workspace.members.find((m) => m.user.id === currentUserId)?.role ||
    "member";

  return (
    <Link href={`/workspaces/${workspace.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{workspace.name}</h3>
              {workspace.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {workspace.description}
                </p>
              )}
            </div>
            <Badge variant={userRole === "owner" ? "default" : "secondary"}>
              {userRole}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {memberCount} member{memberCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>
                {emailCount} email{emailCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
