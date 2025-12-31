import { Button } from "@/components/ui/button";
import { actions, isActionError } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { CreditCard } from "lucide-react";

export default function PurchasePackageButton({
  id,
}: {
  id: "full-payment" | "installments";
}) {
  async function handleClick() {
    const { data, error } = await actions.purchase({ id });

    if (isActionError(error)) {
      console.log(error);
      return;
    }

    if (!data) {
      return;
    }

    await navigate(data as string);
  }

  return (
    <Button onClick={handleClick} className="w-full" variant="default">
      <CreditCard className="mr-2 h-4 w-4" />
      Purchase Package
    </Button>
  );
}
