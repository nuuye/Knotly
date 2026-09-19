import type { LucideIcon } from "lucide-react";

export type SettingsSectionId = "account" | "notifications" | "privacy" | "appearance" | "language";
export type ThemeId = "warm" | "dark" | "system";

export interface SettingsSection {
    id: SettingsSectionId;
    label: string;
    description: string;
    icon: LucideIcon;
}

export interface SettingsSectionCopy {
    eyebrow: string;
    title: string;
    description: string;
}

export interface NotificationSettings {
    directMessages: boolean;
    mentions: boolean;
    communityActivity: boolean;
    sounds: boolean;
}

export interface PrivacySettings {
    friendRequests: boolean;
    activityStatus: boolean;
}

export interface ToggleSettingProps {
    checked: boolean;
    description: string;
    icon: LucideIcon;
    label: string;
    onChange: (checked: boolean) => void;
}
