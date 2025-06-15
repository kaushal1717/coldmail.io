import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  try {
    // Get session server-side using the auth library
    const session = await auth.api.getSession({ headers: await headers() });
    return session || null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}
