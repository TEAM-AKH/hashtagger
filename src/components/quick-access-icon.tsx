import { cn } from "@/lib/utils";

export function QuickAccessIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34-1.41-1.41" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 16a4 4 0 0 0 4-4" />
      <path d="M8 12a4 4 0 0 0 4 4" />
    </svg>
  );
}
