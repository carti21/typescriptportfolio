import type { VariantProps } from "cva"
import type { HTMLAttributes } from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva } from "cva"
import { forwardRef } from "react"

import { cn } from "@/utils/ui"

const paperVariants = cva("relative z-40 border border-accent-6/50 bg-accent-3/25", {
  variants: {
    shape: {
      rounded: "rounded-md",
      square: "",
    },
  },
  defaultVariants: {
    shape: "rounded",
  },
})

export type PaperProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof paperVariants> & {
    asChild?: boolean
  }

export const Paper = forwardRef<HTMLDivElement, PaperProps>(({ asChild, shape, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return <Comp ref={ref} className={cn(paperVariants({ shape, className }))} {...props} />
})
