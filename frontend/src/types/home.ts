import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import type { UserAccount } from "./user";

export type CommunityTone = "coral" | "amber" | "rose" | "brown" | "sage" | "plum" | "ocean" | "mint";
export type CommunityVisibility = "private" | "public";
export type RoomKind = "text" | "voice";
export type FriendStatus = "online" | "offline";
export type FriendFilter = "all" | FriendStatus;
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
    | "sendMessages"
    | "joinVoice";
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
    onDelete: () => void;
    onEdit: () => void;
    onReact: (emoji: string) => void;
    onReply: () => void;
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

export interface HomeHeaderProps {
    activeSpace: string;
    communities: Community[];
    isProfileMenuOpen: boolean;
    profileMenuRef: RefObject<HTMLDivElement | null>;
    user: UserAccount;
    onCreateCommunity: () => void;
    onOpenCommunity: (communityId: string) => void;
    onOpenMessages: () => void;
    onToggleProfileMenu: () => void;
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
    communityName?: string;
    draft: CommunitySettingsDraft;
    mode: "create" | "edit";
    username?: string;
    onManageRoles?: () => void;
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

export interface RoomSettingsDialogProps {
    categories: RoomCategory[];
    communityName: string;
    currentCategoryLabel?: string;
    name: string;
    roomKind: RoomKind;
    targetCategoryId: string;
    setName: StateSetter<string>;
    setTargetCategoryId: StateSetter<string>;
    onClose: () => void;
    onSubmit: (event: FormEvent) => void;
}
