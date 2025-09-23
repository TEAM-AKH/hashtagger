
import { cn } from "@/lib/utils"

export function ScorpioIcon({ className }: { className?: string }) {
    return (
        <svg
            className={cn("h-7 w-7", className)}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="scorpio-gradient-light" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
                <linearGradient id="scorpio-gradient-dark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
            </defs>
            <style>
                {`
                .scorpio-path-light {
                    stroke: url(#scorpio-gradient-light);
                    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
                }
                .dark .scorpio-path-dark {
                    stroke: url(#scorpio-gradient-dark);
                    filter: drop-shadow(0 1px 2px hsl(var(--primary) / 0.5));
                }
                `}
            </style>
            <g className="scorpio-path-light dark:hidden">
                <path d="M6 10V18C6 19.1046 6.89543 20 8 20H9M12 4V16C12 18.2091 10.2091 20 8 20H9M12 10H15C16.6569 10 18 8.65685 18 7C18 5.34315 16.6569 4 15 4H12M15 15L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
             <g className="scorpio-path-dark hidden dark:block">
                <path d="M6 10V18C6 19.1046 6.89543 20 8 20H9M12 4V16C12 18.2091 10.2091 20 8 20H9M12 10H15C16.6569 10 18 8.65685 18 7C18 5.34315 16.6569 4 15 4H12M15 15L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
        </svg>
    )
}
