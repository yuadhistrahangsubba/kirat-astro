"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { type ComponentProps, type MouseEvent, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const MotionSlot = motion.create(Slot);

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_0_0_0_var(--color-gold)] hover:shadow-[0_0_28px_-4px_var(--color-gold)]",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-accent/10 hover:border-accent/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface Ripple {
  id: number;
  x: number;
  y: number;
}

// Motion redefines onAnimationStart/onAnimationEnd/onDrag* to take its own
// animation-definition types instead of native DOM events, so those keys
// must be dropped from the native HTML props before intersecting.
type NativeButtonProps = Omit<
  ComponentProps<"button">,
  "onAnimationStart" | "onAnimationEnd" | "onDragStart" | "onDragEnd" | "onDrag"
>;

type ButtonProps = NativeButtonProps &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, onClick, children, ...props }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const sharedProps = {
    "data-slot": "button",
    className: cn(buttonVariants({ variant, size, className })),
    whileHover: { y: -2, scale: 1.015 },
    whileTap: { scale: 0.96, y: 0 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  // Radix Slot requires exactly one child element, so the asChild path
  // must not render the ripple layer as a sibling — it renders the
  // caller's element untouched (lift/glow still apply to it via style).
  if (asChild) {
    return (
      <MotionSlot {...sharedProps} onClick={onClick} {...props}>
        {children}
      </MotionSlot>
    );
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const id = rippleId.current++;
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - bounds.left, y: event.clientY - bounds.top },
    ]);
    onClick?.(event);
  }

  return (
    <motion.button {...sharedProps} onClick={handleClick} {...props}>
      {children}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-white/40"
            style={{ left: r.x, top: r.y, width: 8, height: 8, x: "-50%", y: "-50%" }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 22, opacity: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            onAnimationComplete={() =>
              setRipples((prev) => prev.filter((ripple) => ripple.id !== r.id))
            }
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

export { Button, buttonVariants };
