import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:translate-y-1 active:translate-x-1 active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-neo-green border-2 border-black text-black shadow-[4px_4px_0px_0px_#000] hover:bg-neo-green/90 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_0px_#000]",
        destructive:
          "bg-destructive border-2 border-black text-white shadow-[4px_4px_0px_0px_#000] hover:bg-destructive/90 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_0px_#000]",
        outline:
          "bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_#000] hover:bg-neo-yellow hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_0px_#000]",
        secondary:
          "bg-neo-cyan border-2 border-black text-black shadow-[4px_4px_0px_0px_#000] hover:bg-neo-cyan/90 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0px_0px_#000]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neo: "bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_#bef264] hover:shadow-[6px_6px_0px_0px_#bef264] hover:-translate-y-0.5 hover:-translate-x-0.5",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }