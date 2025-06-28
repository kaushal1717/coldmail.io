import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { emailId, workspaceId, reviewerId, message } = await request.json();

  if (!emailId || !workspaceId || !reviewerId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const reviewRequest = await prisma.reviewRequest.create({
      data: {
        emailId,
        requesterId: session.user.id,
        reviewerId,
        message,
      },
      include: {
        email: {
          select: { id: true, subject: true },
        },
        reviewer: {
          select: { id: true, name: true },
        },
      },
    });

    // Create notification for the reviewer
    await prisma.notification.create({
      data: {
        type: "review_request",
        title: "Review Request",
        message: `${session.user.name} requested your review for "${
          reviewRequest.email.subject
        }"${message ? `: ${message}` : ""}`,
        senderId: session.user.id,
        receiverId: reviewerId,
        reviewRequestId: reviewRequest.id,
        emailId,
        workspaceId,
        data: {
          emailSubject: reviewRequest.email.subject,
          message,
        },
      },
    });

    return NextResponse.json(reviewRequest);
  } catch (error) {
    console.error("Failed to create review request:", error);
    return NextResponse.json(
      { error: "Failed to create review request" },
      { status: 500 }
    );
  }
}
