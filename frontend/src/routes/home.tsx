import { createFileRoute } from "@tanstack/react-router";
import {
    ArrowLeft,
    Bell,
    BellOff,
    ChevronDown,
    Clipboard,
    FolderPlus,
    Hash,
    Headphones,
    ImagePlus,
    LogOut,
    MailOpen,
    MessageCircleMore,
    MoreHorizontal,
    Paperclip,
    Pencil,
    Phone,
    PhoneOff,
    Plus,
    Search,
    Send,
    Smile,
    Mic,
    MicOff,
    UserPlus,
    UserMinus,
    UsersRound,
    Video,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { AudioWave } from "../components/home/AudioWave";
import { EmojiPicker } from "../components/home/EmojiPicker";
import { GroupAvatar } from "../components/home/GroupAvatar";
import { HomeHeader } from "../components/home/HomeHeader";
import { MessageActions } from "../components/home/MessageActions";
import { MessageSearch } from "../components/home/MessageSearch";
import { CategoryDialog } from "../components/home/dialogs/CategoryDialog";
import { ChannelDialog } from "../components/home/dialogs/ChannelDialog";
import { CommunityDialog } from "../components/home/dialogs/CommunityDialog";
import { AddFriendDialog, RemoveFriendDialog } from "../components/home/dialogs/FriendDialogs";
import { GroupMembersDialog } from "../components/home/dialogs/GroupMembersDialog";
import { InviteMembersDialog } from "../components/home/dialogs/InviteMembersDialog";
import { MemberProfileDialog } from "../components/home/dialogs/MemberProfileDialog";
import { ModerationLogDialog } from "../components/home/dialogs/ModerationLogDialog";
import { NewMessageDialog } from "../components/home/dialogs/NewMessageDialog";
import { RolesPermissionsDialog } from "../components/home/dialogs/RolesPermissionsDialog";
import { RoomSettingsDialog } from "../components/home/dialogs/RoomSettingsDialog";
import {
    EMPTY_COMMUNITY_DRAFT,
    FRIENDS,
    INITIAL_COMMUNITIES,
    INITIAL_CONVERSATIONS,
    INITIAL_MESSAGES,
    INITIAL_MODERATION_LOGS,
    INITIAL_ROOM_MESSAGES,
    SUGGESTED_FRIENDS,
    createCommunityMembers,
    createCommunityRoles,
} from "../data/home";
import { useDismissableLayer } from "../hooks/useDismissableLayer";
import { DEMO_USER } from "../data/user";
import type {
    Community,
    CommunityMember,
    CommunityRole,
    CommunitySettingsDraft,
    Friend,
    FriendFilter,
    JoinedVoiceRoom,
    MessageReaction,
    MessageSearchResult,
    MessageView,
    MobilePanel,
    ModerationLogCategory,
    ModerationLogEntry,
    NewMessageMode,
    RoomKind,
} from "../types/home";
import { getInitials, getUsernameMark, toSlug } from "../utils/text";
import styles from "./home.module.scss";

export const Route = createFileRoute("/home")({
    component: HomePage,
});

/** Toggles the current user's reaction while preserving reactions from others. */
function withToggledReaction<T extends { reactions?: MessageReaction[] }>(message: T, emoji: string): T {
    const existing = message.reactions?.find((reaction) => reaction.emoji === emoji);
    if (!existing) return { ...message, reactions: [...(message.reactions ?? []), { emoji, count: 1, reacted: true }] };

    const nextCount = existing.reacted ? existing.count - 1 : existing.count + 1;
    const reactions = (message.reactions ?? [])
        .map((reaction) => reaction.emoji === emoji ? { ...reaction, count: nextCount, reacted: !reaction.reacted } : reaction)
        .filter((reaction) => reaction.count > 0);
    return { ...message, reactions };
}

/** Creates a short readable code for a frontend-only community invite. */
function createInviteCode(communityId: string) {
    return `${communityId}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Runs the signed-in app demo with messages, communities, rooms, and voice state. */
function HomePage() {
    // Main navigation and community data.
    const [activeSpace, setActiveSpace] = useState("messages");
    const [communities, setCommunities] = useState(INITIAL_COMMUNITIES);
    const [communityDisplayNames, setCommunityDisplayNames] = useState<Record<string, string>>({});
    const [communityRoles, setCommunityRoles] = useState<Record<string, CommunityRole[]>>(() => Object.fromEntries(
        INITIAL_COMMUNITIES.map((community) => [community.id, createCommunityRoles()]),
    ));
    const [communityMembers, setCommunityMembers] = useState<Record<string, CommunityMember[]>>(() => Object.fromEntries(
        INITIAL_COMMUNITIES.map((community) => [community.id, createCommunityMembers(
            community.id === "saturday" ? ["owner"] : community.id === "studio" ? ["moderator", "member"] : ["member"],
        )]),
    ));
    const [friends, setFriends] = useState(FRIENDS);
    const [communityMemberNotes, setCommunityMemberNotes] = useState<Record<string, Record<string, string>>>({});
    const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState("maya");
    const [selectedRoom, setSelectedRoom] = useState("general");
    const [selectedRoomKind, setSelectedRoomKind] = useState<RoomKind>("text");
    // Private messages, friends, and mobile panel state.
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState("");
    const [roomDraft, setRoomDraft] = useState("");
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [roomMessages, setRoomMessages] = useState(INITIAL_ROOM_MESSAGES);
    const [replyingTo, setReplyingTo] = useState<{ scope: "direct" | "room"; messageId: number } | null>(null);
    const [editingMessage, setEditingMessage] = useState<{ scope: "direct" | "room"; messageId: number } | null>(null);
    const [editDraft, setEditDraft] = useState("");
    const [messageSearchOpen, setMessageSearchOpen] = useState(false);
    const [messageSearchQuery, setMessageSearchQuery] = useState("");
    const [highlightedMessage, setHighlightedMessage] = useState<string | null>(null);
    const [mobilePanel, setMobilePanel] = useState<MobilePanel>("list");
    const [messageView, setMessageView] = useState<MessageView>("chat");
    const [friendFilter, setFriendFilter] = useState<FriendFilter>("all");
    // Dialogs and small menus.
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [newMessageOpen, setNewMessageOpen] = useState(false);
    const [newMessageMode, setNewMessageMode] = useState<NewMessageMode>("direct");
    const [newMessageQuery, setNewMessageQuery] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const [createCommunityOpen, setCreateCommunityOpen] = useState(false);
    const [communityDraft, setCommunityDraft] = useState(EMPTY_COMMUNITY_DRAFT);
    const [communitySettingsOpen, setCommunitySettingsOpen] = useState(false);
    const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
    const [moderationLogOpen, setModerationLogOpen] = useState(false);
    const [moderationLogs, setModerationLogs] = useState<Record<string, ModerationLogEntry[]>>(INITIAL_MODERATION_LOGS);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteQuery, setInviteQuery] = useState("");
    const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
    const [communityInviteCodes, setCommunityInviteCodes] = useState<Record<string, string>>(() => Object.fromEntries(
        INITIAL_COMMUNITIES.map((community) => [community.id, `${community.id}-welcome`]),
    ));
    const [communityInvitations, setCommunityInvitations] = useState<Record<string, string[]>>({});
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [conversationMenuOpen, setConversationMenuOpen] = useState(false);
    const [groupMembersOpen, setGroupMembersOpen] = useState(false);
    const [mutedConversations, setMutedConversations] = useState<string[]>([]);
    const [addFriendOpen, setAddFriendOpen] = useState(false);
    const [friendMenuOpen, setFriendMenuOpen] = useState(false);
    const [friendMenuId, setFriendMenuId] = useState<string | null>(null);
    const [friendRemovalId, setFriendRemovalId] = useState<string | null>(null);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [emojiTarget, setEmojiTarget] = useState<"direct" | "room">("direct");
    const [settingsDraft, setSettingsDraft] = useState<CommunitySettingsDraft>({ ...EMPTY_COMMUNITY_DRAFT, allowInvites: true });
    const [channelCreatorOpen, setChannelCreatorOpen] = useState(false);
    const [channelType, setChannelType] = useState<RoomKind>("text");
    const [channelName, setChannelName] = useState("");
    const [channelCategory, setChannelCategory] = useState("hang-out");
    const [categoryCreatorOpen, setCategoryCreatorOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    // Room tools and voice connection controls.
    const [membersPanelOpen, setMembersPanelOpen] = useState(false);
    const [roomMenuOpen, setRoomMenuOpen] = useState(false);
    const [mutedRooms, setMutedRooms] = useState<string[]>([]);
    const [roomLinkCopied, setRoomLinkCopied] = useState(false);
    const [roomSettingsOpen, setRoomSettingsOpen] = useState(false);
    const [roomSettingsName, setRoomSettingsName] = useState("");
    const [roomSettingsCategory, setRoomSettingsCategory] = useState("");
    const [joinedVoiceRoom, setJoinedVoiceRoom] = useState<JoinedVoiceRoom | null>(null);
    const [microphoneMuted, setMicrophoneMuted] = useState(false);
    const [voiceSoundMuted, setVoiceSoundMuted] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const roomMenuRef = useRef<HTMLDivElement>(null);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const conversationMenuRef = useRef<HTMLDivElement>(null);
    const friendMenuRef = useRef<HTMLDivElement>(null);

    // Fall back to a friend or the first conversation if a new ID has no full record yet.
    const activeConversation = conversations.find((conversation) => conversation.id === selectedConversation)
        ?? friends.find((friend) => friend.id === selectedConversation)
        ?? conversations[0];
    const activeCommunity = communities.find((community) => community.id === activeSpace);
    // Rebuild the visible conversation list only when the source or search changes.
    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return conversations;
        return conversations.filter((conversation) => conversation.name.toLowerCase().includes(normalizedQuery));
    }, [conversations, query]);
    const filteredFriends = friends.filter((friend) => friendFilter === "all" || friend.status === friendFilter);
    const newMessageFriends = friends.filter((friend) => friend.name.toLowerCase().includes(newMessageQuery.trim().toLowerCase()));
    const availableFriendCandidates = SUGGESTED_FRIENDS.filter((candidate) => !friends.some((friend) => friend.id === candidate.id));
    const friendPendingRemoval = friends.find((friend) => friend.id === friendRemovalId);
    const onlineFriendCount = friends.filter((friend) => friend.status === "online").length;
    // Find which category owns the room currently shown in the main panel.
    const selectedCategory = activeCommunity?.categories.find((category) => (
        selectedRoomKind === "text" ? category.textRooms : category.voiceRooms
    ).includes(selectedRoom));
    const activeRoomKey = `${activeSpace}:${selectedRoomKind}:${selectedRoom}`;
    const roomIsMuted = mutedRooms.includes(activeRoomKey);
    const directMessages = messages[selectedConversation] ?? [];
    const activeRoomMessages = roomMessages[activeRoomKey] ?? [];
    const directReplyTarget = replyingTo?.scope === "direct" ? directMessages.find((message) => message.id === replyingTo.messageId) : undefined;
    const roomReplyTarget = replyingTo?.scope === "room" ? activeRoomMessages.find((message) => message.id === replyingTo.messageId) : undefined;
    const normalizedMessageSearch = messageSearchQuery.trim().toLowerCase();
    const messageSearchResults: MessageSearchResult[] = normalizedMessageSearch
        ? activeSpace === "messages"
            ? directMessages.filter((message) => message.text.toLowerCase().includes(normalizedMessageSearch)).map((message) => ({
                author: message.author === "me" ? "You" : activeConversation.name,
                id: message.id,
                scope: "direct",
                text: message.text,
                time: message.time,
            }))
            : activeRoomMessages.filter((message) => message.text.toLowerCase().includes(normalizedMessageSearch)).map((message) => ({
                author: message.authorName,
                id: message.id,
                scope: "room",
                text: message.text,
                time: message.time,
            }))
        : [];
    const localDisplayName = activeCommunity ? communityDisplayNames[activeCommunity.id]?.trim() : "";
    const currentCommunityDisplayName = localDisplayName || `@${DEMO_USER.username}`;
    const currentCommunityInitials = localDisplayName ? getInitials(localDisplayName, "U") : getUsernameMark(DEMO_USER.username);
    const activeRoles = activeCommunity ? communityRoles[activeCommunity.id] ?? [] : [];
    const activeCommunityMembers = activeCommunity ? communityMembers[activeCommunity.id] ?? [] : [];
    const currentCommunityMember = activeCommunityMembers.find((member) => member.id === "current-user");
    const currentCommunityPermissions = new Set(activeRoles.filter((role) => currentCommunityMember?.roleIds.includes(role.id)).flatMap((role) => role.permissions));
    const canManageCommunity = currentCommunityPermissions.has("manageCommunity");
    const canManageRooms = currentCommunityPermissions.has("manageRooms");
    const canManageRoles = currentCommunityPermissions.has("manageRoles");
    const canModerateMembers = currentCommunityPermissions.has("moderateMembers");
    const canViewModerationLog = currentCommunityPermissions.has("viewModerationLog");
    const canSendRoomMessages = currentCommunityPermissions.has("sendMessages");
    const canJoinVoice = currentCommunityPermissions.has("joinVoice");
    const canInviteToCommunity = Boolean(activeCommunity && (
        canManageCommunity || (activeCommunity.allowInvites && currentCommunityPermissions.has("inviteMembers"))
    ));
    const activeModerationLogs = activeCommunity ? moderationLogs[activeCommunity.id] ?? [] : [];
    const activeInvitedFriendIds = activeCommunity ? communityInvitations[activeCommunity.id] ?? [] : [];
    const activeMemberIds = new Set(activeCommunityMembers.map((member) => member.id));
    const inviteCandidates = friends.filter((friend) => !activeMemberIds.has(friend.id) && friend.name.toLowerCase().includes(inviteQuery.trim().toLowerCase()));
    const activeInviteCode = activeCommunity ? communityInviteCodes[activeCommunity.id] ?? `${activeCommunity.id}-welcome` : "";
    const activeInviteUrl = activeInviteCode ? `${window.location.origin}/invite/${activeInviteCode}` : "";
    const visibleCommunityMembers = activeCommunityMembers.map((member) => member.id === "current-user"
        ? { ...member, name: currentCommunityDisplayName, initials: currentCommunityInitials }
        : member);
    const roomMembers = selectedRoomKind === "voice" ? visibleCommunityMembers.slice(0, 3) : visibleCommunityMembers;
    const selectedMember = visibleCommunityMembers.find((member) => member.id === selectedMemberId);
    const selectedMemberRoles = activeRoles.filter((role) => selectedMember?.roleIds.includes(role.id));
    const selectedMemberNote = activeCommunity && selectedMember
        ? communityMemberNotes[activeCommunity.id]?.[selectedMember.id] ?? ""
        : "";
    const joinedVoiceCommunity = communities.find((community) => community.id === joinedVoiceRoom?.communityId);
    const activeConversationIsGroup = "members" in activeConversation && Boolean(activeConversation.members);
    const activeConversationIsMuted = mutedConversations.includes(activeConversation.id);

    useDismissableLayer(profileMenuOpen, profileMenuRef, setProfileMenuOpen);
    useDismissableLayer(roomMenuOpen, roomMenuRef, setRoomMenuOpen);
    useDismissableLayer(emojiPickerOpen, emojiPickerRef, setEmojiPickerOpen);
    useDismissableLayer(conversationMenuOpen, conversationMenuRef, setConversationMenuOpen);
    useDismissableLayer(friendMenuOpen, friendMenuRef, setFriendMenuOpen);

    // Show the latest content whenever a conversation or text room changes.
    useLayoutEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            if (messageAreaRef.current) messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        });
        return () => window.cancelAnimationFrame(frame);
    }, [activeSpace, messageView, messages, roomMessages, selectedConversation, selectedRoom, selectedRoomKind]);

    // Also works when the user clicks the room or conversation that is already open.
    const scrollMessagesToBottom = () => {
        window.requestAnimationFrame(() => {
            if (messageAreaRef.current) messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        });
    };

    // Move the active scroll area to a search result and briefly highlight it.
    const openMessageSearchResult = (result: MessageSearchResult) => {
        const messageKey = `${result.scope}-${result.id}`;
        const target = messageAreaRef.current?.querySelector<HTMLElement>(`[data-message-key="${messageKey}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedMessage(messageKey);
        setMessageSearchOpen(false);
        window.setTimeout(() => setHighlightedMessage((current) => current === messageKey ? null : current), 1800);
    };

    // Add one newest-first entry to the active community's local moderation history.
    const addModerationLog = (category: ModerationLogCategory, action: string, detail: string) => {
        if (!activeCommunity) return;
        setModerationLogs((current) => {
            const entries = current[activeCommunity.id] ?? [];
            const entry: ModerationLogEntry = {
                id: `${activeCommunity.id}-log-${entries.length + 1}`,
                action,
                actor: currentCommunityDisplayName,
                category,
                detail,
                time: "Today · now",
            };
            return { ...current, [activeCommunity.id]: [entry, ...entries] };
        });
    };

    // Return to private messages and reset community-only panels.
    const openMessages = () => {
        setActiveSpace("messages");
        setMessageView("chat");
        setMobilePanel("list");
        setMembersPanelOpen(false);
        setRoomMenuOpen(false);
        setRolesDialogOpen(false);
        setModerationLogOpen(false);
        setInviteDialogOpen(false);
        setSelectedMemberId(null);
        setEmojiPickerOpen(false);
        setConversationMenuOpen(false);
        setReplyingTo(null);
        setEditingMessage(null);
    };

    // Open a community on its default text room.
    const openCommunity = (communityId: string) => {
        setActiveSpace(communityId);
        setSelectedRoom("general");
        setSelectedRoomKind("text");
        setMobilePanel("list");
        setMembersPanelOpen(false);
        setRoomMenuOpen(false);
        setRolesDialogOpen(false);
        setModerationLogOpen(false);
        setInviteDialogOpen(false);
        setSelectedMemberId(null);
        setEmojiPickerOpen(false);
        setConversationMenuOpen(false);
        setReplyingTo(null);
        setEditingMessage(null);
    };

    // Start every new community form with a clean draft.
    const openCommunityCreator = () => {
        setCommunityDraft(EMPTY_COMMUNITY_DRAFT);
        setCreateCommunityOpen(true);
    };

    // Add a frontend-only community and open it immediately.
    const createCommunity = (event: React.FormEvent) => {
        event.preventDefault();
        const name = communityDraft.name.trim();
        if (!name) return;

        const id = `${toSlug(name) || "community"}-${Date.now()}`;
        const newCommunity: Community = {
            id,
            name,
            initials: getInitials(name),
            online: 1,
            tone: communityDraft.tone,
            description: communityDraft.description.trim() || "A new place to gather on Knotly.",
            visibility: communityDraft.visibility,
            allowInvites: true,
            categories: [{ id: "start-here", label: "Start here", textRooms: ["general"], voiceRooms: ["lounge"] }],
        };

        setCommunities((current) => [...current, newCommunity]);
        setCommunityRoles((current) => ({ ...current, [id]: createCommunityRoles() }));
        setCommunityMembers((current) => ({ ...current, [id]: createCommunityMembers().slice(0, 1) }));
        setCommunityInviteCodes((current) => ({ ...current, [id]: `${id}-welcome` }));
        setModerationLogs((current) => ({
            ...current,
            [id]: [{ id: `${Date.now()}-created`, action: "Community created", actor: `@${DEMO_USER.username}`, category: "community", detail: `${name} was created.`, time: "Today · now" }],
        }));
        setActiveSpace(id);
        setSelectedRoom("general");
        setSelectedRoomKind("text");
        setMobilePanel("list");
        setCreateCommunityOpen(false);
    };

    // Copy current values into a draft so canceling does not change the community.
    const openCommunitySettings = () => {
        if (!activeCommunity) return;
        setSettingsDraft({
            name: activeCommunity.name,
            description: activeCommunity.description,
            tone: activeCommunity.tone,
            visibility: activeCommunity.visibility,
            allowInvites: activeCommunity.allowInvites,
            localDisplayName: communityDisplayNames[activeCommunity.id] ?? "",
        });
        setCommunitySettingsOpen(true);
    };

    // Replace only the active community and keep every other community unchanged.
    const saveCommunitySettings = (event: React.FormEvent) => {
        event.preventDefault();
        const name = settingsDraft.name.trim();
        if (!activeCommunity || (canManageCommunity && !name)) return;

        if (canManageCommunity) {
            const communityChanged = name !== activeCommunity.name
                || settingsDraft.description.trim() !== activeCommunity.description
                || settingsDraft.tone !== activeCommunity.tone
                || settingsDraft.visibility !== activeCommunity.visibility
                || settingsDraft.allowInvites !== activeCommunity.allowInvites;
            setCommunities((current) => current.map((community) => community.id === activeCommunity.id
                ? {
                    ...community,
                    name,
                    initials: getInitials(name),
                    description: settingsDraft.description.trim(),
                    tone: settingsDraft.tone,
                    visibility: settingsDraft.visibility,
                    allowInvites: settingsDraft.allowInvites,
                }
                : community));
            if (communityChanged) addModerationLog("community", "Community settings updated", "Name, visibility, appearance, or invitation settings were changed.");
        }
        setCommunityDisplayNames((current) => {
            const next = { ...current };
            const localName = settingsDraft.localDisplayName.trim();
            if (localName) next[activeCommunity.id] = localName;
            else delete next[activeCommunity.id];
            return next;
        });
        setCommunitySettingsOpen(false);
    };

    // Open the invite flow with a fresh search and copy state.
    const openInviteDialog = () => {
        if (!activeCommunity || !canInviteToCommunity) return;
        if (!communityInviteCodes[activeCommunity.id]) {
            setCommunityInviteCodes((current) => ({ ...current, [activeCommunity.id]: createInviteCode(activeCommunity.id) }));
        }
        setInviteQuery("");
        setInviteLinkCopied(false);
        setInviteDialogOpen(true);
    };

    // Copy the current community invite link and show a short confirmation.
    const copyInviteLink = async () => {
        if (!activeInviteUrl || !canInviteToCommunity) return;
        try {
            await navigator.clipboard.writeText(activeInviteUrl);
        } catch {
            // Clipboard access can be blocked in previews; the visible state still demonstrates the flow.
        }
        setInviteLinkCopied(true);
        window.setTimeout(() => setInviteLinkCopied(false), 1800);
    };

    // Replace the old link so the previous code is no longer shown in this demo.
    const regenerateInviteLink = () => {
        if (!activeCommunity || !canInviteToCommunity) return;
        setCommunityInviteCodes((current) => ({ ...current, [activeCommunity.id]: createInviteCode(activeCommunity.id) }));
        setInviteLinkCopied(false);
        addModerationLog("invites", "Invite link regenerated", "The previous community invite link was replaced.");
    };

    // Clicking an invited friend again cancels that pending invitation.
    const toggleCommunityInvitation = (friendId: string) => {
        if (!activeCommunity || !canInviteToCommunity) return;
        const friend = friends.find((item) => item.id === friendId);
        const wasInvited = activeInvitedFriendIds.includes(friendId);
        setCommunityInvitations((current) => {
            const invitations = current[activeCommunity.id] ?? [];
            return {
                ...current,
                [activeCommunity.id]: invitations.includes(friendId)
                    ? invitations.filter((id) => id !== friendId)
                    : [...invitations, friendId],
            };
        });
        if (friend) addModerationLog("invites", wasInvited ? "Invitation cancelled" : "Invitation sent", `${friend.name}'s invitation was ${wasInvited ? "cancelled" : "sent"}.`);
    };

    // Open role management from community settings without stacking dialogs.
    const openRolesManager = () => {
        if (!canManageRoles) return;
        setCommunitySettingsOpen(false);
        setRolesDialogOpen(true);
    };

    // Open the protected moderation history from community settings.
    const openModerationLog = () => {
        if (!canViewModerationLog) return;
        setCommunitySettingsOpen(false);
        setModerationLogOpen(true);
    };

    // Create an editable role in the active community and return its ID for selection.
    const createCommunityRole = () => {
        if (!activeCommunity || !canManageRoles) return "";
        let roleNumber = activeRoles.length + 1;
        while (activeRoles.some((role) => role.id === `role-${roleNumber}`)) roleNumber += 1;
        const roleId = `role-${roleNumber}`;
        const newRole: CommunityRole = {
            id: roleId,
            name: "New role",
            color: "#d97465",
            permissions: ["sendMessages", "joinVoice"],
            protected: false,
        };
        setCommunityRoles((current) => ({
            ...current,
            [activeCommunity.id]: [...(current[activeCommunity.id] ?? []), newRole],
        }));
        addModerationLog("roles", "Role created", "Created the New role role with basic room permissions.");
        return roleId;
    };

    // Update one role while keeping roles from every other community untouched.
    const updateCommunityRole = (roleId: string, changes: Partial<Pick<CommunityRole, "name" | "color" | "permissions">>) => {
        if (!activeCommunity || !canManageRoles) return;
        const role = activeRoles.find((item) => item.id === roleId);
        setCommunityRoles((current) => ({
            ...current,
            [activeCommunity.id]: (current[activeCommunity.id] ?? []).map((role) => role.id === roleId ? { ...role, ...changes } : role),
        }));
        if (changes.permissions && role) addModerationLog("roles", "Role permissions updated", `${role.name} now has ${changes.permissions.length} permissions.`);
    };

    // Delete a custom role and move its members back to the default member role.
    const deleteCommunityRole = (roleId: string) => {
        if (!activeCommunity || !canManageRoles) return;
        const role = activeRoles.find((item) => item.id === roleId);
        if (!role || role.protected) return;
        setCommunityRoles((current) => ({
            ...current,
            [activeCommunity.id]: (current[activeCommunity.id] ?? []).filter((role) => role.id !== roleId || role.protected),
        }));
        setCommunityMembers((current) => ({
            ...current,
            [activeCommunity.id]: (current[activeCommunity.id] ?? []).map((member) => {
                const roleIds = member.roleIds.filter((id) => id !== roleId);
                return { ...member, roleIds: roleIds.length > 0 ? roleIds : ["member"] };
            }),
        }));
        addModerationLog("roles", "Role deleted", `${role.name} was deleted and affected members were returned to the default role.`);
    };

    // Add or remove one role without replacing the member's other roles.
    const toggleMemberRole = (memberId: string, roleId: string) => {
        if (!activeCommunity || !canModerateMembers || roleId === "owner") return;
        const member = activeCommunityMembers.find((item) => item.id === memberId);
        const role = activeRoles.find((item) => item.id === roleId);
        const wasAssigned = member?.roleIds.includes(roleId) ?? false;
        setCommunityMembers((current) => ({
            ...current,
            [activeCommunity.id]: (current[activeCommunity.id] ?? []).map((member) => member.id === memberId
                ? {
                    ...member,
                    roleIds: member.roleIds.includes(roleId)
                        ? member.roleIds.filter((id) => id !== roleId)
                        : [...member.roleIds, roleId],
                }
                : member),
        }));
        if (member && role) addModerationLog("members", wasAssigned ? "Role removed from member" : "Role assigned to member", `${role.name} was ${wasAssigned ? "removed from" : "assigned to"} ${member.name}.`);
    };

    // Open the emoji panel for the matching message field.
    const toggleEmojiPicker = (target: "direct" | "room") => {
        if (emojiTarget === target) setEmojiPickerOpen((open) => !open);
        else {
            setEmojiTarget(target);
            setEmojiPickerOpen(true);
        }
    };

    // Append the chosen emoji to the message currently being written.
    const insertTextEmoji = (emoji: string) => {
        if (emojiTarget === "direct") setDraft((current) => `${current}${emoji}`);
        else setRoomDraft((current) => `${current}${emoji}`);
        setEmojiPickerOpen(false);
    };

    // Toggle notifications for only the active private conversation.
    const toggleConversationMuted = () => {
        setMutedConversations((current) => current.includes(activeConversation.id)
            ? current.filter((id) => id !== activeConversation.id)
            : [...current, activeConversation.id]);
        setConversationMenuOpen(false);
    };

    // Add a visible unread marker without changing message content.
    const markConversationUnread = () => {
        setConversations((current) => current.map((conversation) => conversation.id === activeConversation.id
            ? { ...conversation, unread: 1 }
            : conversation));
        setConversationMenuOpen(false);
    };

    // Remove a direct conversation, or leave a group, from the local inbox.
    const closeActiveConversation = () => {
        setConversations((current) => {
            if (current.length <= 1) return current;
            const remaining = current.filter((conversation) => conversation.id !== activeConversation.id);
            if (remaining.length > 0) setSelectedConversation(remaining[0].id);
            return remaining;
        });
        setConversationMenuOpen(false);
        setGroupMembersOpen(false);
    };

    // Add one friend to the active group without duplicating existing members.
    const addGroupMember = (friendId: string) => {
        const friend = friends.find((item) => item.id === friendId);
        if (!friend) return;
        setConversations((current) => current.map((conversation) => conversation.id === activeConversation.id && conversation.members
            ? conversation.members.some((member) => member.id === friend.id)
                ? conversation
                : { ...conversation, members: [...conversation.members, friend] }
            : conversation));
    };

    // Remove one person from the active local group conversation.
    const removeGroupMember = (memberId: string) => {
        setConversations((current) => current.map((conversation) => conversation.id === activeConversation.id && conversation.members
            ? { ...conversation, members: conversation.members.filter((member) => member.id !== memberId) }
            : conversation));
    };

    // Open an existing direct message or create a local one for this friend.
    const openFriendConversation = (friend: Friend) => {
        if (!conversations.some((conversation) => conversation.id === friend.id)) {
            setConversations((current) => [{
                id: friend.id,
                name: friend.name,
                initials: friend.initials,
                preview: "Start a new conversation",
                time: "now",
                status: friend.status,
                tone: friend.tone,
            }, ...current]);
        }
        setSelectedConversation(friend.id);
        setMessageView("chat");
        setMobilePanel("chat");
        setFriendMenuOpen(false);
        setReplyingTo(null);
        setEditingMessage(null);
    };

    // Add one suggested profile to the local friends list.
    const addFriend = (friendId: string) => {
        const candidate = SUGGESTED_FRIENDS.find((friend) => friend.id === friendId);
        if (!candidate) return;
        setFriends((current) => current.some((friend) => friend.id === friendId) ? current : [...current, candidate]);
    };

    // Remove the friendship while preserving any existing private messages.
    const removeFriend = () => {
        if (!friendRemovalId) return;
        setFriends((current) => current.filter((friend) => friend.id !== friendRemovalId));
        setFriendRemovalId(null);
        setFriendMenuOpen(false);
    };

    // Remove a member from this frontend-only community list.
    const removeCommunityMember = (memberId: string) => {
        if (!activeCommunity || !canModerateMembers || memberId === "current-user") return;
        const member = activeCommunityMembers.find((item) => item.id === memberId);
        setCommunityMembers((current) => ({
            ...current,
            [activeCommunity.id]: (current[activeCommunity.id] ?? []).filter((member) => member.id !== memberId),
        }));
        if (member) addModerationLog("members", "Member removed", `${member.name} was removed from the community.`);
        setSelectedMemberId(null);
    };

    // Save a private note for one member in one community.
    const updateCommunityMemberNote = (memberId: string, note: string) => {
        if (!activeCommunity) return;
        setCommunityMemberNotes((current) => ({
            ...current,
            [activeCommunity.id]: {
                ...(current[activeCommunity.id] ?? {}),
                [memberId]: note,
            },
        }));
    };

    // Open or create a direct conversation from a community member profile.
    const messageCommunityMember = (member: CommunityMember) => {
        if (!conversations.some((conversation) => conversation.id === member.id)) {
            setConversations((current) => [{
                id: member.id,
                name: member.name,
                initials: member.initials,
                preview: "Start a new conversation",
                time: "now",
                status: member.status,
                tone: member.tone,
            }, ...current]);
        }
        setSelectedConversation(member.id);
        setActiveSpace("messages");
        setMessageView("chat");
        setMobilePanel("chat");
        setMembersPanelOpen(false);
        setSelectedMemberId(null);
        setReplyingTo(null);
        setEditingMessage(null);
    };

    // Open the room form with the type and category chosen by the clicked button.
    const openChannelCreator = (type: "text" | "voice", categoryId = activeCommunity?.categories[0]?.id ?? "start-here") => {
        if (!canManageRooms) return;
        setChannelType(type);
        setChannelCategory(categoryId);
        setChannelName("");
        setChannelCreatorOpen(true);
    };

    // Add a text or voice room without changing the original nested arrays.
    const createChannel = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity || !canManageRooms) return;
        const roomName = toSlug(channelName);
        if (!roomName) return;
        const targetCategory = activeCommunity.categories.find((category) => category.id === channelCategory);
        const targetRooms = channelType === "voice" ? targetCategory?.voiceRooms : targetCategory?.textRooms;
        if (targetRooms?.includes(roomName)) return;

        setCommunities((current) => current.map((community) => {
            if (community.id !== activeCommunity.id) return community;
            return {
                ...community,
                categories: community.categories.map((category) => {
                    if (category.id !== channelCategory) return category;
                    if (channelType === "voice") {
                        return category.voiceRooms.includes(roomName) ? category : { ...category, voiceRooms: [...category.voiceRooms, roomName] };
                    }
                    return category.textRooms.includes(roomName) ? category : { ...category, textRooms: [...category.textRooms, roomName] };
                }),
            };
        }));
        // Voice rooms are joined directly; text rooms open in the main panel.
        if (channelType === "voice" && canJoinVoice) {
            setJoinedVoiceRoom({ communityId: activeCommunity.id, room: roomName });
            setMicrophoneMuted(false);
            setVoiceSoundMuted(false);
            setMobilePanel("list");
        } else if (channelType === "text") {
            setSelectedRoom(roomName);
            setSelectedRoomKind("text");
            setMobilePanel("chat");
        }
        addModerationLog("rooms", `${channelType === "voice" ? "Voice" : "Text"} room created`, `Created ${channelType === "text" ? "#" : ""}${roomName}.`);
        setChannelCreatorOpen(false);
    };

    // Add an empty category that can later hold both text and voice rooms.
    const createCategory = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity || !canManageRooms) return;
        const label = categoryName.trim();
        const id = toSlug(label);
        if (!label || !id || activeCommunity.categories.some((category) => category.id === id)) return;

        setCommunities((current) => current.map((community) => community.id === activeCommunity.id && !community.categories.some((category) => category.id === id)
            ? { ...community, categories: [...community.categories, { id, label, textRooms: [], voiceRooms: [] }] }
            : community));
        setChannelCategory(id);
        setCategoryCreatorOpen(false);
        setCategoryName("");
        addModerationLog("rooms", "Category created", `Created the ${label} category.`);
    };

    // Fill the edit form with the room and category currently on screen.
    const openRoomSettings = () => {
        if (!canManageRooms) return;
        setRoomSettingsName(selectedRoom);
        setRoomSettingsCategory(selectedCategory?.id ?? activeCommunity?.categories[0]?.id ?? "");
        setRoomMenuOpen(false);
        setRoomSettingsOpen(true);
    };

    // Rename or move a room by removing it first, then adding it to its target category.
    const saveRoomSettings = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity || !selectedCategory || !canManageRooms) return;
        const nextName = toSlug(roomSettingsName);
        if (!nextName || !roomSettingsCategory) return;

        setCommunities((current) => current.map((community) => {
            if (community.id !== activeCommunity.id) return community;
            const withoutCurrent = community.categories.map((category) => ({
                ...category,
                textRooms: selectedRoomKind === "text" ? category.textRooms.filter((room) => room !== selectedRoom) : category.textRooms,
                voiceRooms: selectedRoomKind === "voice" ? category.voiceRooms.filter((room) => room !== selectedRoom) : category.voiceRooms,
            }));
            return {
                ...community,
                categories: withoutCurrent.map((category) => category.id === roomSettingsCategory
                    ? selectedRoomKind === "text"
                        ? { ...category, textRooms: [...category.textRooms, nextName] }
                        : { ...category, voiceRooms: [...category.voiceRooms, nextName] }
                    : category),
            };
        }));
        setSelectedRoom(nextName);
        setRoomSettingsOpen(false);
        addModerationLog("rooms", "Room updated", `${selectedRoom} was renamed or moved to another category as ${nextName}.`);
    };

    // A full key keeps same-named rooms in different communities independent.
    const toggleRoomMuted = () => {
        const roomKey = `${activeSpace}:${selectedRoomKind}:${selectedRoom}`;
        setMutedRooms((current) => current.includes(roomKey) ? current.filter((key) => key !== roomKey) : [...current, roomKey]);
        setRoomMenuOpen(false);
    };

    // Copy a simple shareable URL for the active room.
    const copyRoomLink = async () => {
        const roomUrl = `${window.location.origin}/home?community=${activeSpace}&room=${selectedRoom}`;
        try {
            await navigator.clipboard.writeText(roomUrl);
        } catch {
            // Clipboard access can be blocked in local previews; the visual confirmation still keeps the demo flow usable.
        }
        setRoomLinkCopied(true);
        window.setTimeout(() => setRoomLinkCopied(false), 1800);
    };

    // Append a private message to the active local conversation.
    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        const text = draft.trim();
        if (!text || activeSpace !== "messages") return;

        setMessages((current) => ({
            ...current,
            [selectedConversation]: [
                ...(current[selectedConversation] ?? []),
                { id: Date.now(), author: "me", text, time: "now", replyToId: replyingTo?.scope === "direct" ? replyingTo.messageId : undefined },
            ],
        }));
        setDraft("");
        setReplyingTo(null);
    };

    // Append a local message to the active community text room.
    const sendRoomMessage = (event: React.FormEvent) => {
        event.preventDefault();
        const text = roomDraft.trim();
        if (!text || selectedRoomKind !== "text" || !canSendRoomMessages) return;
        setRoomMessages((current) => ({
            ...current,
            [activeRoomKey]: [...(current[activeRoomKey] ?? []), {
                id: Date.now(),
                authorId: "current-user",
                authorName: currentCommunityDisplayName,
                initials: currentCommunityInitials,
                tone: "brown",
                text,
                time: "now",
                replyToId: replyingTo?.scope === "room" ? replyingTo.messageId : undefined,
            }],
        }));
        setRoomDraft("");
        setReplyingTo(null);
    };

    // Open an inline editor for one of the current user's messages.
    const startEditingMessage = (scope: "direct" | "room", messageId: number, text: string) => {
        setEditingMessage({ scope, messageId });
        setEditDraft(text);
        setReplyingTo(null);
    };

    // Save edited text in the matching conversation or room.
    const saveEditedMessage = (event: React.FormEvent) => {
        event.preventDefault();
        const text = editDraft.trim();
        if (!text || !editingMessage) return;
        if (editingMessage.scope === "direct") {
            setMessages((current) => ({
                ...current,
                [selectedConversation]: (current[selectedConversation] ?? []).map((message) => message.id === editingMessage.messageId ? { ...message, text, edited: true } : message),
            }));
        } else {
            setRoomMessages((current) => ({
                ...current,
                [activeRoomKey]: (current[activeRoomKey] ?? []).map((message) => message.id === editingMessage.messageId ? { ...message, text, edited: true } : message),
            }));
        }
        setEditingMessage(null);
        setEditDraft("");
    };

    // Remove one message after the inline confirmation in its action bar.
    const deleteMessage = (scope: "direct" | "room", messageId: number) => {
        if (scope === "direct") {
            setMessages((current) => ({ ...current, [selectedConversation]: (current[selectedConversation] ?? []).filter((message) => message.id !== messageId) }));
        } else {
            setRoomMessages((current) => ({ ...current, [activeRoomKey]: (current[activeRoomKey] ?? []).filter((message) => message.id !== messageId) }));
        }
        if (editingMessage?.messageId === messageId && editingMessage.scope === scope) setEditingMessage(null);
        if (replyingTo?.messageId === messageId && replyingTo.scope === scope) setReplyingTo(null);
    };

    // Add or remove the current user's reaction on one message.
    const toggleMessageReaction = (scope: "direct" | "room", messageId: number, emoji: string) => {
        if (scope === "room" && !canSendRoomMessages) return;
        if (scope === "direct") {
            setMessages((current) => ({
                ...current,
                [selectedConversation]: (current[selectedConversation] ?? []).map((message) => message.id === messageId ? withToggledReaction(message, emoji) : message),
            }));
        } else {
            setRoomMessages((current) => ({
                ...current,
                [activeRoomKey]: (current[activeRoomKey] ?? []).map((message) => message.id === messageId ? withToggledReaction(message, emoji) : message),
            }));
        }
    };

    // Reset the picker before starting a direct or group conversation.
    const openNewMessage = (mode: "direct" | "group" = "direct") => {
        setNewMessageMode(mode);
        setSelectedFriends([]);
        setNewMessageQuery("");
        setGroupName("");
        setNewMessageOpen(true);
    };

    // Reuse an existing direct chat or create a new local group record.
    const createConversation = () => {
        const chosenFriends = friends.filter((friend) => selectedFriends.includes(friend.id));
        if (chosenFriends.length === 0) return;

        if (newMessageMode === "direct") {
            const friend = chosenFriends[0];
            if (!conversations.some((conversation) => conversation.id === friend.id)) {
                setConversations((current) => [{
                    id: friend.id,
                    name: friend.name,
                    initials: friend.initials,
                    preview: "Start a new conversation",
                    time: "now",
                    status: friend.status,
                    tone: friend.tone,
                }, ...current]);
            }
            setSelectedConversation(friend.id);
        } else {
            const conversationId = `group-${Date.now()}`;
            const conversationName = groupName.trim() || chosenFriends.map((friend) => friend.name.split(" ")[0]).join(", ");
            setConversations((current) => [{
                id: conversationId,
                name: conversationName,
                initials: String(chosenFriends.length + 1),
                preview: "New group conversation",
                time: "now",
                tone: "rose",
                members: chosenFriends,
            }, ...current]);
            setSelectedConversation(conversationId);
        }

        setActiveSpace("messages");
        setMessageView("chat");
        setMobilePanel("chat");
        setNewMessageOpen(false);
        setReplyingTo(null);
        setEditingMessage(null);
    };

    return (
        <main className={styles.appPage}>
            <HomeHeader
                activeSpace={activeSpace}
                communities={communities}
                isProfileMenuOpen={profileMenuOpen}
                profileMenuRef={profileMenuRef}
                user={DEMO_USER}
                onCreateCommunity={openCommunityCreator}
                onOpenCommunity={openCommunity}
                onOpenMessages={openMessages}
                onToggleProfileMenu={() => setProfileMenuOpen((open) => !open)}
            />

            {/* The left panel lists conversations or rooms; the right panel shows their content. */}
            <div className={`${styles.workspace} ${mobilePanel === "chat" ? styles.showChat : ""}`}>
                <aside className={styles.listPanel}>
                    {activeSpace === "messages" ? (
                        <>
                            <div className={styles.listHeader}>
                                <div><span>Your inbox</span><h1>Messages</h1></div>
                                <button type="button" aria-label="Start a conversation" onClick={() => openNewMessage()}><Plus /></button>
                            </div>
                            <label className={styles.searchBox}>
                                <Search aria-hidden="true" />
                                <span className={styles.srOnly}>Search conversations</span>
                                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a conversation" />
                            </label>

                            <div className={styles.inboxShortcut}>
                                <button
                                    type="button"
                                    className={messageView === "friends" ? styles.activeShortcut : ""}
                                    onClick={() => {
                                        setMessageView("friends");
                                        setMobilePanel("chat");
                                    }}
                                >
                                    <span><UsersRound /></span><div><strong>Friends</strong><small>{onlineFriendCount} people online</small></div><ChevronDown />
                                </button>
                            </div>

                            <div className={styles.conversationSection}>
                                <div className={styles.sectionLabel}><span>Recent</span><small>{filteredConversations.length}</small></div>
                                <div className={styles.conversationList}>
                                    {filteredConversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            type="button"
                                            className={selectedConversation === conversation.id ? styles.selectedConversation : ""}
                                            onClick={() => {
                                                setSelectedConversation(conversation.id);
                                                setMessageView("chat");
                                                setMobilePanel("chat");
                                                setConversationMenuOpen(false);
                                                setReplyingTo(null);
                                                setEditingMessage(null);
                                                scrollMessagesToBottom();
                                            }}
                                        >
                                            {conversation.members ? (
                                                <GroupAvatar members={conversation.members} total={conversation.members.length + 1} />
                                            ) : (
                                                <span className={`${styles.personAvatar} ${styles[conversation.tone]}`}>{conversation.initials}<i /></span>
                                            )}
                                            <span className={styles.conversationCopy}>
                                                <span><strong>{conversation.name}</strong><time>{conversation.time}</time></span>
                                                <small>{conversation.preview}</small>
                                            </span>
                                            {conversation.unread && <b>{conversation.unread}</b>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.communityHeader}>
                                <div className={`${styles.communityMark} ${styles[activeCommunity?.tone ?? "coral"]}`}>{activeCommunity?.initials}</div>
                                <div><span>Community</span><h1>{activeCommunity?.name}</h1><small><i /> {activeCommunity?.online} online</small></div>
                                <div className={styles.communityHeaderActions}>
                                    {canInviteToCommunity && <button type="button" className={styles.communityInviteButton} aria-label={`Invite people to ${activeCommunity?.name}`} onClick={openInviteDialog}><UserPlus /></button>}
                                    <button type="button" aria-label="Community settings" onClick={openCommunitySettings}><MoreHorizontal /></button>
                                </div>
                            </div>

                            <div className={styles.roomNavigation}>
                                {activeCommunity?.categories.map((category) => (
                                    <section key={category.id}>
                                        <span>{category.label}{canManageRooms && <button type="button" className={styles.sectionAdd} onClick={() => openChannelCreator("text", category.id)} aria-label={`Add a room to ${category.label}`}><Plus /></button>}</span>
                                        {category.textRooms.map((room) => (
                                            <button
                                                key={room}
                                                type="button"
                                                className={selectedRoom === room && selectedRoomKind === "text" ? styles.selectedRoom : ""}
                                                onClick={() => {
                                                    setSelectedRoom(room);
                                                    setSelectedRoomKind("text");
                                                    setMobilePanel("chat");
                                                    setReplyingTo(null);
                                                    setEditingMessage(null);
                                                    scrollMessagesToBottom();
                                                }}
                                            >
                                                <Hash /> {room} {room === "general" && <small>3</small>}
                                            </button>
                                        ))}
                                        {category.voiceRooms.map((room) => (
                                            <div key={room}>
                                            <button
                                                type="button"
                                                className={joinedVoiceRoom?.communityId === activeCommunity.id && joinedVoiceRoom.room === room ? styles.joinedVoiceButton : ""}
                                                onClick={() => {
                                                    if (!canJoinVoice) return;
                                                    setJoinedVoiceRoom({ communityId: activeCommunity.id, room });
                                                    setMicrophoneMuted(false);
                                                    setVoiceSoundMuted(false);
                                                    setRoomMenuOpen(false);
                                                }}
                                                aria-label={`Join ${room}`}
                                                disabled={!canJoinVoice}
                                            >
                                                <Headphones /> {room}<small>{!canJoinVoice ? "No access" : joinedVoiceRoom?.communityId === activeCommunity.id && joinedVoiceRoom.room === room ? "Joined" : "Join"}</small>
                                            </button>
                                            {room === "cozy-corner" && activeCommunity?.id === "saturday" && (
                                                <>
                                                    <button type="button" className={styles.voicePeople} onClick={() => setSelectedMemberId("maya")}><i className={styles.coral}>MC</i><span>Maya is talking<AudioWave /></span></button>
                                                    <button type="button" className={styles.voicePeople} onClick={() => setSelectedMemberId("jules")}><i className={styles.amber}>JM</i><span>Jules</span></button>
                                                </>
                                            )}
                                            {joinedVoiceRoom?.communityId === activeCommunity.id && joinedVoiceRoom.room === room && (
                                                <button type="button" className={`${styles.voicePeople} ${styles.currentVoiceUser}`} onClick={() => setSelectedMemberId("current-user")}><i className={styles.brown}>{currentCommunityInitials}</i><span>{currentCommunityDisplayName} {microphoneMuted && <MicOff aria-label="Microphone muted" />}</span></button>
                                            )}
                                            </div>
                                        ))}
                                    </section>
                                ))}
                                {canManageRooms && <button type="button" className={styles.addCategoryButton} onClick={() => { setCategoryName(""); setCategoryCreatorOpen(true); }}><FolderPlus /> New category</button>}
                                {joinedVoiceRoom && (
                                    <div className={styles.voiceConnection}>
                                        <i>{microphoneMuted ? <MicOff /> : <AudioWave />}</i>
                                        <span><small>{voiceSoundMuted ? "Sound muted" : microphoneMuted ? "Microphone muted" : `Voice connected · ${joinedVoiceCommunity?.name}`}</small><strong>{joinedVoiceRoom.room}</strong></span>
                                        <div className={styles.voiceControls}>
                                            <button type="button" className={microphoneMuted ? styles.voiceControlActive : ""} onClick={() => setMicrophoneMuted((muted) => !muted)} aria-label={microphoneMuted ? "Turn microphone on" : "Mute microphone"} aria-pressed={microphoneMuted}>{microphoneMuted ? <MicOff /> : <Mic />}</button>
                                            <button type="button" className={voiceSoundMuted ? styles.voiceControlActive : ""} onClick={() => setVoiceSoundMuted((muted) => !muted)} aria-label={voiceSoundMuted ? "Turn sound on" : "Mute sound"} aria-pressed={voiceSoundMuted}>{voiceSoundMuted ? <VolumeX /> : <Volume2 />}</button>
                                            <button type="button" className={styles.leaveVoiceButton} onClick={() => setJoinedVoiceRoom(null)} aria-label={`Leave ${joinedVoiceRoom.room}`}><PhoneOff /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </aside>

                {activeSpace === "messages" && messageView === "friends" ? (
                    <section className={`${styles.chatPanel} ${styles.friendsPanel}`}>
                        <header className={styles.chatHeader}>
                            <button type="button" className={styles.mobileBack} onClick={() => setMobilePanel("list")} aria-label="Back to conversations"><ArrowLeft /></button>
                            <span className={styles.roomIcon}><UsersRound /></span>
                            <div><strong>Friends</strong><span>People you’ve added on Knotly</span></div>
                            <button type="button" className={styles.addFriendButton} onClick={() => setAddFriendOpen(true)}><UserPlus /> Add friend</button>
                        </header>

                        <div className={styles.friendsContent}>
                            <div className={styles.friendsHeading}>
                                <div><span>Your people</span><h2>Friends</h2><p>See who is around, or pick up a conversation whenever you like.</p></div>
                                <div className={styles.friendFilters}>
                                    {(["all", "online", "offline"] as const).map((filter) => (
                                        <button key={filter} type="button" className={friendFilter === filter ? styles.activeFilter : ""} onClick={() => setFriendFilter(filter)}>
                                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.friendGroups} key={friendFilter}>
                                {(["online", "offline"] as const).map((status) => {
                                    const group = filteredFriends.filter((friend) => friend.status === status);
                                    if (group.length === 0) return null;

                                    return (
                                        <section key={status}>
                                            <div className={styles.friendGroupLabel}><span>{status}</span><small>{group.length}</small></div>
                                            <div className={styles.friendList}>
                                                {group.map((friend) => (
                                                    <div key={friend.id} className={styles.friendRow}>
                                                        <span className={`${styles.personAvatar} ${styles[friend.tone]} ${friend.status === "offline" ? styles.offlineAvatar : ""}`}>{friend.initials}<i /></span>
                                                        <div><strong>{friend.name}</strong><span>{friend.activity}</span></div>
                                                        <button
                                                            type="button"
                                                            aria-label={`Message ${friend.name}`}
                                                            onClick={() => openFriendConversation(friend)}
                                                        >
                                                            <MessageCircleMore />
                                                        </button>
                                                        <div className={styles.friendRowMenu} ref={friendMenuOpen && friendMenuId === friend.id ? friendMenuRef : undefined}>
                                                            <button type="button" className={friendMenuOpen && friendMenuId === friend.id ? styles.activeFriendMenu : ""} aria-label={`More options for ${friend.name}`} aria-expanded={friendMenuOpen && friendMenuId === friend.id} onClick={() => {
                                                                if (friendMenuId === friend.id) setFriendMenuOpen((open) => !open);
                                                                else {
                                                                    setFriendMenuId(friend.id);
                                                                    setFriendMenuOpen(true);
                                                                }
                                                            }}><MoreHorizontal /></button>
                                                            {friendMenuOpen && friendMenuId === friend.id && (
                                                                <div className={styles.friendActionsMenu}>
                                                                    <div><strong>{friend.name}</strong><small>@{friend.id}</small></div>
                                                                    <button type="button" onClick={() => openFriendConversation(friend)}><MessageCircleMore /> Message</button>
                                                                    <button type="button" className={styles.dangerMenuAction} onClick={() => { setFriendMenuOpen(false); setFriendRemovalId(friend.id); }}><UserMinus /> Remove friend</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                ) : activeSpace === "messages" ? (
                    <section className={styles.chatPanel}>
                        <header className={styles.chatHeader}>
                            <button type="button" className={styles.mobileBack} onClick={() => setMobilePanel("list")} aria-label="Back to conversations"><ArrowLeft /></button>
                            {"members" in activeConversation && activeConversation.members ? (
                                <GroupAvatar members={activeConversation.members} total={activeConversation.members.length + 1} compact />
                            ) : (
                                <span className={`${styles.personAvatar} ${styles[activeConversation.tone]}`}>{activeConversation.initials}<i /></span>
                            )}
                            <div>
                                <strong>{activeConversation.name}</strong>
                                <span>{"members" in activeConversation && activeConversation.members
                                    ? `${activeConversation.members.map((member) => member.name.split(" ")[0]).join(", ")} and you`
                                    : activeConversation.status
                                        ? `${activeConversation.status.charAt(0).toUpperCase()}${activeConversation.status.slice(1)}`
                                        : "Last seen recently"}</span>
                            </div>
                            <div className={styles.chatActions}>
                                <button type="button" aria-label="Start voice call"><Phone /></button>
                                <button type="button" aria-label="Start video call"><Video /></button>
                                <MessageSearch
                                    contextLabel={activeConversation.name}
                                    isOpen={messageSearchOpen}
                                    query={messageSearchQuery}
                                    results={messageSearchResults}
                                    setIsOpen={setMessageSearchOpen}
                                    setQuery={setMessageSearchQuery}
                                    onSelect={openMessageSearchResult}
                                />
                                <div className={styles.conversationMenuWrap} ref={conversationMenuRef}>
                                    <button type="button" className={conversationMenuOpen ? styles.activeChatAction : ""} aria-label="Conversation options" aria-expanded={conversationMenuOpen} onClick={() => setConversationMenuOpen((open) => !open)}><MoreHorizontal /></button>
                                    {conversationMenuOpen && (
                                        <div className={styles.conversationOptionsMenu}>
                                            <div><strong>{activeConversation.name}</strong><small>{activeConversationIsGroup ? `${(("members" in activeConversation ? activeConversation.members?.length : 0) ?? 0) + 1} people` : activeConversationIsMuted ? "Notifications muted" : "Private conversation"}</small></div>
                                            {activeConversationIsGroup && <button type="button" onClick={() => { setConversationMenuOpen(false); setGroupMembersOpen(true); }}><UsersRound /> Manage members</button>}
                                            <button type="button" onClick={toggleConversationMuted}>{activeConversationIsMuted ? <Bell /> : <BellOff />} {activeConversationIsMuted ? "Unmute notifications" : "Mute notifications"}</button>
                                            <button type="button" onClick={markConversationUnread}><MailOpen /> Mark as unread</button>
                                            <button type="button" className={styles.dangerMenuAction} onClick={closeActiveConversation}>{activeConversationIsGroup ? <LogOut /> : <X />} {activeConversationIsGroup ? "Leave group" : "Close conversation"}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        <div className={styles.messageArea} ref={messageAreaRef}>
                            <div className={styles.conversationIntro}>
                                {"members" in activeConversation && activeConversation.members ? (
                                    <GroupAvatar members={activeConversation.members} total={activeConversation.members.length + 1} large />
                                ) : (
                                    <span className={`${styles.heroAvatar} ${styles[activeConversation.tone]}`}>{activeConversation.initials}</span>
                                )}
                                <h2>{activeConversation.name}</h2>
                                <p>{"members" in activeConversation && activeConversation.members
                                    ? `${activeConversation.members.map((member) => member.name.split(" ")[0]).join(", ")} and you are in this conversation.`
                                    : "This is the beginning of your conversation. Good place to start."}</p>
                            </div>
                            <div className={styles.dateDivider}><span>Today</span></div>
                            {directMessages.map((message, index, allMessages) => {
                                const grouped = index > 0 && allMessages[index - 1].author === message.author;
                                const repliedMessage = message.replyToId ? directMessages.find((item) => item.id === message.replyToId) : undefined;
                                const isEditing = editingMessage?.scope === "direct" && editingMessage.messageId === message.id;
                                return (
                                    <div data-message-key={`direct-${message.id}`} key={message.id} className={`${styles.messageRow} ${message.author === "me" ? styles.myMessage : ""} ${grouped ? styles.groupedMessage : ""} ${highlightedMessage === `direct-${message.id}` ? styles.highlightedMessage : ""}`}>
                                        {message.author === "them" && !grouped ? <span className={`${styles.messageAvatar} ${styles[activeConversation.tone]}`}>{activeConversation.initials}</span> : <span className={styles.avatarSpace} />}
                                        <div className={styles.messageBubble}>
                                            <MessageActions
                                                canManage={message.author === "me"}
                                                onDelete={() => deleteMessage("direct", message.id)}
                                                onEdit={() => startEditingMessage("direct", message.id, message.text)}
                                                onReact={(emoji) => toggleMessageReaction("direct", message.id, emoji)}
                                                onReply={() => { setReplyingTo({ scope: "direct", messageId: message.id }); setEditingMessage(null); }}
                                            />
                                            {!grouped && <span><strong>{message.author === "me" ? "You" : activeConversation.name}</strong><time>{message.time}</time></span>}
                                            {message.replyToId && (
                                                <button type="button" className={styles.messageReplyPreview} onClick={() => setReplyingTo({ scope: "direct", messageId: message.replyToId! })}>
                                                    <strong>{repliedMessage ? (repliedMessage.author === "me" ? "You" : activeConversation.name) : "Original message removed"}</strong>
                                                    {repliedMessage && <span>{repliedMessage.text}</span>}
                                                </button>
                                            )}
                                            {isEditing ? (
                                                <form className={styles.messageEditForm} onSubmit={saveEditedMessage}>
                                                    <input autoFocus value={editDraft} onChange={(event) => setEditDraft(event.target.value)} aria-label="Edit message" />
                                                    <button type="button" onClick={() => setEditingMessage(null)}>Cancel</button>
                                                    <button type="submit" disabled={!editDraft.trim()}>Save</button>
                                                </form>
                                            ) : (
                                                <p>{message.text}{message.edited && <small>edited</small>}</p>
                                            )}
                                            {!!message.reactions?.length && (
                                                <div className={styles.messageReactions}>
                                                    {message.reactions.map((reaction) => (
                                                        <button key={reaction.emoji} type="button" className={reaction.reacted ? styles.reacted : ""} onClick={() => toggleMessageReaction("direct", message.id, reaction.emoji)} aria-label={`${reaction.reacted ? "Remove" : "Add"} ${reaction.emoji} reaction`}>
                                                            <span>{reaction.emoji}</span><small>{reaction.count}</small>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <form className={styles.composer} onSubmit={sendMessage}>
                            {directReplyTarget && (
                                <div className={styles.composerContext}>
                                    <span>Replying to <strong>{directReplyTarget.author === "me" ? "yourself" : activeConversation.name}</strong><small>{directReplyTarget.text}</small></span>
                                    <button type="button" onClick={() => setReplyingTo(null)} aria-label="Cancel reply"><X /></button>
                                </div>
                            )}
                            <button type="button" aria-label="Attach a file"><Paperclip /></button>
                            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${activeConversation.name}`} />
                            <button type="button" className={styles.mobileOptionalAction} aria-label="Add an image"><ImagePlus /></button>
                            <div className={styles.emojiPickerWrap} ref={emojiTarget === "direct" ? emojiPickerRef : undefined}>
                                <button type="button" className={emojiPickerOpen && emojiTarget === "direct" ? styles.activeEmojiButton : ""} aria-label="Add emoji" aria-expanded={emojiPickerOpen && emojiTarget === "direct"} onClick={() => toggleEmojiPicker("direct")}><Smile /></button>
                                {emojiPickerOpen && emojiTarget === "direct" && <EmojiPicker onSelect={insertTextEmoji} />}
                            </div>
                            <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={!draft.trim()}><Send /></button>
                        </form>
                    </section>
                ) : (
                    <section className={`${styles.chatPanel} ${styles.communityChatPanel} ${membersPanelOpen ? styles.membersOpen : ""}`}>
                        <header className={styles.chatHeader}>
                            <button type="button" className={styles.mobileBack} onClick={() => setMobilePanel("list")} aria-label="Back to rooms"><ArrowLeft /></button>
                            <span className={styles.roomIcon}>{selectedRoomKind === "voice" ? <Headphones /> : <Hash />}</span>
                            <div><strong>{selectedRoom}</strong><span>{activeCommunity?.name} · {selectedCategory?.label}</span></div>
                            <div className={styles.chatActions}>
                                {selectedRoomKind === "text" && <MessageSearch
                                    contextLabel={`#${selectedRoom}`}
                                    isOpen={messageSearchOpen}
                                    query={messageSearchQuery}
                                    results={messageSearchResults}
                                    setIsOpen={setMessageSearchOpen}
                                    setQuery={setMessageSearchQuery}
                                    onSelect={openMessageSearchResult}
                                />}
                                <button type="button" className={membersPanelOpen ? styles.activeChatAction : ""} aria-label="Show room members" aria-expanded={membersPanelOpen} onClick={() => { setMembersPanelOpen((open) => !open); setRoomMenuOpen(false); }}><UsersRound /></button>
                                <div className={styles.roomMenuWrap} ref={roomMenuRef}>
                                    <button type="button" className={roomMenuOpen ? styles.activeChatAction : ""} aria-label="Room options" aria-expanded={roomMenuOpen} onClick={() => { setRoomMenuOpen((open) => !open); setMembersPanelOpen(false); }}><MoreHorizontal /></button>
                                    {roomMenuOpen && (
                                        <div className={styles.roomOptionsMenu}>
                                            <div><strong>{selectedRoomKind === "text" ? "#" : ""}{selectedRoom}</strong><small>{selectedCategory?.label}</small></div>
                                            {canManageRooms && <button type="button" onClick={openRoomSettings}><Pencil /> Edit room</button>}
                                            <button type="button" onClick={toggleRoomMuted}>{roomIsMuted ? <Bell /> : <BellOff />} {roomIsMuted ? "Unmute room" : "Mute room"}</button>
                                            <button type="button" onClick={copyRoomLink}><Clipboard /> {roomLinkCopied ? "Link copied" : "Copy room link"}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>
                            <aside className={`${styles.membersPanel} ${membersPanelOpen ? styles.membersPanelVisible : ""}`} aria-label={`Members in ${selectedRoom}`} aria-hidden={!membersPanelOpen} inert={!membersPanelOpen}>
                                <header><div><span>{selectedRoomKind === "text" ? "#" : ""}{selectedRoom}</span><strong>{selectedRoomKind === "voice" ? "Listening now" : "Members"}</strong></div><button type="button" onClick={() => setMembersPanelOpen(false)} aria-label="Close members"><X /></button></header>
                                <div className={styles.memberSummary}><span>{roomMembers.filter((member) => member.status === "online").length}</span><p><strong>People nearby</strong><small>{selectedRoomKind === "voice" ? "Currently in this voice room" : "Can read and join this conversation"}</small></p></div>
                                {(["online", "offline"] as const).map((status) => {
                                    const members = roomMembers.filter((member) => member.status === status);
                                    if (!members.length) return null;
                                    return (
                                        <section key={status}>
                                            <span>{status} — {members.length}</span>
                                            {members.map((member) => {
                                                const memberRoles = activeRoles.filter((role) => member.roleIds.includes(role.id) && role.id !== "member");
                                                const visibleRole = memberRoles[0];
                                                return (
                                                    <button type="button" key={member.id} onClick={() => setSelectedMemberId(member.id)}>
                                                        <i className={`${styles.memberAvatar} ${styles[member.tone]} ${member.status === "offline" ? styles.offlineMember : ""}`}>{member.initials}<b /></i>
                                                        <span><strong>{member.name}</strong><small>{member.activity}</small></span>
                                                        {visibleRole && <em style={{ color: visibleRole.color, borderColor: visibleRole.color }}>{visibleRole.name}{memberRoles.length > 1 ? ` +${memberRoles.length - 1}` : ""}</em>}
                                                    </button>
                                                );
                                            })}
                                        </section>
                                    );
                                })}
                            </aside>
                        <div className={`${styles.messageArea} ${styles.communityRoom}`} ref={messageAreaRef}>
                            <div className={styles.roomWelcome}>
                                <span>{selectedRoomKind === "voice" ? <Headphones /> : <Hash />}</span>
                                <small>{selectedRoomKind === "voice" ? "Voice room" : "Welcome to"}</small>
                                <h2>{selectedRoomKind === "text" && "#"}{selectedRoom}</h2>
                                <p>{selectedRoomKind === "voice"
                                    ? `Drop in when you feel like talking with people from ${activeCommunity?.name}.`
                                    : `The shared room for ${activeCommunity?.name}. Plans, ideas, and everything in between land here.`}</p>
                            </div>
                            {selectedRoomKind === "text" ? (
                                <>
                                    {activeRoomMessages.map((message) => {
                                        const repliedMessage = message.replyToId ? activeRoomMessages.find((item) => item.id === message.replyToId) : undefined;
                                        const isEditing = editingMessage?.scope === "room" && editingMessage.messageId === message.id;
                                        return (
                                            <div data-message-key={`room-${message.id}`} key={message.id} className={`${styles.communityMessage} ${highlightedMessage === `room-${message.id}` ? styles.highlightedMessage : ""}`}>
                                                <button type="button" className={`${styles.communityMessageAvatar} ${styles[message.tone]}`} onClick={() => setSelectedMemberId(message.authorId)} aria-label={`Open ${message.authorName}'s profile`}>{message.initials}</button>
                                                <div>
                                                    <MessageActions
                                                        canInteract={canSendRoomMessages}
                                                        canManage={message.authorId === "current-user"}
                                                        onDelete={() => deleteMessage("room", message.id)}
                                                        onEdit={() => startEditingMessage("room", message.id, message.text)}
                                                        onReact={(emoji) => toggleMessageReaction("room", message.id, emoji)}
                                                        onReply={() => { setReplyingTo({ scope: "room", messageId: message.id }); setEditingMessage(null); }}
                                                    />
                                                    <span><button type="button" className={styles.communityMemberName} onClick={() => setSelectedMemberId(message.authorId)}>{message.authorName}</button><time>{message.time}</time></span>
                                                    {message.replyToId && (
                                                        <button type="button" className={styles.messageReplyPreview} onClick={() => setReplyingTo({ scope: "room", messageId: message.replyToId! })} disabled={!canSendRoomMessages}>
                                                            <strong>{repliedMessage?.authorName ?? "Original message removed"}</strong>
                                                            {repliedMessage && <span>{repliedMessage.text}</span>}
                                                        </button>
                                                    )}
                                                    {isEditing ? (
                                                        <form className={styles.messageEditForm} onSubmit={saveEditedMessage}>
                                                            <input autoFocus value={editDraft} onChange={(event) => setEditDraft(event.target.value)} aria-label="Edit message" />
                                                            <button type="button" onClick={() => setEditingMessage(null)}>Cancel</button>
                                                            <button type="submit" disabled={!editDraft.trim()}>Save</button>
                                                        </form>
                                                    ) : (
                                                        <p>{message.text}{message.edited && <small>edited</small>}</p>
                                                    )}
                                                    {!!message.reactions?.length && (
                                                        <div className={styles.messageReactions}>
                                                            {message.reactions.map((reaction) => (
                                                                <button key={reaction.emoji} type="button" className={reaction.reacted ? styles.reacted : ""} onClick={() => toggleMessageReaction("room", message.id, reaction.emoji)} aria-label={`${reaction.reacted ? "Remove" : "Add"} ${reaction.emoji} reaction`} disabled={!canSendRoomMessages}>
                                                                    <span>{reaction.emoji}</span><small>{reaction.count}</small>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <div className={styles.voiceRoomCard}>
                                    <div><span className={`${styles.personAvatar} ${styles.coral}`}>MC<i /></span><span className={`${styles.personAvatar} ${styles.amber}`}>JM<i /></span></div>
                                    <div><strong>A quiet room for an easy conversation.</strong><small>Join whenever you’re ready — no call needed.</small></div>
                                    <button type="button" disabled={!canJoinVoice} onClick={() => {
                                        if (!activeCommunity || !canJoinVoice) return;
                                        setJoinedVoiceRoom({ communityId: activeCommunity.id, room: selectedRoom });
                                        setMicrophoneMuted(false);
                                        setVoiceSoundMuted(false);
                                    }}><Headphones /> {canJoinVoice ? "Join room" : "No access"}</button>
                                </div>
                            )}
                        </div>
                        <form className={`${styles.composer} ${!canSendRoomMessages ? styles.composerDenied : ""}`} onSubmit={sendRoomMessage}>
                            {roomReplyTarget && (
                                <div className={styles.composerContext}>
                                    <span>Replying to <strong>{roomReplyTarget.authorName}</strong><small>{roomReplyTarget.text}</small></span>
                                    <button type="button" onClick={() => setReplyingTo(null)} aria-label="Cancel reply"><X /></button>
                                </div>
                            )}
                            <button type="button" aria-label="Attach a file" disabled={!canSendRoomMessages}><Paperclip /></button>
                            <input value={roomDraft} onChange={(event) => setRoomDraft(event.target.value)} placeholder={canSendRoomMessages ? `Message #${selectedRoom}` : "You do not have permission to send messages here"} disabled={!canSendRoomMessages} />
                            <div className={styles.emojiPickerWrap} ref={emojiTarget === "room" ? emojiPickerRef : undefined}>
                                <button type="button" className={emojiPickerOpen && emojiTarget === "room" ? styles.activeEmojiButton : ""} aria-label="Add emoji" aria-expanded={emojiPickerOpen && emojiTarget === "room"} onClick={() => toggleEmojiPicker("room")} disabled={!canSendRoomMessages}><Smile /></button>
                                {emojiPickerOpen && emojiTarget === "room" && <EmojiPicker onSelect={insertTextEmoji} />}
                            </div>
                            <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={!canSendRoomMessages || !roomDraft.trim()}><Send /></button>
                        </form>
                    </section>
                )}
            </div>

            {/* Dialogs stay at the page root so their backdrops cover the full app. */}
            {newMessageOpen && (
                <NewMessageDialog
                    friends={newMessageFriends}
                    groupName={groupName}
                    mode={newMessageMode}
                    query={newMessageQuery}
                    selectedFriendIds={selectedFriends}
                    setGroupName={setGroupName}
                    setMode={setNewMessageMode}
                    setQuery={setNewMessageQuery}
                    setSelectedFriendIds={setSelectedFriends}
                    onClose={() => setNewMessageOpen(false)}
                    onCreate={createConversation}
                />
            )}

            {createCommunityOpen && (
                <CommunityDialog
                    draft={communityDraft}
                    mode="create"
                    setDraft={setCommunityDraft}
                    onClose={() => setCreateCommunityOpen(false)}
                    onSubmit={createCommunity}
                />
            )}

            {inviteDialogOpen && activeCommunity && (
                <InviteMembersDialog
                    community={activeCommunity}
                    friends={inviteCandidates}
                    invitedFriendIds={activeInvitedFriendIds}
                    inviteUrl={activeInviteUrl}
                    isLinkCopied={inviteLinkCopied}
                    query={inviteQuery}
                    setQuery={setInviteQuery}
                    onClose={() => setInviteDialogOpen(false)}
                    onCopyLink={copyInviteLink}
                    onRegenerateLink={regenerateInviteLink}
                    onToggleInvite={toggleCommunityInvitation}
                />
            )}

            {communitySettingsOpen && activeCommunity && (
                <CommunityDialog
                    canManageCommunity={canManageCommunity}
                    canManageRoles={canManageRoles}
                    canViewModerationLog={canViewModerationLog}
                    communityName={activeCommunity.name}
                    draft={settingsDraft}
                    mode="edit"
                    username={DEMO_USER.username}
                    onManageRoles={openRolesManager}
                    onOpenModerationLog={openModerationLog}
                    setDraft={setSettingsDraft}
                    onClose={() => setCommunitySettingsOpen(false)}
                    onSubmit={saveCommunitySettings}
                />
            )}

            {rolesDialogOpen && activeCommunity && canManageRoles && (
                <RolesPermissionsDialog
                    communityName={activeCommunity.name}
                    roles={activeRoles}
                    onBack={() => { setRolesDialogOpen(false); setCommunitySettingsOpen(true); }}
                    onClose={() => setRolesDialogOpen(false)}
                    onCreateRole={createCommunityRole}
                    onDeleteRole={deleteCommunityRole}
                    onUpdateRole={updateCommunityRole}
                />
            )}

            {moderationLogOpen && activeCommunity && canViewModerationLog && (
                <ModerationLogDialog
                    communityName={activeCommunity.name}
                    entries={activeModerationLogs}
                    onBack={() => { setModerationLogOpen(false); setCommunitySettingsOpen(true); }}
                    onClose={() => setModerationLogOpen(false)}
                />
            )}

            {selectedMember && (
                <MemberProfileDialog
                    canModerate={canModerateMembers}
                    displayName={selectedMember.name}
                    isCurrentUser={selectedMember.id === "current-user"}
                    member={selectedMember}
                    note={selectedMemberNote}
                    memberRoles={selectedMemberRoles}
                    roles={activeRoles}
                    onClose={() => setSelectedMemberId(null)}
                    onMessage={() => messageCommunityMember(selectedMember)}
                    onNoteChange={(note) => updateCommunityMemberNote(selectedMember.id, note)}
                    onRemove={() => removeCommunityMember(selectedMember.id)}
                    onToggleRole={(roleId) => toggleMemberRole(selectedMember.id, roleId)}
                />
            )}

            {groupMembersOpen && "members" in activeConversation && activeConversation.members && (
                <GroupMembersDialog
                    friends={friends}
                    groupName={activeConversation.name}
                    members={activeConversation.members}
                    onAddMember={addGroupMember}
                    onClose={() => setGroupMembersOpen(false)}
                    onRemoveMember={removeGroupMember}
                />
            )}

            {addFriendOpen && (
                <AddFriendDialog
                    candidates={availableFriendCandidates}
                    onAdd={addFriend}
                    onClose={() => setAddFriendOpen(false)}
                />
            )}

            {friendPendingRemoval && (
                <RemoveFriendDialog
                    friend={friendPendingRemoval}
                    onClose={() => setFriendRemovalId(null)}
                    onConfirm={removeFriend}
                />
            )}

            {channelCreatorOpen && activeCommunity && canManageRooms && (
                <ChannelDialog
                    categories={activeCommunity.categories}
                    categoryId={channelCategory}
                    communityName={activeCommunity.name}
                    name={channelName}
                    roomKind={channelType}
                    setCategoryId={setChannelCategory}
                    setName={setChannelName}
                    setRoomKind={setChannelType}
                    onClose={() => setChannelCreatorOpen(false)}
                    onSubmit={createChannel}
                />
            )}

            {categoryCreatorOpen && activeCommunity && canManageRooms && (
                <CategoryDialog
                    communityName={activeCommunity.name}
                    name={categoryName}
                    setName={setCategoryName}
                    onClose={() => setCategoryCreatorOpen(false)}
                    onSubmit={createCategory}
                />
            )}

            {roomSettingsOpen && activeCommunity && canManageRooms && (
                <RoomSettingsDialog
                    categories={activeCommunity.categories}
                    communityName={activeCommunity.name}
                    currentCategoryLabel={selectedCategory?.label}
                    name={roomSettingsName}
                    roomKind={selectedRoomKind}
                    targetCategoryId={roomSettingsCategory}
                    setName={setRoomSettingsName}
                    setTargetCategoryId={setRoomSettingsCategory}
                    onClose={() => setRoomSettingsOpen(false)}
                    onSubmit={saveRoomSettings}
                />
            )}
        </main>
    );
}
