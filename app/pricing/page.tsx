import Header from "@/components/common/header";
import Pricing from "@/app/pricing/_components/pricing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { fetchUserDetails } from "@/actions/actions";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = await fetchUserDetails();
  const userId = session?.user?.id;
  const subscriptionInfo = user?.subscription;

  return (
    <div>
      <Header />
      <Pricing subscriptionInfo={subscriptionInfo} userId={userId} />
    </div>
  );
}
