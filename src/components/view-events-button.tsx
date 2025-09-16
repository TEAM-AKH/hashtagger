
'use client';

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React from "react";

interface ViewEventsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ViewEventsButton = React.forwardRef<HTMLButtonElement, ViewEventsButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold shadow-lg',
          className
        )}
        {...props}
      >
        {/* Default State (● View Events) */}
        <div className="flex items-center gap-2">
          <div
            className="size-2 scale-100 rounded-lg bg-primary transition-all duration-300 group-hover:scale-[100.8]"
          ></div>
          <span
            className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
          >
            View Events
          </span>
        </div>

        {/* Hover State (→ View Events) */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          <ArrowRight className="h-5 w-5" />
          <span className="whitespace-nowrap">View Events</span>
        </div>
      </button>
    );
  }
);

ViewEventsButton.displayName = 'ViewEventsButton';
