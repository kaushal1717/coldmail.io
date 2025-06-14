import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserInfoSection() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

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
