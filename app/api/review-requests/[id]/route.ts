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

    const { status, response } = await request.json();
    const reviewRequestId = params.id;

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be either 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Find the review request and verify the user is the assigned reviewer
    const reviewRequest = await prisma.reviewRequest.findUnique({
      where: { id: reviewRequestId },
      include: {
        requester: {
          select: { id: true, name: true, email: true },
        },
        email: {
          select: { id: true, subject: true },
        },
      },
    });

    if (!reviewRequest) {
      return NextResponse.json(
        { error: "Review request not found" },
        { status: 404 }
      );
    }

    if (reviewRequest.reviewerId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to review this request" },
        { status: 403 }
      );
    }

    if (reviewRequest.status !== "pending") {
      return NextResponse.json(
        { error: "This review request has already been completed" },
        { status: 400 }
      );
    }

    // Update the review request
    const updatedReviewRequest = await prisma.reviewRequest.update({
      where: { id: reviewRequestId },
      data: {
        status,
        response,
        reviewedAt: new Date(),
      },
    });

    // Create notification for the requester
    await prisma.notification.create({
      data: {
        type: "review_response",
        title: `Review ${status}`,
        message: `Your email "${
          reviewRequest.email.subject
        }" has been ${status}${response ? `: ${response}` : ""}`,
        senderId: session.user.id,
        receiverId: reviewRequest.requesterId,
        reviewRequestId: reviewRequestId,
        emailId: reviewRequest.emailId,
        data: {
          status,
          response,
          emailSubject: reviewRequest.email.subject,
        },
      },
    });

    return NextResponse.json(updatedReviewRequest);
  } catch (error) {
    console.error("Error updating review request:", error);
    return NextResponse.json(
      { error: "Failed to update review request" },
      { status: 500 }
    );
  }
}
