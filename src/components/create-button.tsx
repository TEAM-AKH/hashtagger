
'use client';

import { cn } from "@/lib/utils";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Plus, Share2, Calendar } from "lucide-react";

interface CreateButtonProps {
  onCircleCreate: () => void;
  onEventCreate: () => void;
  className?: string;
}

export const CreateButton = React.forwardRef<HTMLButtonElement, CreateButtonProps>(
  ({ onCircleCreate, onEventCreate, className, ...props }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
            <div className="flex flex-col gap-1">
                <Button variant="ghost" onClick={onCircleCreate} className="justify-start">
                    <Share2 className="mr-2 h-4 w-4"/>
                    Create Circle
                </Button>
                <Button variant="ghost" onClick={onEventCreate} className="justify-start">
                    <Calendar className="mr-2 h-4 w-4"/>
                    Create Event
                </Button>
            </div>
        </PopoverContent>
      </Popover>
    );
  }
);

CreateButton.displayName = 'CreateButton';

    