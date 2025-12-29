import { Button } from "@/components/ui/button";
import KakaoTalkLogo from "@/assets/kakaotalk.svg";

export default function KakaoTalkButton() {
  return (
    <Button variant="outline" type="button" className="w-full">
      <img src={KakaoTalkLogo.src} alt="KakaoTalk" className="h-full" />
      Login with KakaoTalk
    </Button>
  );
}
