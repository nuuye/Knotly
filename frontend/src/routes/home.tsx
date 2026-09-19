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
    UsersRound,
    Video,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AudioWave } from "../components/home/AudioWave";
import { GroupAvatar } from "../components/home/GroupAvatar";
import { HomeHeader } from "../components/home/HomeHeader";
import { CategoryDialog } from "../components/home/dialogs/CategoryDialog";
import { ChannelDialog } from "../components/home/dialogs/ChannelDialog";
import { CommunityDialog } from "../components/home/dialogs/CommunityDialog";
import { NewMessageDialog } from "../components/home/dialogs/NewMessageDialog";
import { RoomSettingsDialog } from "../components/home/dialogs/RoomSettingsDialog";
import {
    COMMUNITY_MEMBERS,
    EMPTY_COMMUNITY_DRAFT,
    FRIENDS,
    INITIAL_COMMUNITIES,
    INITIAL_CONVERSATIONS,
    INITIAL_MESSAGES,
} from "../data/home";
import { useDismissableLayer } from "../hooks/useDismissableLayer";
import { DEMO_USER } from "../data/user";
import type {
    Community,
    CommunitySettingsDraft,
    FriendFilter,
    JoinedVoiceRoom,
    MessageView,
    MobilePanel,
    NewMessageMode,
    RoomKind,
} from "../types/home";
import { getInitials, getUsernameMark, toSlug } from "../utils/text";
import styles from "./home.module.scss";

export const Route = createFileRoute("/home")({
    component: HomePage,
});

/** Runs the signed-in app demo with messages, communities, rooms, and voice state. */
function HomePage() {
    // Main navigation and community data.
    const [activeSpace, setActiveSpace] = useState("messages");
    const [communities, setCommunities] = useState(INITIAL_COMMUNITIES);
    const [communityDisplayNames, setCommunityDisplayNames] = useState<Record<string, string>>({});
    const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState("maya");
    const [selectedRoom, setSelectedRoom] = useState("general");
    const [selectedRoomKind, setSelectedRoomKind] = useState<RoomKind>("text");
    // Private messages, friends, and mobile panel state.
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState("");
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
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

    // Fall back to a friend or the first conversation if a new ID has no full record yet.
    const activeConversation = conversations.find((conversation) => conversation.id === selectedConversation)
        ?? FRIENDS.find((friend) => friend.id === selectedConversation)
        ?? conversations[0];
    const activeCommunity = communities.find((community) => community.id === activeSpace);
    // Rebuild the visible conversation list only when the source or search changes.
    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return conversations;
        return conversations.filter((conversation) => conversation.name.toLowerCase().includes(normalizedQuery));
    }, [conversations, query]);
    const filteredFriends = FRIENDS.filter((friend) => friendFilter === "all" || friend.status === friendFilter);
    const newMessageFriends = FRIENDS.filter((friend) => friend.name.toLowerCase().includes(newMessageQuery.trim().toLowerCase()));
    // Find which category owns the room currently shown in the main panel.
    const selectedCategory = activeCommunity?.categories.find((category) => (
        selectedRoomKind === "text" ? category.textRooms : category.voiceRooms
    ).includes(selectedRoom));
    const activeRoomKey = `${activeSpace}:${selectedRoomKind}:${selectedRoom}`;
    const roomIsMuted = mutedRooms.includes(activeRoomKey);
    const localDisplayName = activeCommunity ? communityDisplayNames[activeCommunity.id]?.trim() : "";
    const currentCommunityDisplayName = localDisplayName || `@${DEMO_USER.username}`;
    const currentCommunityInitials = localDisplayName ? getInitials(localDisplayName, "U") : getUsernameMark(DEMO_USER.username);
    const communityMembers = COMMUNITY_MEMBERS.map((member, index) => index === 0
        ? { ...member, name: currentCommunityDisplayName, initials: currentCommunityInitials }
        : member);
    const roomMembers = selectedRoomKind === "voice" ? communityMembers.slice(0, 3) : communityMembers;
    const joinedVoiceCommunity = communities.find((community) => community.id === joinedVoiceRoom?.communityId);

    useDismissableLayer(profileMenuOpen, profileMenuRef, setProfileMenuOpen);
    useDismissableLayer(roomMenuOpen, roomMenuRef, setRoomMenuOpen);

    // Return to private messages and reset community-only panels.
    const openMessages = () => {
        setActiveSpace("messages");
        setMessageView("chat");
        setMobilePanel("list");
        setMembersPanelOpen(false);
        setRoomMenuOpen(false);
    };

    // Open a community on its default text room.
    const openCommunity = (communityId: string) => {
        setActiveSpace(communityId);
        setSelectedRoom("general");
        setSelectedRoomKind("text");
        setMobilePanel("list");
        setMembersPanelOpen(false);
        setRoomMenuOpen(false);
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
        if (!activeCommunity || !name) return;

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
        setCommunityDisplayNames((current) => {
            const next = { ...current };
            const localName = settingsDraft.localDisplayName.trim();
            if (localName) next[activeCommunity.id] = localName;
            else delete next[activeCommunity.id];
            return next;
        });
        setCommunitySettingsOpen(false);
    };

    // Open the room form with the type and category chosen by the clicked button.
    const openChannelCreator = (type: "text" | "voice", categoryId = activeCommunity?.categories[0]?.id ?? "start-here") => {
        setChannelType(type);
        setChannelCategory(categoryId);
        setChannelName("");
        setChannelCreatorOpen(true);
    };

    // Add a text or voice room without changing the original nested arrays.
    const createChannel = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity) return;
        const roomName = toSlug(channelName);
        if (!roomName) return;

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
        if (channelType === "voice") {
            setJoinedVoiceRoom({ communityId: activeCommunity.id, room: roomName });
            setMicrophoneMuted(false);
            setVoiceSoundMuted(false);
            setMobilePanel("list");
        } else {
            setSelectedRoom(roomName);
            setSelectedRoomKind("text");
            setMobilePanel("chat");
        }
        setChannelCreatorOpen(false);
    };

    // Add an empty category that can later hold both text and voice rooms.
    const createCategory = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity) return;
        const label = categoryName.trim();
        const id = toSlug(label);
        if (!label || !id) return;

        setCommunities((current) => current.map((community) => community.id === activeCommunity.id && !community.categories.some((category) => category.id === id)
            ? { ...community, categories: [...community.categories, { id, label, textRooms: [], voiceRooms: [] }] }
            : community));
        setChannelCategory(id);
        setCategoryCreatorOpen(false);
        setCategoryName("");
    };

    // Fill the edit form with the room and category currently on screen.
    const openRoomSettings = () => {
        setRoomSettingsName(selectedRoom);
        setRoomSettingsCategory(selectedCategory?.id ?? activeCommunity?.categories[0]?.id ?? "");
        setRoomMenuOpen(false);
        setRoomSettingsOpen(true);
    };

    // Rename or move a room by removing it first, then adding it to its target category.
    const saveRoomSettings = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity || !selectedCategory) return;
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
                { id: Date.now(), author: "me", text, time: "now" },
            ],
        }));
        setDraft("");
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
        const chosenFriends = FRIENDS.filter((friend) => selectedFriends.includes(friend.id));
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
                                    <span><UsersRound /></span><div><strong>Friends</strong><small>12 people online</small></div><ChevronDown />
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
                                <button type="button" aria-label="Community settings" onClick={openCommunitySettings}><MoreHorizontal /></button>
                            </div>

                            <div className={styles.roomNavigation}>
                                {activeCommunity?.categories.map((category) => (
                                    <section key={category.id}>
                                        <span>{category.label}<button type="button" className={styles.sectionAdd} onClick={() => openChannelCreator("text", category.id)} aria-label={`Add a room to ${category.label}`}><Plus /></button></span>
                                        {category.textRooms.map((room) => (
                                            <button
                                                key={room}
                                                type="button"
                                                className={selectedRoom === room && selectedRoomKind === "text" ? styles.selectedRoom : ""}
                                                onClick={() => {
                                                    setSelectedRoom(room);
                                                    setSelectedRoomKind("text");
                                                    setMobilePanel("chat");
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
                                                    setJoinedVoiceRoom({ communityId: activeCommunity.id, room });
                                                    setMicrophoneMuted(false);
                                                    setVoiceSoundMuted(false);
                                                    setRoomMenuOpen(false);
                                                }}
                                                aria-label={`Join ${room}`}
                                            >
                                                <Headphones /> {room}<small>{joinedVoiceRoom?.communityId === activeCommunity.id && joinedVoiceRoom.room === room ? "Joined" : "Join"}</small>
                                            </button>
                                            {room === "cozy-corner" && activeCommunity?.id === "saturday" && (
                                                <>
                                                    <div className={styles.voicePeople}><i className={styles.coral}>MC</i><span>Maya is talking<AudioWave /></span></div>
                                                    <div className={styles.voicePeople}><i className={styles.amber}>JM</i><span>Jules</span></div>
                                                </>
                                            )}
                                            {joinedVoiceRoom?.communityId === activeCommunity.id && joinedVoiceRoom.room === room && (
                                                <div className={`${styles.voicePeople} ${styles.currentVoiceUser}`}><i className={styles.brown}>{currentCommunityInitials}</i><span>{currentCommunityDisplayName} {microphoneMuted && <MicOff aria-label="Microphone muted" />}</span></div>
                                            )}
                                            </div>
                                        ))}
                                    </section>
                                ))}
                                <button type="button" className={styles.addCategoryButton} onClick={() => { setCategoryName(""); setCategoryCreatorOpen(true); }}><FolderPlus /> New category</button>
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
                            <button type="button" className={styles.addFriendButton} onClick={() => openNewMessage()}><UserPlus /> New message</button>
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
                                                            onClick={() => {
                                                                setSelectedConversation(friend.id);
                                                                setMessageView("chat");
                                                            }}
                                                        >
                                                            <MessageCircleMore />
                                                        </button>
                                                        <button type="button" aria-label={`More options for ${friend.name}`}><MoreHorizontal /></button>
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
                                <button type="button" aria-label="Conversation options"><MoreHorizontal /></button>
                            </div>
                        </header>

                        <div className={styles.messageArea}>
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
                            {(messages[selectedConversation] ?? []).map((message, index, allMessages) => {
                                const grouped = index > 0 && allMessages[index - 1].author === message.author;
                                return (
                                    <div key={message.id} className={`${styles.messageRow} ${message.author === "me" ? styles.myMessage : ""} ${grouped ? styles.groupedMessage : ""}`}>
                                        {message.author === "them" && !grouped ? <span className={`${styles.messageAvatar} ${styles[activeConversation.tone]}`}>{activeConversation.initials}</span> : <span className={styles.avatarSpace} />}
                                        <div className={styles.messageBubble}>
                                            {!grouped && <span><strong>{message.author === "me" ? "You" : activeConversation.name}</strong><time>{message.time}</time></span>}
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <form className={styles.composer} onSubmit={sendMessage}>
                            <button type="button" aria-label="Attach a file"><Paperclip /></button>
                            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${activeConversation.name}`} />
                            <button type="button" aria-label="Add an image"><ImagePlus /></button>
                            <button type="button" aria-label="Add emoji"><Smile /></button>
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
                                <button type="button" className={membersPanelOpen ? styles.activeChatAction : ""} aria-label="Show room members" aria-expanded={membersPanelOpen} onClick={() => { setMembersPanelOpen((open) => !open); setRoomMenuOpen(false); }}><UsersRound /></button>
                                <div className={styles.roomMenuWrap} ref={roomMenuRef}>
                                    <button type="button" className={roomMenuOpen ? styles.activeChatAction : ""} aria-label="Room options" aria-expanded={roomMenuOpen} onClick={() => { setRoomMenuOpen((open) => !open); setMembersPanelOpen(false); }}><MoreHorizontal /></button>
                                    {roomMenuOpen && (
                                        <div className={styles.roomOptionsMenu}>
                                            <div><strong>{selectedRoomKind === "text" ? "#" : ""}{selectedRoom}</strong><small>{selectedCategory?.label}</small></div>
                                            <button type="button" onClick={openRoomSettings}><Pencil /> Edit room</button>
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
                                            {members.map((member) => (
                                                <button type="button" key={member.name}>
                                                    <i className={`${styles.memberAvatar} ${styles[member.tone]} ${member.status === "offline" ? styles.offlineMember : ""}`}>{member.initials}<b /></i>
                                                    <span><strong>{member.name}</strong><small>{member.activity}</small></span>
                                                    {member.role !== "Member" && <em>{member.role}</em>}
                                                </button>
                                            ))}
                                        </section>
                                    );
                                })}
                            </aside>
                        <div className={`${styles.messageArea} ${styles.communityRoom}`}>
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
                                    <div className={styles.communityMessage}><i className={styles.coral}>MC</i><div><span><strong>Maya Chen</strong><time>09:42</time></span><p>Morning! I left the weekend notes here so everyone can add to them.</p></div></div>
                                    <div className={styles.communityMessage}><i className={styles.amber}>JM</i><div><span><strong>Jules Martin</strong><time>10:03</time></span><p>Perfect. I’ll bring the playlist and absolutely no sensible song transitions.</p></div></div>
                                </>
                            ) : (
                                <div className={styles.voiceRoomCard}>
                                    <div><span className={`${styles.personAvatar} ${styles.coral}`}>MC<i /></span><span className={`${styles.personAvatar} ${styles.amber}`}>JM<i /></span></div>
                                    <div><strong>A quiet room for an easy conversation.</strong><small>Join whenever you’re ready — no call needed.</small></div>
                                    <button type="button"><Headphones /> Join room</button>
                                </div>
                            )}
                        </div>
                        <form className={styles.composer} onSubmit={(event) => event.preventDefault()}>
                            <button type="button" aria-label="Attach a file"><Paperclip /></button>
                            <input placeholder={`Message #${selectedRoom}`} />
                            <button type="button" aria-label="Add emoji"><Smile /></button>
                            <button type="submit" className={styles.sendButton} aria-label="Send message"><Send /></button>
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

            {communitySettingsOpen && activeCommunity && (
                <CommunityDialog
                    communityName={activeCommunity.name}
                    draft={settingsDraft}
                    mode="edit"
                    username={DEMO_USER.username}
                    setDraft={setSettingsDraft}
                    onClose={() => setCommunitySettingsOpen(false)}
                    onSubmit={saveCommunitySettings}
                />
            )}

            {channelCreatorOpen && activeCommunity && (
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

            {categoryCreatorOpen && activeCommunity && (
                <CategoryDialog
                    communityName={activeCommunity.name}
                    name={categoryName}
                    setName={setCategoryName}
                    onClose={() => setCategoryCreatorOpen(false)}
                    onSubmit={createCategory}
                />
            )}

            {roomSettingsOpen && activeCommunity && (
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
