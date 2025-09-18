
'use client';

export const ExpressIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="url(#grad)"
            stroke="hsl(var(--card))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
        >
            <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--express-grad-start)" />
                    <stop offset="100%" stopColor="var(--express-grad-end)" />
                </linearGradient>
            </defs>

            {/* Speech bubble */}
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />

            {/* Envelope */}
            <rect
                x="7"
                y="7"
                width="10"
                height="6"
                rx="1"
                ry="1"
                fill="hsl(var(--card))"
                stroke="none"
            />
            <path d="M7 7l5 4 5-4" stroke="hsl(var(--primary))" />
        </svg>
    );
};
