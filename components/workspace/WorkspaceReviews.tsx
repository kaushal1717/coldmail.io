"use client";

import { useState, useEffect } from "react";
import { ReviewRequestCard } from "@/components/notifications/ReviewRequestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, CheckCircle } from "lucide-react";

interface ReviewRequest {
  id: string;
  status: string;
  message?: string;
  response?: string;
  requestedAt: string;
  reviewedAt?: string;
  email: {
    id: string;
    subject: string;
    content: string;
  };
  requester: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface WorkspaceReviewsProps {
  workspaceId: string;
  currentUserId: string;
}

export function WorkspaceReviews({
  workspaceId,
  currentUserId,
}: WorkspaceReviewsProps) {
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviewRequests();
  }, [workspaceId, currentUserId]);

  const fetchReviewRequests = async () => {
    try {
      setIsLoading(true);

      // Fetch review requests for workspace emails where current user is reviewer
      const response = await fetch(
        `/api/workspaces/${workspaceId}/review-requests`
      );
      if (response.ok) {
        const data = await response.json();
        setReviewRequests(data);
      }
    } catch (error) {
      console.error("Error fetching review requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingReviews = reviewRequests.filter((r) => r.status === "pending");
  const completedReviews = reviewRequests.filter((r) => r.status !== "pending");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Review Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews.length}</div>
            {pendingReviews.length > 0 && (
              <Badge variant="secondary" className="mt-1">
                Needs attention
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Pending Reviews ({pendingReviews.length})
          </h3>
          <div className="space-y-4">
            {pendingReviews.map((reviewRequest) => (
              <ReviewRequestCard
                key={reviewRequest.id}
                reviewRequest={reviewRequest}
                onUpdate={fetchReviewRequests}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Completed Reviews */}
      {completedReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Recently Completed ({Math.min(completedReviews.length, 3)})
          </h3>
          <div className="space-y-4">
            {completedReviews.slice(0, 3).map((reviewRequest) => (
              <ReviewRequestCard
                key={reviewRequest.id}
                reviewRequest={reviewRequest}
                onUpdate={fetchReviewRequests}
              />
            ))}
          </div>
          {completedReviews.length > 3 && (
            <p className="text-sm text-muted-foreground text-center">
              And {completedReviews.length - 3} more completed reviews...
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {reviewRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No review requests</h3>
            <p className="text-muted-foreground">
              You don't have any review requests for this workspace yet. When
              team members request your review for their email templates,
              they'll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
