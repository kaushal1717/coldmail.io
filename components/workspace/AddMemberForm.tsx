"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";

const addMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["member", "admin"]).default("member"),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface AddMemberFormProps {
  workspaceId: string;
}

export function AddMemberForm({ workspaceId }: AddMemberFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      role: "member",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: AddMemberFormData) => {
    setIsAdding(true);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add member");
      }

      toast({
        title: "Member added!",
        description: `${result.user.name} has been added to the workspace.`,
      });

      reset();
      router.refresh();
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="colleague@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={selectedRole}
          onValueChange={(value) =>
            setValue("role", value as "member" | "admin")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isAdding} className="w-full">
        {isAdding ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </>
        )}
      </Button>
    </form>
  );
}
