import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = params.id;

    // Check if user is a member of this workspace
    const memberCheck = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!memberCheck) {
      return NextResponse.json(
        { error: "You don't have access to this workspace" },
        { status: 403 }
      );
    }

    // Get review requests for workspace emails where current user is the reviewer
    const reviewRequests = await prisma.reviewRequest.findMany({
      where: {
        reviewerId: session.user.id,
        email: {
          workspaceId: workspaceId,
        },
      },
      include: {
        email: {
          select: {
            id: true,
            subject: true,
            content: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // pending first
        { requestedAt: "desc" },
      ],
    });

    return NextResponse.json(reviewRequests);
  } catch (error) {
    console.error("Error fetching workspace review requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch review requests" },
      { status: 500 }
    );
  }
}
