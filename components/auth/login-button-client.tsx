"use client";

import { authClient } from "@/lib/authClient";
import { ReactNode, useEffect, useState } from "react";

interface LoginButtonClientProps {
  children: ReactNode;
}

export function LoginButtonClient({ children }: LoginButtonClientProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleLogin = () => {
    return authClient.signIn.social({ provider: "google" });
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return <div style={{ display: "inline-block" }}>{children}</div>;
  }

  return <div onClick={handleLogin}>{children}</div>;
}
