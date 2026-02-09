import * as React from "react"

import { signOut } from "@/lib/auth-client"
import { ProcessingButton } from "@/components/ui/processing-button"

export function DashboardLogoutButton() {
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const handleSignOut = React.useCallback(async () => {
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)

    try {
      await signOut()
      window.location.assign("/auth/login")
    } catch (error) {
      console.error(error)
      setIsSigningOut(false)
    }
  }, [isSigningOut])

  return (
    <ProcessingButton
      type="button"
      variant="default"
      className="w-full"
      onClick={handleSignOut}
      isProcessing={isSigningOut}
      processingLabel="Logging out"
    >
      Log out
    </ProcessingButton>
  )
}
