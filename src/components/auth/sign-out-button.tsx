import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { Loader2 } from "lucide-react";
import React from "react";

export default function SignOutButton() {
  const [isClicked, setIsClicked] = React.useState(false);
  return (
    <Button
      onClick={async () => {
        setIsClicked(true);

        await signOut();

        await navigate("/auth/login");
      }}
      disabled={isClicked}
    >
      {!isClicked && "Sign out"}

      {isClicked && <Loader2 className="h-4 w-4 animate-spin" />}
    </Button>
  );
}
