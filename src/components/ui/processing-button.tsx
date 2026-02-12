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
  className,
  ...props
}: ProcessingButtonProps) {
  return (
    <Button
      disabled={disabled || isProcessing}
      className={className}
      {...props}
    >
      <span className="relative inline-flex w-full items-center justify-center">
        <span className={isProcessing ? "opacity-0" : "opacity-100"}>{children}</span>

        {isProcessing && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
            <span className="sr-only">{processingLabel}</span>
          </span>
        )}
      </span>
    </Button>
  )
}
