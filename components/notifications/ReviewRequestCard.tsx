"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, MessageSquare, Clock, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

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

interface ReviewRequestCardProps {
  reviewRequest: ReviewRequest;
  onUpdate: () => void;
}

export function ReviewRequestCard({
  reviewRequest,
  onUpdate,
}: ReviewRequestCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReview = async (status: "approved" | "rejected") => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/review-requests/${reviewRequest.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          response: response.trim() || undefined,
        }),
      });

      if (res.ok) {
        toast({
          title: `Review ${status}`,
          description: `You have ${status} this review request.`,
        });
        onUpdate();
        setIsResponding(false);
        setResponse("");
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to submit review",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (reviewRequest.status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Needs Revision</Badge>;
      default:
        return <Badge variant="outline">{reviewRequest.status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={reviewRequest.requester.image} />
              <AvatarFallback>
                {reviewRequest.requester.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {reviewRequest.email.subject}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review requested by {reviewRequest.requester.name}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Request Message */}
        {reviewRequest.message && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Request Message</span>
            </div>
            <p className="text-sm">{reviewRequest.message}</p>
          </div>
        )}

        {/* Email Content Preview */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Email Content</span>
          </div>
          <p className="text-sm line-clamp-3">{reviewRequest.email.content}</p>
        </div>

        {/* Timestamps */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              Requested{" "}
              {formatDistanceToNow(new Date(reviewRequest.requestedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {reviewRequest.reviewedAt && (
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>
                Reviewed{" "}
                {formatDistanceToNow(new Date(reviewRequest.reviewedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Review Response (if completed) */}
        {reviewRequest.response && reviewRequest.status !== "pending" && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Review Response</span>
            </div>
            <p className="text-sm">{reviewRequest.response}</p>
          </div>
        )}

        {/* Action Buttons for Pending Reviews */}
        {reviewRequest.status === "pending" && (
          <div className="space-y-3">
            {!isResponding ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsResponding(true)}
                  size="sm"
                  variant="outline"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Response
                </Button>
                <Button
                  onClick={() => handleReview("approved")}
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReview("rejected")}
                  disabled={isSubmitting}
                  size="sm"
                  variant="destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Request Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="response">Response (optional)</Label>
                  <Textarea
                    id="response"
                    placeholder="Add feedback or comments..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReview("approved")}
                    disabled={isSubmitting}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReview("rejected")}
                    disabled={isSubmitting}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsResponding(false);
                      setResponse("");
                    }}
                    disabled={isSubmitting}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
