import { Suspense } from "react";
import { getServerSession } from "@/lib/get-server-session";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Plus } from "lucide-react";
import Link from "next/link";
import { WorkspaceMemberList } from "@/components/workspace/WorkspaceMemberList";
import { AddMemberForm } from "@/components/workspace/AddMemberForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

async function getWorkspace(id: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return null;
    }

    const memberCheck = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: id,
        },
      },
    });

    if (!memberCheck) {
      return null;
    }

    // Get workspace with members and recent emails
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            joinedAt: "asc",
          },
        },
        emails: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            id: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            emails: true,
          },
        },
      },
    });

    return workspace;
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return null;
  }
}

function WorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

async function WorkspaceContent({ id }: { id: string }) {
  const session = await getServerSession();
  const workspace = await getWorkspace(id);

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Workspace not found</h3>
        <p className="text-muted-foreground mb-4">
          This workspace doesn't exist or you don't have access to it.
        </p>
        <Link href="/workspaces">
          <Button>Back to Workspaces</Button>
        </Link>
      </div>
    );
  }

  const currentUserMember = workspace.members.find(
    (member: any) => member.user.id === session?.user?.id
  );
  const currentUserRole = currentUserMember?.role || "member";
  const canManageMembers = ["owner", "admin"].includes(currentUserRole);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-muted-foreground mt-2">
              {workspace.description}
            </p>
          )}
        </div>
        <Badge variant={currentUserRole === "owner" ? "default" : "secondary"}>
          {currentUserRole}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspace.members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspace._count.emails}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={`/templates/new?workspace=${workspace.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Create Email
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Members Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Team Members</h2>
            {canManageMembers && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                  </DialogHeader>
                  <AddMemberForm workspaceId={workspace.id} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <WorkspaceMemberList
            members={workspace.members}
            workspaceId={workspace.id}
            currentUserId={session?.user?.id || ""}
            currentUserRole={currentUserRole}
          />
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Emails</h2>
          <div className="space-y-3">
            {workspace.emails.slice(0, 5).map((email: any) => (
              <Card key={email.id} className="p-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{email.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    by {email.author.name}
                  </p>
                </div>
              </Card>
            ))}

            {workspace.emails.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No emails created yet.
              </p>
            )}

            {workspace.emails.length > 0 && (
              <Link href={`/workspaces/${workspace.id}/emails`}>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Emails
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<WorkspaceSkeleton />}>
        <WorkspaceContent id={params.id} />
      </Suspense>
    </div>
  );
}
