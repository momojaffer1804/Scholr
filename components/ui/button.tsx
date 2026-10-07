import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 disabled:pointer-events-none disabled:opacity-50 border border-zinc-900 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
        outline: "bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        secondary: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
