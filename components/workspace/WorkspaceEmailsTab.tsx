"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail } from "lucide-react";
import Link from "next/link";
import { WorkspaceEmailCard } from "./WorkspaceEmailCard";

interface WorkspaceEmailsTabProps {
  workspaceId: string;
  initialEmails: any[];
  currentUserId: string;
  currentUserRole: string;
}

export function WorkspaceEmailsTab({
  workspaceId,
  initialEmails,
  currentUserId,
  currentUserRole,
}: WorkspaceEmailsTabProps) {
  const [emails, setEmails] = useState(initialEmails);

  const refreshEmails = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/emails`);
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
      }
    } catch (error) {
      console.error("Error refreshing emails:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Workspace Emails</h2>
        <Link href={`/workspaces/${workspaceId}/emails`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            View All Emails
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emails.slice(0, 9).map((email: any) => (
          <WorkspaceEmailCard
            key={email.id}
            email={email}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            onEmailDeleted={refreshEmails}
          />
        ))}
      </div>

      {emails.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No emails yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first email template for this workspace.
            </p>
            <Link href={`/templates/new?workspace=${workspaceId}`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Email
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
