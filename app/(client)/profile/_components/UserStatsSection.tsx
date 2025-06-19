export default function UserStatsSection({
  user,
}: {
  user: { savedEmails?: number; subscription?: string; totalEmails?: number };
}) {
  const checkStatus = () => {
    if (user?.subscription === "free") return 8;
    if (user?.subscription === "pro") return 20;
    return 0;
  };

  return (
    <>
      <div className="grid gap-2">
        <div className="flex flex-col items-start gap-1">
          <div className="text-sm font-medium text-muted-foreground">
            Saved Templates
          </div>
          <div className="text-2xl font-bold">
            {typeof user?.savedEmails === "number" ? user.savedEmails : 0}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Subscription Plan
        </div>
        <div className="text-2xl font-bold">
          {user?.subscription
            ? user.subscription.charAt(0).toUpperCase() +
              user.subscription.slice(1)
            : "Free"}
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Current Plan Capacity
        </div>
        <div className="text-2xl font-bold">
          {checkStatus() === 0 ? (
            "Unlimited"
          ) : (
            <p>
              {typeof user?.totalEmails === "number" ? user.totalEmails : 0} /{" "}
              {checkStatus()}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
