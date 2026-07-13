import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormChapterProps {
  numeral: string;
  title: string;
  action?: ReactNode;
  complete?: boolean;
  isLast?: boolean;
  children: ReactNode;
}

/**
 * One "chapter" of the Kundli intake — a numbered waypoint with a
 * connecting thread down to the next, instead of an anonymous fieldset.
 * The numeral fills to a checkmark once its fields look complete, giving
 * the form a sense of progress without a generic top-of-card percentage bar.
 */
export function FormChapter({ numeral, title, action, complete, isLast, children }: FormChapterProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2 font-dense text-xs font-bold transition-colors duration-300",
            complete ? "border-gold bg-gold/15 text-primary" : "border-border text-muted-foreground/70",
          )}
        >
          {complete ? <Check className="size-3.5" aria-hidden="true" /> : numeral}
        </div>
        {!isLast && (
          <div
            className={cn(
              "mt-1.5 w-px flex-1 rounded-full transition-colors duration-500",
              complete ? "bg-gold/50" : "bg-border",
            )}
          />
        )}
      </div>

      <div className={cn("min-w-0 flex-1", !isLast && "pb-7")}>
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-sans text-sm font-bold tracking-wide">{title}</h4>
          {action}
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
