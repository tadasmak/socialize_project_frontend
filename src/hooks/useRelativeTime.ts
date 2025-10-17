import { useState, useEffect } from "react";

export function useRelativeTime(dateString: string) {
    const [timeString, setTimeString] = useState(formatTime(dateString));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeString(formatTime(dateString));
        }, 60000);

        return () => clearInterval(interval);
    }, [dateString]);

    return timeString;
}

function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
