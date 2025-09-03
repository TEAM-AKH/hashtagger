
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            className={cn("h-10 w-10", className)}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g className="text-primary">
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="transparent"
                />
                 <g transform="translate(18, 65) scale(0.2)">
                    <path
                        d="M64,32A32,32,0,1,0,32,64"
                        stroke="currentColor"
                        strokeWidth="20"
                        fill="none"
                    />
                    <path
                        d="M64,32,c0,17.67-14.33,32-32,32S0,49.67,0,32,14.33,0,32,0"
                        stroke="currentColor"
                        strokeWidth="20"
                        fill="none"
                    />
                    <circle cx="32" cy="32" r="12" fill="currentColor" />
                </g>
            </g>
        </svg>
    );
}
