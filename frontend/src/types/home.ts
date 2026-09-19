import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import type { UserAccount } from "./user";

export type CommunityTone = "coral" | "amber" | "rose" | "brown";
export type CommunityVisibility = "private" | "public";
export type RoomKind = "text" | "voice";
export type FriendStatus = "online" | "offline";
export type FriendFilter = "all" | FriendStatus;
export type MessageAuthor = "me" | "them";
export type MessageView = "chat" | "friends";
export type MobilePanel = "list" | "chat";
export type NewMessageMode = "direct" | "group";
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

export interface Conversation {
    id: string;
    name: string;
    initials: string;
    preview: string;
    time: string;
    status?: string;
    unread?: number;
    tone: string;
    members?: PersonSummary[];
}

export interface ChatMessage {
    id: number;
    author: MessageAuthor;
    text: string;
    time: string;
}

export interface Friend extends PersonSummary {
    id: string;
    status: FriendStatus;
    activity: string;
}

export interface CommunityMember extends PersonSummary {
    role: string;
    status: FriendStatus;
    activity: string;
}

export interface CommunityDraft {
    name: string;
    description: string;
    tone: CommunityTone;
    visibility: CommunityVisibility;
}

export interface CommunitySettingsDraft extends CommunityDraft {
    allowInvites: boolean;
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
    setDraft: StateSetter<CommunitySettingsDraft>;
    onClose: () => void;
    onSubmit: (event: FormEvent) => void;
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
