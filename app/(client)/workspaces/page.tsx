import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { getServerSession } from "@/lib/get-server-session";
import { prisma } from "@/lib/db";

async function getWorkspaces() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return [];
    }

    // Get workspaces where user is a member
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
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
        },
        _count: {
          select: {
            emails: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return workspaces;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
}

function WorkspacesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

async function WorkspacesList() {
  const session = await getServerSession();
  const workspaces = await getWorkspaces();

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No workspaces yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first workspace to start collaborating with your team.
        </p>
        <Link href="/workspaces/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workspace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          currentUserId={session?.user?.id}
        />
      ))}
    </div>
  );
}

export default function WorkspacesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="text-muted-foreground">
            Collaborate with your team on email templates
          </p>
        </div>
        <Link href="/workspaces/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Workspace
          </Button>
        </Link>
      </div>

      <Suspense fallback={<WorkspacesSkeleton />}>
        <WorkspacesList />
      </Suspense>
    </div>
  );
}
