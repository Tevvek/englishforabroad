import { useEffect } from "react"
import { toast } from "sonner"

import type { FlashToast } from "@/lib/flash-toast"

interface FlashToastListenerProps {
  flashToast: FlashToast | null
}

export function FlashToastListener({ flashToast }: FlashToastListenerProps) {
  useEffect(() => {
    if (!flashToast) {
      return
    }

    const storageKey = `flash-toast:${flashToast.id}`

    if (sessionStorage.getItem(storageKey)) {
      return
    }

    sessionStorage.setItem(storageKey, "1")

    switch (flashToast.type) {
      case "success":
        toast.success(flashToast.title, { description: flashToast.description })
        break
      case "error":
        toast.error(flashToast.title, { description: flashToast.description })
        break
      case "warning":
        toast.warning(flashToast.title, { description: flashToast.description })
        break
      default:
        toast.message(flashToast.title, { description: flashToast.description })
        break
    }
  }, [flashToast])

  return null
}
