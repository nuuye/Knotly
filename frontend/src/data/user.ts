import type { UserAccount, UserProfile } from "../types/user";

export const DEMO_USER: UserAccount = {
    username: "johndoe",
    email: "johndoe@example.com",
};

export const DEMO_USER_PROFILE: UserProfile = {
    ...DEMO_USER,
    avatarUrl: null,
    bio: "Always up for a late-night voice chat.",
};
