import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserInfoSection({
  user,
}: {
  user: { name?: string; email?: string; image?: string };
}) {
  if (!user?.name && !user?.email && !user?.image) return null;
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user?.image || undefined} />
        <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <div className="text-xl font-semibold">
          {user?.name || "Unknown User"}
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.email || "No email provided"}
        </div>
      </div>
    </div>
  );
}
