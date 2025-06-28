import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role = "member" } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user has permission to add members
    const memberPermission = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: params.id,
        },
      },
    });

    if (
      !memberPermission ||
      !["owner", "admin"].includes(memberPermission.role)
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Find user by email
    const userToAdd = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!userToAdd) {
      return NextResponse.json(
        { error: "User not found with this email" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userToAdd.id,
          workspaceId: params.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this workspace" },
        { status: 400 }
      );
    }

    // Add user to workspace
    const newMember = await prisma.workspaceMember.create({
      data: {
        userId: userToAdd.id,
        workspaceId: params.id,
        role: role,
      },
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
    });

    return NextResponse.json(newMember);
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIdToRemove = searchParams.get("userId");

    if (!userIdToRemove) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user has permission to remove members
    const memberPermission = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: params.id,
        },
      },
    });

    if (
      !memberPermission ||
      !["owner", "admin"].includes(memberPermission.role)
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Don't allow removing the owner
    const memberToRemove = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userIdToRemove,
          workspaceId: params.id,
        },
      },
    });

    if (memberToRemove?.role === "owner") {
      return NextResponse.json(
        { error: "Cannot remove workspace owner" },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId: userIdToRemove,
          workspaceId: params.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
