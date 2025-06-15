import { Button } from "@/components/ui/button";
import { LoginButtonClient } from "./login-button-client";
import { Suspense } from "react";

export function LoginButton() {
  return (
    <Suspense fallback={<Button size="lg" className="text-lg">Sign In</Button>}>
      <LoginButtonClient>
        <Button size="lg" className="text-lg">
          Sign In
        </Button>
      </LoginButtonClient>
    </Suspense>
  );
}
