import type { PermissionDefinition } from "../types/home";

export const COMMUNITY_PERMISSIONS: PermissionDefinition[] = [
    { id: "manageCommunity", label: "Manage community", description: "Change the community name, visibility, and invitations." },
    { id: "manageRooms", label: "Manage rooms", description: "Create, rename, move, and organize rooms." },
    { id: "manageRoles", label: "Manage roles", description: "Create roles and change their permissions." },
    { id: "inviteMembers", label: "Invite members", description: "Create and share invitations." },
    { id: "moderateMembers", label: "Moderate members", description: "Assign roles and remove members." },
    { id: "viewModerationLog", label: "View moderation log", description: "Review administrative and moderation actions." },
    { id: "sendMessages", label: "Send messages", description: "Write in text rooms." },
    { id: "joinVoice", label: "Join voice rooms", description: "Enter and speak in voice rooms." },
];
