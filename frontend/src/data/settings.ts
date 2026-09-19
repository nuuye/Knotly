import { Bell, Globe2, Palette, ShieldCheck, UserRound } from "lucide-react";
import type {
    NotificationSettings,
    PrivacySettings,
    SettingsSection,
    SettingsSectionCopy,
    SettingsSectionId,
} from "../types/settings";

export const SETTINGS_SECTIONS: SettingsSection[] = [
    { id: "account", label: "My account", description: "Profile, identity, and security", icon: UserRound },
    { id: "notifications", label: "Notifications", description: "Choose what gets your attention", icon: Bell },
    { id: "privacy", label: "Privacy & safety", description: "Control how people reach you", icon: ShieldCheck },
    { id: "appearance", label: "Appearance", description: "Make Knotly feel comfortable", icon: Palette },
    { id: "language", label: "Language & region", description: "Language, time, and locale", icon: Globe2 },
];

export const SETTINGS_COPY: Record<SettingsSectionId, SettingsSectionCopy> = {
    account: { eyebrow: "Personal settings", title: "Your account.", description: "Manage the username people see and the email used to access your account." },
    notifications: { eyebrow: "Your attention", title: "Hear about what matters.", description: "Keep important conversations close without letting every room interrupt you." },
    privacy: { eyebrow: "Boundaries", title: "You decide who gets through.", description: "Choose how people can find you, message you, and interact with your profile." },
    appearance: { eyebrow: "Your view", title: "Set the right atmosphere.", description: "Tune Knotly for your screen, your eyes, and the way you like to read." },
    language: { eyebrow: "Local preferences", title: "Right language, right time.", description: "Set the language and regional details Knotly uses around the app." },
};

export const INITIAL_NOTIFICATIONS: NotificationSettings = {
    directMessages: true,
    mentions: true,
    communityActivity: false,
    sounds: true,
};

export const INITIAL_PRIVACY: PrivacySettings = {
    friendRequests: true,
    activityStatus: true,
};
