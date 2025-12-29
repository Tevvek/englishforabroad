import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import NaverLogo from "@/assets/naver.svg";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function NaverButton() {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () => {
        setIsClicked(true);
        await signIn();
      }}
      className="w-full"
      disabled={isClicked}
    >
      {isClicked && <Loader2 className="h-4 w-4 animate-spin" />}

      {!isClicked && (
        <>
          <img src={NaverLogo.src} alt="Naver" className="h-full" />
          Login with Naver
        </>
      )}
    </Button>
  );
}
