
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            className={cn("h-10 w-10", className)}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <circle cx="50" cy="50" r="48" fill="#A875FF" />
                <circle cx="50" cy="50" r="45" stroke="#E6C753" strokeWidth="3" fill="none" />
                <g transform="translate(15, 15) scale(0.7)">
                    <path d="M15 40 L85 40 M15 60 L85 60 M40 15 L40 85 M60 15 L60 85" stroke="white" strokeWidth="8" strokeLinecap="round" />
                </g>
                <text x="22" y="78" fontFamily="Arial, sans-serif" fontSize="20" fill="#E6C753" fontWeight="bold">@</text>
            </g>
        </svg>
    );
}
