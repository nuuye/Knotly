/** Returns up to two initials from a display name. */
export function getInitials(name: string, fallback = "KN") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || fallback;
}

/** Creates a short avatar mark without needing a real name. */
export function getUsernameMark(username: string) {
    return username.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase() || "U";
}

/** Converts user text into a lowercase URL-safe slug. */
export function toSlug(value: string) {
    return value
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
