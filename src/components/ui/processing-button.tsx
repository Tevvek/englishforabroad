import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ProcessingButtonProps extends React.ComponentProps<typeof Button> {
  isProcessing?: boolean
  processingLabel?: string
}

export function ProcessingButton({
  isProcessing = false,
  processingLabel = "Processing",
  children,
  disabled,
  ...props
}: ProcessingButtonProps) {
  return (
    <Button disabled={disabled || isProcessing} {...props}>
      {isProcessing ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span className="sr-only">{processingLabel}</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
