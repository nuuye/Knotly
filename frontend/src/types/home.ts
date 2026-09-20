import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import type { UserAccount } from "./user";

export type CommunityTone = "coral" | "amber" | "rose" | "brown" | "sage" | "plum" | "ocean" | "mint";
export type CommunityVisibility = "private" | "public";
export type RoomKind = "text" | "voice";
export type FriendStatus = "online" | "offline";
export type FriendFilter = "all" | FriendStatus;
export type FriendsView = "friends" | "requests";
export type FriendRequestDirection = "received" | "sent";
export type MessageAuthor = "me" | "them";
export type MessageView = "chat" | "friends";
export type MobilePanel = "list" | "chat";
export type NewMessageMode = "direct" | "group";
export type PermissionKey =
    | "manageCommunity"
    | "manageRooms"
    | "manageRoles"
    | "inviteMembers"
    | "moderateMembers"
    | "viewModerationLog"
    | "sendMessages"
    | "joinVoice";
export type ModerationLogCategory = "community" | "invites" | "members" | "roles" | "rooms";
export type NotificationKind = "message" | "mention" | "friend" | "community";
export type NotificationFilter = "all" | "unread";
export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export interface RoomCategory {
    id: string;
    label: string;
    textRooms: string[];
    voiceRooms: string[];
}

export interface Community {
    id: string;
    name: string;
    initials: string;
    online: number;
    tone: CommunityTone;
    description: string;
    visibility: CommunityVisibility;
    allowInvites: boolean;
    categories: RoomCategory[];
}

export interface PersonSummary {
    name: string;
    initials: string;
    tone: string;
}

export interface GroupMember extends PersonSummary {
    id: string;
}

export interface Conversation {
    id: string;
    name: string;
    initials: string;
    preview: string;
    time: string;
    status?: string;
    unread?: number;
    tone: string;
    members?: GroupMember[];
}

export interface ChatMessage {
    id: number;
    author: MessageAuthor;
    text: string;
    time: string;
    edited?: boolean;
    reactions?: MessageReaction[];
    replyToId?: number;
}

export interface MessageReaction {
    emoji: string;
    count: number;
    reacted: boolean;
}

export interface RoomMessage {
    id: number;
    authorId: string;
    authorName: string;
    initials: string;
    tone: string;
    text: string;
    time: string;
    edited?: boolean;
    reactions?: MessageReaction[];
    replyToId?: number;
}

export interface Friend extends PersonSummary {
    id: string;
    status: FriendStatus;
    activity: string;
}

export interface FriendRequest {
    id: string;
    direction: FriendRequestDirection;
    person: Friend;
    sentAt: string;
}

export type NotificationTarget =
    | { type: "conversation"; conversationId: string }
    | { type: "friendRequests" }
    | { type: "room"; communityId: string; room: string };

export interface AppNotification {
    id: string;
    kind: NotificationKind;
    title: string;
    description: string;
    time: string;
    read: boolean;
    initials: string;
    tone: string;
    target: NotificationTarget;
}

export interface CommunityMember extends PersonSummary {
    id: string;
    username: string;
    bio: string;
    joinedAt: string;
    roleIds: string[];
    status: FriendStatus;
    activity: string;
}

export interface CommunityRole {
    id: string;
    name: string;
    color: string;
    permissions: PermissionKey[];
    protected: boolean;
}

export interface PermissionDefinition {
    id: PermissionKey;
    label: string;
    description: string;
}

export interface ModerationLogEntry {
    id: string;
    action: string;
    actor: string;
    category: ModerationLogCategory;
    detail: string;
    time: string;
}

export interface CommunityDraft {
    name: string;
    description: string;
    tone: CommunityTone;
    visibility: CommunityVisibility;
}

export interface CommunitySettingsDraft extends CommunityDraft {
    allowInvites: boolean;
    localDisplayName: string;
}

export interface JoinedVoiceRoom {
    communityId: string;
    room: string;
}

export interface GroupAvatarProps {
    compact?: boolean;
    large?: boolean;
    members: Array<Pick<PersonSummary, "initials" | "tone">>;
    total: number;
}

export interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
}

export interface MessageActionsProps {
    canManage: boolean;
    canInteract?: boolean;
    onDelete: () => void;
    onEdit: () => void;
    onReact: (emoji: string) => void;
    onReply: () => void;
}

export interface MessageSearchResult {
    author: string;
    id: number;
    scope: "direct" | "room";
    text: string;
    time: string;
}

export interface MessageSearchProps {
    contextLabel: string;
    isOpen: boolean;
    query: string;
    results: MessageSearchResult[];
    setIsOpen: StateSetter<boolean>;
    setQuery: StateSetter<string>;
    onSelect: (result: MessageSearchResult) => void;
}

export interface GroupMembersDialogProps {
    friends: Friend[];
    groupName: string;
    members: GroupMember[];
    onAddMember: (friendId: string) => void;
    onClose: () => void;
    onRemoveMember: (memberId: string) => void;
}

export interface AddFriendDialogProps {
    candidates: Friend[];
    onAdd: (friendId: string) => void;
    onClose: () => void;
}

export interface RemoveFriendDialogProps {
    friend: Friend;
    onClose: () => void;
    onConfirm: () => void;
}

export interface FriendsPanelProps {
    blockedUsers: Friend[];
    friendFilter: FriendFilter;
    friendMenuId: string | null;
    friendMenuOpen: boolean;
    friendMenuRef: RefObject<HTMLDivElement | null>;
    friendRequests: FriendRequest[];
    friends: Friend[];
    friendsView: FriendsView;
    onAcceptRequest: (requestId: string) => void;
    onAddFriend: () => void;
    onBlockRequest: (requestId: string) => void;
    onChangeFilter: (filter: FriendFilter) => void;
    onChangeView: (view: FriendsView) => void;
    onMessageFriend: (friend: Friend) => void;
    onMobileBack: () => void;
    onOpenRemoveFriend: (friendId: string) => void;
    onRemoveRequest: (requestId: string, direction: FriendRequestDirection) => void;
    onToggleFriendMenu: (friendId: string) => void;
    onUnblock: (friendId: string) => void;
}

export interface InviteMembersDialogProps {
    community: Pick<Community, "initials" | "name" | "tone">;
    friends: Friend[];
    invitedFriendIds: string[];
    inviteUrl: string;
    isLinkCopied: boolean;
    query: string;
    setQuery: StateSetter<string>;
    onClose: () => void;
    onCopyLink: () => void;
    onRegenerateLink: () => void;
    onToggleInvite: (friendId: string) => void;
}

export interface HomeHeaderProps {
    activeSpace: string;
    communities: Community[];
    isNotificationsOpen: boolean;
    isProfileMenuOpen: boolean;
    notifications: AppNotification[];
    notificationsRef: RefObject<HTMLDivElement | null>;
    profileMenuRef: RefObject<HTMLDivElement | null>;
    user: UserAccount;
    onCreateCommunity: () => void;
    onOpenCommunity: (communityId: string) => void;
    onOpenMessages: () => void;
    onMarkAllNotificationsRead: () => void;
    onOpenNotification: (notification: AppNotification) => void;
    onToggleNotifications: () => void;
    onToggleProfileMenu: () => void;
}

export interface NotificationCenterProps {
    notifications: AppNotification[];
    onMarkAllRead: () => void;
    onOpenNotification: (notification: AppNotification) => void;
}

export interface NewMessageDialogProps {
    friends: Friend[];
    groupName: string;
    mode: NewMessageMode;
    query: string;
    selectedFriendIds: string[];
    setGroupName: StateSetter<string>;
    setMode: StateSetter<NewMessageMode>;
    setQuery: StateSetter<string>;
    setSelectedFriendIds: StateSetter<string[]>;
    onClose: () => void;
    onCreate: () => void;
}

export interface CommunityDialogProps {
    canManageCommunity?: boolean;
    canManageRoles?: boolean;
    canViewModerationLog?: boolean;
    communityName?: string;
    draft: CommunitySettingsDraft;
    mode: "create" | "edit";
    username?: string;
    onManageRoles?: () => void;
    onOpenModerationLog?: () => void;
    setDraft: StateSetter<CommunitySettingsDraft>;
    onClose: () => void;
    onSubmit: (event: FormEvent) => void;
}

export interface RolesPermissionsDialogProps {
    communityName: string;
    roles: CommunityRole[];
    onClose: () => void;
    onBack: () => void;
    onCreateRole: () => string;
    onDeleteRole: (roleId: string) => void;
    onUpdateRole: (roleId: string, changes: Partial<Pick<CommunityRole, "name" | "color" | "permissions">>) => void;
}

export interface MemberProfileDialogProps {
    canModerate: boolean;
    displayName: string;
    isCurrentUser: boolean;
    member: CommunityMember;
    note: string;
    memberRoles: CommunityRole[];
    roles: CommunityRole[];
    onToggleRole: (roleId: string) => void;
    onClose: () => void;
    onMessage: () => void;
    onNoteChange: (note: string) => void;
    onRemove: () => void;
}

export interface ModerationLogDialogProps {
    communityName: string;
    entries: ModerationLogEntry[];
    onBack: () => void;
    onClose: () => void;
}

export interface ChannelDialogProps {
    categories: RoomCategory[];
    categoryId: string;
    communityName: string;
    name: string;
    roomKind: RoomKind;
    setCategoryId: StateSetter<string>;
    setName: StateSetter<string>;
    setRoomKind: StateSetter<RoomKind>;
    onClose: () => void;
    onSubmit: (event: FormEvent) => void;
}

export interface CategoryDialogProps {
    communityName: string;
    name: string;
    setName: StateSetter<string>;
    onClose: () => void;
    onSubmit: (event: FormEvent) => void;
}

export interface DeleteCategoryDialogProps {
    canDelete: boolean;
    category: RoomCategory;
    communityName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export interface RoomSettingsDialogProps {
    categories: RoomCategory[];
    communityName: string;
    currentCategoryLabel?: string;
    name: string;
    roomKind: RoomKind;
    targetCategoryId: string;
    canDelete: boolean;
    setName: StateSetter<string>;
    setTargetCategoryId: StateSetter<string>;
    onClose: () => void;
    onDelete: () => void;
    onSubmit: (event: FormEvent) => void;
}
