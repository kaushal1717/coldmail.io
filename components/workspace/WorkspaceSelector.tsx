"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
}

interface WorkspaceSelectorProps {
  value?: string;
  onValueChange: (value?: string) => void;
  defaultWorkspaceId?: string;
}

export function WorkspaceSelector({
  value,
  onValueChange,
  defaultWorkspaceId,
}: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (defaultWorkspaceId && workspaces.length > 0) {
      const workspaceExists = workspaces.find(
        (w) => w.id === defaultWorkspaceId
      );
      if (workspaceExists) {
        onValueChange(defaultWorkspaceId);
      }
    }
  }, [defaultWorkspaceId, workspaces]);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch("/api/workspaces");
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "personal") {
      onValueChange(undefined);
    } else {
      onValueChange(selectedValue);
    }
  };

  const currentValue = value ? value : "personal";

  return (
    <div className="space-y-2">
      <Label htmlFor="workspace">Workspace</Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue
            placeholder={isLoading ? "Loading..." : "Select workspace"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">
            <div className="flex flex-col items-start">
              <span className="font-medium">Personal</span>
              <span className="text-xs text-muted-foreground">
                Only visible to you
              </span>
            </div>
          </SelectItem>
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{workspace.name}</span>
                {workspace.description && (
                  <span className="text-xs text-muted-foreground">
                    {workspace.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
