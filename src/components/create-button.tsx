
'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface CreateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const CreateButton = React.forwardRef<HTMLButtonElement, CreateButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold shadow-lg',
          className,
        )}
        {...props}
      >
        {/* Default State (Dot + Create) */}
        <div className="flex items-center gap-2 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-4">
          <div className="size-2 rounded-full bg-primary"></div>
          <span className="whitespace-nowrap">Create</span>
        </div>

        {/* Hover State (+ Create) */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="whitespace-nowrap text-lg font-bold">+ Create</span>
        </div>
      </button>
    );
  }
);

CreateButton.displayName = 'CreateButton';

    