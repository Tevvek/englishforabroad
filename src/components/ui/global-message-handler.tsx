import { useEffect } from "react";
import { toast } from "sonner";

export function GlobalMessageHandler() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    const type = urlParams.get("type") || "success";

    if (message) {
      const decodedMessage = decodeURIComponent(message);
      
      if (type === "success") {
        toast.success(decodedMessage);
      } else if (type === "error") {
        toast.error(decodedMessage);
      } else if (type === "info") {
        toast.info(decodedMessage);
      } else {
        toast(decodedMessage);
      }

      // Remove the query parameters from URL without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("message");
      newUrl.searchParams.delete("type");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, []);

  return null;
}