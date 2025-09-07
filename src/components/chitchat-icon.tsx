
import { cn } from "@/lib/utils";

export function ChitChatIcon({ className }: { className?: string }) {
    return (
        <svg
            className={cn("h-6 w-6", className)}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.4V6.2C4 5.09543 4.89543 4.2 6 4.2H14.4C15.5046 4.2 16.4 5.09543 16.4 6.2V11.6C16.4 12.7046 15.5046 13.6 14.4 13.6H9.2L4 18.4V14.4Z" />
            <path d="M8.2002 18.6V16.8C8.2002 15.6954 9.09563 14.8 10.2002 14.8H17.0002L21.2002 19.6V11C21.2002 9.89543 20.3048 9 19.2002 9H18.0002" />
        </svg>
    );
}
