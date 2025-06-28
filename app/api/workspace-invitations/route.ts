import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, workspaceId, role, message } = await request.json();

    if (!email || !workspaceId) {
      return NextResponse.json(
        { error: "Email and workspaceId are required" },
        { status: 400 }
      );
    }

    // Check if user has permission to invite to this workspace
    const memberCheck = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
      include: {
        workspace: {
          select: { name: true, ownerId: true },
        },
      },
    });

    if (
      !memberCheck ||
      (memberCheck.role !== "admin" && memberCheck.role !== "owner")
    ) {
      return NextResponse.json(
        {
          error:
            "You don't have permission to invite members to this workspace",
        },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    // Check if user is already a member
    if (existingUser) {
      const existingMembership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: existingUser.id,
            workspaceId,
          },
        },
      });

      if (existingMembership) {
        return NextResponse.json(
          { error: "User is already a member of this workspace" },
          { status: 400 }
        );
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.workspaceInvitation.findUnique({
      where: {
        email_workspaceId: {
          email,
          workspaceId,
        },
      },
    });

    if (existingInvitation && existingInvitation.status === "pending") {
      return NextResponse.json(
        { error: "An invitation is already pending for this email" },
        { status: 400 }
      );
    }

    // Create or update invitation
    const invitation = await prisma.workspaceInvitation.upsert({
      where: {
        email_workspaceId: {
          email,
          workspaceId,
        },
      },
      update: {
        status: "pending",
        role: role || "member",
        message,
        inviterId: session.user.id,
        inviteeId: existingUser?.id || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      create: {
        email,
        workspaceId,
        role: role || "member",
        message,
        inviterId: session.user.id,
        inviteeId: existingUser?.id || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Create notification if user exists
    if (existingUser) {
      await prisma.notification.create({
        data: {
          type: "workspace_invitation",
          title: "Workspace Invitation",
          message: `You've been invited to join "${
            memberCheck.workspace.name
          }"${message ? `: ${message}` : ""}`,
          senderId: session.user.id,
          receiverId: existingUser.id,
          workspaceInvitationId: invitation.id,
          workspaceId,
          data: {
            workspaceName: memberCheck.workspace.name,
            role: invitation.role,
            message,
          },
        },
      });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Error creating workspace invitation:", error);
    return NextResponse.json(
      { error: "Failed to create workspace invitation" },
      { status: 500 }
    );
  }
}
