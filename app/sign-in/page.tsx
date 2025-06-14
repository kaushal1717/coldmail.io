"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
export default function SignIn() {
  useEffect(() => {
    signIn("google");
  }, []);
  return <div>Redirecting to sign in...</div>;
}
