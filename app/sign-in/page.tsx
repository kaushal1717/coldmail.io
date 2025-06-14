"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/authClient";
export default function SignIn() {
  useEffect(() => {
    authClient.signIn.social({
      provider: "google",
    });
  }, []);
  return <div>Redirecting to sign in...</div>;
}
