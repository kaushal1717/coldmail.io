import { Suspense } from "react";
import { getServerSession } from "@/lib/get-server-session";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { WorkspaceEmailList } from "@/components/workspace/WorkspaceEmailList";

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

    // Get workspace basic info
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return workspace;
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return null;
  }
}

async function WorkspaceEmailsContent({ id }: { id: string }) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/workspaces/${workspace.id}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {workspace.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">All Emails</span>
          </div>
          <h1 className="text-3xl font-bold">Workspace Emails</h1>
          {workspace.description && (
            <p className="text-muted-foreground mt-1">
              {workspace.description}
            </p>
          )}
        </div>
        <Link href={`/templates/new?workspace=${workspace.id}`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Email
          </Button>
        </Link>
      </div>

      {/* Email List */}
      <WorkspaceEmailList workspaceId={workspace.id} />
    </div>
  );
}

export default function WorkspaceEmailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Loading workspace emails...</div>}>
        <WorkspaceEmailsContent id={params.id} />
      </Suspense>
    </div>
  );
}
