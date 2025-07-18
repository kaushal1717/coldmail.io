import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json(); // "accept" or "reject"
    const invitationId = params.id;

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be either 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    // Find the invitation
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
        inviter: {
          select: { id: true, name: true },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if the current user is the invitee
    if (invitation.inviteeId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to respond to this invitation" },
        { status: 403 }
      );
    }

    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: "This invitation has already been responded to" },
        { status: 400 }
      );
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 400 }
      );
    }

    // Update invitation status
    const updatedInvitation = await prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data: {
        status: action === "accept" ? "accepted" : "rejected",
      },
    });

    // If accepted, add user to workspace
    if (action === "accept") {
      await prisma.workspaceMember.create({
        data: {
          userId: session.user.id,
          workspaceId: invitation.workspaceId,
          role: invitation.role,
        },
      });

      // Create notification for the inviter
      await prisma.notification.create({
        data: {
          type: "workspace_invitation",
          title: "Invitation Accepted",
          message: `${session.user.name} accepted your invitation to join "${invitation.workspace.name}"`,
          senderId: session.user.id,
          receiverId: invitation.inviterId,
          workspaceId: invitation.workspaceId,
          data: {
            action: "accepted",
            workspaceName: invitation.workspace.name,
          },
        },
      });
    } else {
      // Create notification for the inviter (rejection)
      await prisma.notification.create({
        data: {
          type: "workspace_invitation",
          title: "Invitation Declined",
          message: `${session.user.name} declined your invitation to join "${invitation.workspace.name}"`,
          senderId: session.user.id,
          receiverId: invitation.inviterId,
          workspaceId: invitation.workspaceId,
          data: {
            action: "rejected",
            workspaceName: invitation.workspace.name,
          },
        },
      });
    }

    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error("Error responding to workspace invitation:", error);
    return NextResponse.json(
      { error: "Failed to respond to workspace invitation" },
      { status: 500 }
    );
  }
}
