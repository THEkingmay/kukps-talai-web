import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Toast as ToastPrimitive } from "radix-ui"

import { Button } from "~/components/ui/button"
import { XIcon } from "lucide-react"

const toastVariants = cva(
  "group/toast pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-2 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-right-full data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform",
  {
    variants: {
      variant: {
        default: "border-border bg-popover text-popover-foreground",
        info: "border-sky-200/80 bg-sky-50/95 text-sky-900 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200",
        warning:
          "border-amber-200/80 bg-amber-50/95 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
        success:
          "border-emerald-200/80 bg-emerald-50/95 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
        destructive:
          "border-rose-200/80 bg-rose-50/95 text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Toast({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root> &
  VariantProps<typeof toastVariants>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={variant}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
}

function ToastProvider({
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm leading-snug font-semibold", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-xs leading-relaxed opacity-80", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      asChild
      className={cn("absolute top-2 right-2", className)}
      {...props}
    >
      <Button variant="ghost" size="icon-xs" aria-label="ปิดการแจ้งเตือน">
        <XIcon />
      </Button>
    </ToastPrimitive.Close>
  )
}

export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastVariants,
}