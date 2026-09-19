export const USERNAME_PATTERN_SOURCE = "[A-Za-z0-9._-]+";
export const USERNAME_RULE_MESSAGE = "Use only letters, numbers, hyphens, underscores, or periods.";

/** Checks the full username so spaces and unsupported symbols are rejected. */
export function isValidUsername(username: string) {
    return /^[A-Za-z0-9._-]+$/.test(username);
}
