import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border/70 flex h-10 w-full min-w-0 rounded-lg border bg-muted/40 px-3.5 py-1 text-sm shadow-sm outline-none transition-all",
        "placeholder:text-muted-foreground/70",
        "hover:border-gold/40",
        "focus-visible:border-gold focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-gold/25 focus-visible:shadow-[0_0_16px_-4px_var(--color-gold)]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
