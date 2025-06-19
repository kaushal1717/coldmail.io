import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { fetchUserDetails } from "@/actions/actions";
import Pricing from "./_components/pricing";

export default async function Page() {
  const session = await auth.api.getSession({ headers: headers() });
  const user = await fetchUserDetails();
  const userId = session?.user?.id;
  const subscriptionInfo = user?.subscription;

  return (
    <div>
      <Pricing initialSubscriptionInfo={subscriptionInfo} userId={userId} />
    </div>
  );
}
