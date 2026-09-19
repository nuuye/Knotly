import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowLeft,
    Bell,
    BellOff,
    Check,
    ChevronDown,
    Clipboard,
    FolderPlus,
    Globe2,
    Hash,
    Headphones,
    ImagePlus,
    HelpCircle,
    LogOut,
    MessageCircleMore,
    MoreHorizontal,
    Paperclip,
    Pencil,
    Phone,
    PhoneOff,
    Plus,
    Search,
    Send,
    Settings,
    Smile,
    LockKeyhole,
    Mic,
    MicOff,
    UserPlus,
    UsersRound,
    Video,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import knotlyLogo from "../assets/knotly.png";
import styles from "./home.module.scss";

export const Route = createFileRoute("/home")({
    component: HomePage,
});

type CommunityTone = "coral" | "amber" | "rose" | "brown";
type CommunityVisibility = "private" | "public";

interface RoomCategory {
    id: string;
    label: string;
    textRooms: string[];
    voiceRooms: string[];
}

interface Community {
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

interface Conversation {
    id: string;
    name: string;
    initials: string;
    preview: string;
    time: string;
    status?: string;
    unread?: number;
    tone: string;
    members?: Array<{ name: string; initials: string; tone: string }>;
}

interface ChatMessage {
    id: number;
    author: "me" | "them";
    text: string;
    time: string;
}

interface Friend {
    id: string;
    name: string;
    initials: string;
    status: "online" | "offline";
    activity: string;
    tone: string;
}

function makeDefaultCategories(voiceRooms: string[]): RoomCategory[] {
    return [
        { id: "hang-out", label: "Hang out", textRooms: ["general", "weekend-plans", "photo-dump"], voiceRooms },
        { id: "make-things", label: "Make things", textRooms: ["share-your-work", "help-desk"], voiceRooms: [] },
    ];
}

const INITIAL_COMMUNITIES: Community[] = [
    { id: "saturday", name: "Saturday Club", initials: "SC", online: 8, tone: "coral", description: "Plans, walks and slow weekends together.", visibility: "private", allowInvites: true, categories: makeDefaultCategories(["cozy-corner", "music-lounge"]) },
    { id: "studio", name: "Work in Progress", initials: "WP", online: 5, tone: "amber", description: "A shared studio for unfinished ideas.", visibility: "private", allowInvites: true, categories: makeDefaultCategories(["studio-table"]) },
    { id: "study", name: "Study Hall", initials: "SH", online: 12, tone: "rose", description: "Quiet focus, helpful notes and study breaks.", visibility: "public", allowInvites: true, categories: makeDefaultCategories(["focus-room", "coffee-break"]) },
    { id: "film", name: "Film Club", initials: "FC", online: 3, tone: "brown", description: "Watchlists, screenings and very strong opinions.", visibility: "private", allowInvites: false, categories: makeDefaultCategories(["after-credits"]) },
];

const COMMUNITY_MEMBERS = [
    { name: "John Doe", initials: "JD", role: "Owner", status: "online", activity: "Reading this room", tone: "brown" },
    { name: "Maya Chen", initials: "MC", role: "Host", status: "online", activity: "Around now", tone: "coral" },
    { name: "Jules Martin", initials: "JM", role: "Member", status: "online", activity: "Listening nearby", tone: "amber" },
    { name: "Lina Torres", initials: "LT", role: "Member", status: "online", activity: "Available", tone: "rose" },
    { name: "Noah Williams", initials: "NW", role: "Member", status: "offline", activity: "Last seen yesterday", tone: "sage" },
];

const CONVERSATIONS: Conversation[] = [
    { id: "maya", name: "Maya Chen", initials: "MC", preview: "You’re bringing the blanket, right?", time: "2m", status: "Online", unread: 2, tone: "coral" },
    { id: "jules", name: "Jules Martin", initials: "JM", preview: "That playlist is getting dangerous", time: "18m", status: "In voice", tone: "amber" },
    {
        id: "weekend",
        name: "Weekend crew",
        initials: "4",
        preview: "Lina: Sunday works for me 🌿",
        time: "1h",
        tone: "rose",
        members: [
            { name: "Maya Chen", initials: "MC", tone: "coral" },
            { name: "Lina Torres", initials: "LT", tone: "rose" },
            { name: "Jules Martin", initials: "JM", tone: "amber" },
        ],
    },
    { id: "noah", name: "Noah Williams", initials: "NW", preview: "Sent you a photo", time: "3h", status: "Away", tone: "sage" },
    { id: "amelie", name: "Amélie Roux", initials: "AR", preview: "Let’s finish this tomorrow", time: "Tue", tone: "plum" },
];

const FRIENDS: Friend[] = [
    { id: "maya", name: "Maya Chen", initials: "MC", status: "online", activity: "Planning something in Saturday Club", tone: "coral" },
    { id: "jules", name: "Jules Martin", initials: "JM", status: "online", activity: "Listening in music-lounge", tone: "amber" },
    { id: "lina", name: "Lina Torres", initials: "LT", status: "online", activity: "Available", tone: "rose" },
    { id: "noah", name: "Noah Williams", initials: "NW", status: "online", activity: "Editing photos", tone: "sage" },
    { id: "sam", name: "Sam Rivera", initials: "SR", status: "online", activity: "In cozy-corner", tone: "brown" },
    { id: "olivia", name: "Olivia Park", initials: "OP", status: "online", activity: "Available", tone: "plum" },
    { id: "theo", name: "Théo Bernard", initials: "TB", status: "online", activity: "Studying in focus-room", tone: "amber" },
    { id: "yara", name: "Yara Haddad", initials: "YH", status: "online", activity: "Available", tone: "coral" },
    { id: "leo", name: "Leo Anders", initials: "LA", status: "online", activity: "Playing with Saturday Club", tone: "sage" },
    { id: "ines", name: "Inès Petit", initials: "IP", status: "online", activity: "Available", tone: "rose" },
    { id: "kenji", name: "Kenji Sato", initials: "KS", status: "online", activity: "In general", tone: "brown" },
    { id: "riley", name: "Riley Brooks", initials: "RB", status: "online", activity: "Available", tone: "plum" },
    { id: "amelie", name: "Amélie Roux", initials: "AR", status: "offline", activity: "Last seen Tuesday", tone: "plum" },
    { id: "marco", name: "Marco Silva", initials: "MS", status: "offline", activity: "Last seen yesterday", tone: "coral" },
    { id: "zoe", name: "Zoé Lambert", initials: "ZL", status: "offline", activity: "Last seen 3 days ago", tone: "amber" },
    { id: "hugo", name: "Hugo Morel", initials: "HM", status: "offline", activity: "Last seen last week", tone: "sage" },
    { id: "nora", name: "Nora Kim", initials: "NK", status: "offline", activity: "Last seen 2 weeks ago", tone: "rose" },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
    maya: [
        { id: 1, author: "them", text: "Okay, I found the spot I was telling you about.", time: "10:14" },
        { id: 2, author: "them", text: "Big trees, enough shade, and apparently very serious ducks.", time: "10:15" },
        { id: 3, author: "me", text: "You had me at serious ducks. Sunday afternoon?", time: "10:18" },
        { id: 4, author: "them", text: "Perfect. I’ll put the details in Saturday Club so nobody can pretend they missed it.", time: "10:20" },
        { id: 5, author: "them", text: "You’re bringing the blanket, right?", time: "10:21" },
    ],
    jules: [
        { id: 1, author: "them", text: "I added three songs and somehow the playlist is now four hours long.", time: "09:42" },
        { id: 2, author: "me", text: "That sounds less like a bug and more like excellent planning.", time: "09:47" },
        { id: 3, author: "them", text: "That playlist is getting dangerous.", time: "09:49" },
    ],
    weekend: [
        { id: 1, author: "them", text: "Maya: Picnic this weekend?", time: "Yesterday" },
        { id: 2, author: "me", text: "I can do Saturday after three or Sunday whenever.", time: "Yesterday" },
        { id: 3, author: "them", text: "Lina: Sunday works for me 🌿", time: "11:06" },
    ],
    noah: [
        { id: 1, author: "them", text: "The light was perfect on the walk home.", time: "Yesterday" },
        { id: 2, author: "them", text: "Sent you a photo", time: "Yesterday" },
    ],
    amelie: [
        { id: 1, author: "me", text: "I think we got the difficult part done.", time: "Tuesday" },
        { id: 2, author: "them", text: "Agreed. Let’s finish this tomorrow.", time: "Tuesday" },
    ],
};

const EMPTY_COMMUNITY_DRAFT = {
    name: "",
    description: "",
    tone: "coral" as CommunityTone,
    visibility: "private" as CommunityVisibility,
};

function makeInitials(name: string) {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "KN";
}

function makeRoomName(name: string) {
    return name
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function HomePage() {
    const [activeSpace, setActiveSpace] = useState("messages");
    const [communities, setCommunities] = useState(INITIAL_COMMUNITIES);
    const [conversations, setConversations] = useState(CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState("maya");
    const [selectedRoom, setSelectedRoom] = useState("general");
    const [selectedRoomKind, setSelectedRoomKind] = useState<"text" | "voice">("text");
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState("");
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [mobilePanel, setMobilePanel] = useState<"list" | "chat">("list");
    const [messageView, setMessageView] = useState<"chat" | "friends">("chat");
    const [friendFilter, setFriendFilter] = useState<"all" | "online" | "offline">("all");
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [newMessageOpen, setNewMessageOpen] = useState(false);
    const [newMessageMode, setNewMessageMode] = useState<"direct" | "group">("direct");
    const [newMessageQuery, setNewMessageQuery] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const [createCommunityOpen, setCreateCommunityOpen] = useState(false);
    const [communityDraft, setCommunityDraft] = useState(EMPTY_COMMUNITY_DRAFT);
    const [communitySettingsOpen, setCommunitySettingsOpen] = useState(false);
    const [settingsDraft, setSettingsDraft] = useState({ ...EMPTY_COMMUNITY_DRAFT, allowInvites: true });
    const [channelCreatorOpen, setChannelCreatorOpen] = useState(false);
    const [channelType, setChannelType] = useState<"text" | "voice">("text");
    const [channelName, setChannelName] = useState("");
    const [channelCategory, setChannelCategory] = useState("hang-out");
    const [categoryCreatorOpen, setCategoryCreatorOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [membersPanelOpen, setMembersPanelOpen] = useState(false);
    const [roomMenuOpen, setRoomMenuOpen] = useState(false);
    const [mutedRooms, setMutedRooms] = useState<string[]>([]);
    const [roomLinkCopied, setRoomLinkCopied] = useState(false);
    const [roomSettingsOpen, setRoomSettingsOpen] = useState(false);
    const [roomSettingsName, setRoomSettingsName] = useState("");
    const [roomSettingsCategory, setRoomSettingsCategory] = useState("");
    const [joinedVoiceRoom, setJoinedVoiceRoom] = useState<{ communityId: string; room: string } | null>(null);
    const [microphoneMuted, setMicrophoneMuted] = useState(false);
    const [voiceSoundMuted, setVoiceSoundMuted] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const roomMenuRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find((conversation) => conversation.id === selectedConversation)
        ?? FRIENDS.find((friend) => friend.id === selectedConversation)
        ?? conversations[0];
    const activeCommunity = communities.find((community) => community.id === activeSpace);
    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return conversations;
        return conversations.filter((conversation) => conversation.name.toLowerCase().includes(normalizedQuery));
    }, [conversations, query]);
    const filteredFriends = FRIENDS.filter((friend) => friendFilter === "all" || friend.status === friendFilter);
    const newMessageFriends = FRIENDS.filter((friend) => friend.name.toLowerCase().includes(newMessageQuery.trim().toLowerCase()));
    const selectedCategory = activeCommunity?.categories.find((category) => (
        selectedRoomKind === "text" ? category.textRooms : category.voiceRooms
    ).includes(selectedRoom));
    const activeRoomKey = `${activeSpace}:${selectedRoomKind}:${selectedRoom}`;
    const roomIsMuted = mutedRooms.includes(activeRoomKey);
    const roomMembers = selectedRoomKind === "voice" ? COMMUNITY_MEMBERS.slice(0, 3) : COMMUNITY_MEMBERS;
    const joinedVoiceCommunity = communities.find((community) => community.id === joinedVoiceRoom?.communityId);

    useEffect(() => {
        if (!profileMenuOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!profileMenuRef.current?.contains(event.target as Node)) setProfileMenuOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setProfileMenuOpen(false);
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [profileMenuOpen]);

    useEffect(() => {
        if (!roomMenuOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!roomMenuRef.current?.contains(event.target as Node)) setRoomMenuOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setRoomMenuOpen(false);
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [roomMenuOpen]);

    const openMessages = () => {
        setActiveSpace("messages");
        setMessageView("chat");
        setMobilePanel("list");
        setMembersPanelOpen(false);
        setRoomMenuOpen(false);
    };

    const openCommunity = (communityId: string) => {
        setActiveSpace(communityId);
        setSelectedRoom("general");
        setSelectedRoomKind("text");
        setMobilePanel("list");
        setMembersPanelOpen(false);
        setRoomMenuOpen(false);
    };

    const openCommunityCreator = () => {
        setCommunityDraft(EMPTY_COMMUNITY_DRAFT);
        setCreateCommunityOpen(true);
    };

    const createCommunity = (event: React.FormEvent) => {
        event.preventDefault();
        const name = communityDraft.name.trim();
        if (!name) return;

        const id = `${makeRoomName(name) || "community"}-${Date.now()}`;
        const newCommunity: Community = {
            id,
            name,
            initials: makeInitials(name),
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

    const openCommunitySettings = () => {
        if (!activeCommunity) return;
        setSettingsDraft({
            name: activeCommunity.name,
            description: activeCommunity.description,
            tone: activeCommunity.tone,
            visibility: activeCommunity.visibility,
            allowInvites: activeCommunity.allowInvites,
        });
        setCommunitySettingsOpen(true);
    };

    const saveCommunitySettings = (event: React.FormEvent) => {
        event.preventDefault();
        const name = settingsDraft.name.trim();
        if (!activeCommunity || !name) return;

        setCommunities((current) => current.map((community) => community.id === activeCommunity.id
            ? {
                ...community,
                name,
                initials: makeInitials(name),
                description: settingsDraft.description.trim(),
                tone: settingsDraft.tone,
                visibility: settingsDraft.visibility,
                allowInvites: settingsDraft.allowInvites,
            }
            : community));
        setCommunitySettingsOpen(false);
    };

    const openChannelCreator = (type: "text" | "voice", categoryId = activeCommunity?.categories[0]?.id ?? "start-here") => {
        setChannelType(type);
        setChannelCategory(categoryId);
        setChannelName("");
        setChannelCreatorOpen(true);
    };

    const createChannel = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity) return;
        const roomName = makeRoomName(channelName);
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

    const createCategory = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity) return;
        const label = categoryName.trim();
        const id = makeRoomName(label);
        if (!label || !id) return;

        setCommunities((current) => current.map((community) => community.id === activeCommunity.id && !community.categories.some((category) => category.id === id)
            ? { ...community, categories: [...community.categories, { id, label, textRooms: [], voiceRooms: [] }] }
            : community));
        setChannelCategory(id);
        setCategoryCreatorOpen(false);
        setCategoryName("");
    };

    const openRoomSettings = () => {
        setRoomSettingsName(selectedRoom);
        setRoomSettingsCategory(selectedCategory?.id ?? activeCommunity?.categories[0]?.id ?? "");
        setRoomMenuOpen(false);
        setRoomSettingsOpen(true);
    };

    const saveRoomSettings = (event: React.FormEvent) => {
        event.preventDefault();
        if (!activeCommunity || !selectedCategory) return;
        const nextName = makeRoomName(roomSettingsName);
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

    const toggleRoomMuted = () => {
        const roomKey = `${activeSpace}:${selectedRoomKind}:${selectedRoom}`;
        setMutedRooms((current) => current.includes(roomKey) ? current.filter((key) => key !== roomKey) : [...current, roomKey]);
        setRoomMenuOpen(false);
    };

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

    const openNewMessage = (mode: "direct" | "group" = "direct") => {
        setNewMessageMode(mode);
        setSelectedFriends([]);
        setNewMessageQuery("");
        setGroupName("");
        setNewMessageOpen(true);
    };

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
            <header className={styles.spaceBar}>
                <Link to="/" className={styles.appBrand} aria-label="Knotly landing page">
                    <img src={knotlyLogo} alt="" />
                </Link>

                <nav className={styles.spaceNav} aria-label="Your communities">
                    <button type="button" className={`${styles.messageSpace} ${activeSpace === "messages" ? styles.activeSpace : ""}`} onClick={openMessages}>
                        <MessageCircleMore aria-hidden="true" />
                        <span>Messages</span>
                    </button>
                    <i className={styles.spaceDivider} />
                    {communities.map((community) => (
                        <button
                            key={community.id}
                            type="button"
                            className={`${styles.communityButton} ${styles[community.tone]} ${activeSpace === community.id ? styles.activeSpace : ""}`}
                            onClick={() => openCommunity(community.id)}
                            aria-label={`${community.name}, ${community.online} online`}
                            title={community.name}
                        >
                            <span>{community.initials}</span>
                            <small>{community.name}</small>
                        </button>
                    ))}
                    <button type="button" className={styles.addCommunity} aria-label="Create a community" onClick={openCommunityCreator}><Plus /></button>
                </nav>

                <div className={styles.userActions}>
                    <button type="button" aria-label="Notifications" className={styles.iconButton}><Bell /><i /></button>
                    <Link to="/settings" aria-label="Settings" className={styles.iconButton}><Settings /></Link>
                    <div className={styles.profileMenuWrap} ref={profileMenuRef}>
                        <button type="button" className={styles.userMenu} onClick={() => setProfileMenuOpen((open) => !open)} aria-expanded={profileMenuOpen}>
                            <span>JD<i /></span><strong>John</strong><ChevronDown />
                        </button>
                        {profileMenuOpen && (
                            <div className={styles.profileMenu}>
                                <div className={styles.profileMenuHeader}><span>JD<i /></span><div><strong>John Doe</strong><small>@johndoe</small></div></div>
                                <div className={styles.profilePresence}><i /> Online</div>
                                <Link to="/settings"><Settings /> Account settings</Link>
                                <Link to="/faq"><HelpCircle /> Help & FAQ</Link>
                                <Link to="/" className={styles.profileSignOut}><LogOut /> Sign out</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

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
                                                <div className={`${styles.voicePeople} ${styles.currentVoiceUser}`}><i className={styles.brown}>JD</i><span>You {microphoneMuted && <MicOff aria-label="Microphone muted" />}</span></div>
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

            {newMessageOpen && (
                <div className={styles.modalBackdrop} onMouseDown={() => setNewMessageOpen(false)}>
                    <section className={styles.newMessageModal} role="dialog" aria-modal="true" aria-labelledby="new-message-title" onMouseDown={(event) => event.stopPropagation()}>
                        <header>
                            <div><span>Start something</span><h2 id="new-message-title">New message</h2></div>
                            <button type="button" onClick={() => setNewMessageOpen(false)} aria-label="Close"><X /></button>
                        </header>

                        <div className={styles.messageModeTabs}>
                            <button type="button" className={newMessageMode === "direct" ? styles.activeMode : ""} onClick={() => { setNewMessageMode("direct"); setSelectedFriends([]); }}>
                                <MessageCircleMore /> Direct message
                            </button>
                            <button type="button" className={newMessageMode === "group" ? styles.activeMode : ""} onClick={() => { setNewMessageMode("group"); setSelectedFriends([]); }}>
                                <UsersRound /> New group
                            </button>
                        </div>

                        {newMessageMode === "group" && (
                            <label className={styles.groupNameField}>
                                <span>Group name <small>Optional</small></span>
                                <input value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Weekend plans, project crew…" />
                            </label>
                        )}

                        <label className={styles.modalSearch}>
                            <Search />
                            <span className={styles.srOnly}>Search friends</span>
                            <input value={newMessageQuery} onChange={(event) => setNewMessageQuery(event.target.value)} placeholder="Search your friends" autoFocus />
                        </label>

                        <div className={styles.contactPicker}>
                            {newMessageFriends.map((friend) => {
                                const selected = selectedFriends.includes(friend.id);
                                return (
                                    <button
                                        key={friend.id}
                                        type="button"
                                        className={selected ? styles.selectedContact : ""}
                                        onClick={() => setSelectedFriends((current) => {
                                            if (newMessageMode === "direct") return [friend.id];
                                            return selected ? current.filter((id) => id !== friend.id) : [...current, friend.id];
                                        })}
                                    >
                                        <span className={`${styles.personAvatar} ${styles[friend.tone]} ${friend.status === "offline" ? styles.offlineAvatar : ""}`}>{friend.initials}<i /></span>
                                        <span><strong>{friend.name}</strong><small>{friend.status === "online" ? friend.activity : "Offline"}</small></span>
                                        <i className={styles.selectionMark}>{selected ? "✓" : ""}</i>
                                    </button>
                                );
                            })}
                        </div>

                        <footer>
                            <span>{newMessageMode === "group" ? `${selectedFriends.length} selected · you’ll be added too` : "Choose one friend"}</span>
                            <button type="button" onClick={createConversation} disabled={newMessageMode === "group" ? selectedFriends.length < 2 : selectedFriends.length !== 1}>
                                {newMessageMode === "group" ? "Create group" : "Start conversation"} <Send />
                            </button>
                        </footer>
                    </section>
                </div>
            )}

            {createCommunityOpen && (
                <div className={styles.modalBackdrop} onMouseDown={() => setCreateCommunityOpen(false)}>
                    <form className={`${styles.newMessageModal} ${styles.managementModal}`} onSubmit={createCommunity} onMouseDown={(event) => event.stopPropagation()}>
                        <header>
                            <div><span>A fresh corner</span><h2>Create a community</h2></div>
                            <button type="button" onClick={() => setCreateCommunityOpen(false)} aria-label="Close"><X /></button>
                        </header>
                        <div className={styles.managementBody}>
                            <div className={styles.communityIdentityPreview}>
                                <i className={`${styles.communityMark} ${styles[communityDraft.tone]}`}>{makeInitials(communityDraft.name)}</i>
                                <div><strong>{communityDraft.name.trim() || "Your community"}</strong><small>{communityDraft.description.trim() || "A place with its own rhythm."}</small></div>
                            </div>
                            <label className={styles.formField}>
                                <span>Community name</span>
                                <input value={communityDraft.name} onChange={(event) => setCommunityDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Sunday table" autoFocus maxLength={36} />
                            </label>
                            <label className={styles.formField}>
                                <span>Short description <small>Optional</small></span>
                                <textarea value={communityDraft.description} onChange={(event) => setCommunityDraft((current) => ({ ...current, description: event.target.value }))} placeholder="What brings everyone together?" maxLength={120} />
                            </label>
                            <div className={styles.formField}>
                                <span>Community colour</span>
                                <div className={styles.tonePicker}>
                                    {(["coral", "amber", "rose", "brown"] as CommunityTone[]).map((tone) => (
                                        <button key={tone} type="button" className={`${styles.toneOption} ${styles[tone]} ${communityDraft.tone === tone ? styles.selectedTone : ""}`} onClick={() => setCommunityDraft((current) => ({ ...current, tone }))} aria-label={`Use ${tone}`}><i />{communityDraft.tone === tone && <Check />}</button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formField}>
                                <span>Who can find it?</span>
                                <div className={styles.visibilityPicker}>
                                    <button type="button" className={communityDraft.visibility === "private" ? styles.selectedVisibility : ""} onClick={() => setCommunityDraft((current) => ({ ...current, visibility: "private" }))}><LockKeyhole /><span><strong>Private</strong><small>Invite only</small></span></button>
                                    <button type="button" className={communityDraft.visibility === "public" ? styles.selectedVisibility : ""} onClick={() => setCommunityDraft((current) => ({ ...current, visibility: "public" }))}><Globe2 /><span><strong>Discoverable</strong><small>Anyone can find it</small></span></button>
                                </div>
                            </div>
                        </div>
                        <footer><span>You can change all of this later.</span><button type="submit" disabled={!communityDraft.name.trim()}>Create community <Plus /></button></footer>
                    </form>
                </div>
            )}

            {communitySettingsOpen && activeCommunity && (
                <div className={styles.modalBackdrop} onMouseDown={() => setCommunitySettingsOpen(false)}>
                    <form className={`${styles.newMessageModal} ${styles.managementModal}`} onSubmit={saveCommunitySettings} onMouseDown={(event) => event.stopPropagation()}>
                        <header>
                            <div><span>{activeCommunity.name}</span><h2>Community settings</h2></div>
                            <button type="button" onClick={() => setCommunitySettingsOpen(false)} aria-label="Close"><X /></button>
                        </header>
                        <div className={styles.managementBody}>
                            <div className={styles.communityIdentityPreview}>
                                <i className={`${styles.communityMark} ${styles[settingsDraft.tone]}`}>{makeInitials(settingsDraft.name)}</i>
                                <div><strong>{settingsDraft.name.trim() || activeCommunity.name}</strong><small>{settingsDraft.description.trim() || "Add a short community description."}</small></div>
                            </div>
                            <label className={styles.formField}>
                                <span>Community name</span>
                                <input value={settingsDraft.name} onChange={(event) => setSettingsDraft((current) => ({ ...current, name: event.target.value }))} maxLength={36} autoFocus />
                            </label>
                            <label className={styles.formField}>
                                <span>Description</span>
                                <textarea value={settingsDraft.description} onChange={(event) => setSettingsDraft((current) => ({ ...current, description: event.target.value }))} maxLength={120} />
                            </label>
                            <div className={styles.formField}>
                                <span>Community colour</span>
                                <div className={styles.tonePicker}>
                                    {(["coral", "amber", "rose", "brown"] as CommunityTone[]).map((tone) => (
                                        <button key={tone} type="button" className={`${styles.toneOption} ${styles[tone]} ${settingsDraft.tone === tone ? styles.selectedTone : ""}`} onClick={() => setSettingsDraft((current) => ({ ...current, tone }))} aria-label={`Use ${tone}`}><i />{settingsDraft.tone === tone && <Check />}</button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formField}>
                                <span>Visibility</span>
                                <div className={styles.visibilityPicker}>
                                    <button type="button" className={settingsDraft.visibility === "private" ? styles.selectedVisibility : ""} onClick={() => setSettingsDraft((current) => ({ ...current, visibility: "private" }))}><LockKeyhole /><span><strong>Private</strong><small>Invite only</small></span></button>
                                    <button type="button" className={settingsDraft.visibility === "public" ? styles.selectedVisibility : ""} onClick={() => setSettingsDraft((current) => ({ ...current, visibility: "public" }))}><Globe2 /><span><strong>Discoverable</strong><small>Visible in Explore</small></span></button>
                                </div>
                            </div>
                            <button type="button" className={styles.switchRow} onClick={() => setSettingsDraft((current) => ({ ...current, allowInvites: !current.allowInvites }))}>
                                <span><strong>Member invitations</strong><small>Let members invite people they know.</small></span>
                                <i className={settingsDraft.allowInvites ? styles.switchActive : ""}><b /></i>
                            </button>
                        </div>
                        <footer><span>Changes apply immediately to this demo.</span><button type="submit" disabled={!settingsDraft.name.trim()}>Save changes <Check /></button></footer>
                    </form>
                </div>
            )}

            {channelCreatorOpen && activeCommunity && (
                <div className={styles.modalBackdrop} onMouseDown={() => setChannelCreatorOpen(false)}>
                    <form className={`${styles.newMessageModal} ${styles.managementModal} ${styles.channelModal}`} onSubmit={createChannel} onMouseDown={(event) => event.stopPropagation()}>
                        <header>
                            <div><span>{activeCommunity.name}</span><h2>Add a room</h2></div>
                            <button type="button" onClick={() => setChannelCreatorOpen(false)} aria-label="Close"><X /></button>
                        </header>
                        <div className={styles.messageModeTabs}>
                            <button type="button" className={channelType === "text" ? styles.activeMode : ""} onClick={() => setChannelType("text")}><Hash /> Text room</button>
                            <button type="button" className={channelType === "voice" ? styles.activeMode : ""} onClick={() => setChannelType("voice")}><Headphones /> Voice room</button>
                        </div>
                        <div className={styles.managementBody}>
                            <label className={styles.formField}>
                                <span>Room name</span>
                                <div className={styles.roomNameInput}>{channelType === "text" ? <Hash /> : <Headphones />}<input value={channelName} onChange={(event) => setChannelName(event.target.value)} placeholder={channelType === "text" ? "new-ideas" : "kitchen-table"} autoFocus maxLength={36} /></div>
                                {channelName.trim() && <small>It will appear as {makeRoomName(channelName) || "room-name"}.</small>}
                            </label>
                            <label className={styles.formField}>
                                <span>Category</span>
                                <select value={channelCategory} onChange={(event) => setChannelCategory(event.target.value)}>
                                    {activeCommunity.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                                </select>
                            </label>
                            <div className={styles.roomTypeNote}>
                                {channelType === "text" ? <Hash /> : <Headphones />}
                                <p><strong>{channelType === "text" ? "A place to keep a conversation." : "A place people can drop into."}</strong><span>{channelType === "text" ? "Messages stay here for everyone to catch up." : "Members can see who is around before joining."}</span></p>
                            </div>
                        </div>
                        <footer><span>{channelType === "text" ? "Text room" : "Voice room"} · {activeCommunity.name}</span><button type="submit" disabled={!makeRoomName(channelName)}>Create room <Plus /></button></footer>
                    </form>
                </div>
            )}

            {categoryCreatorOpen && activeCommunity && (
                <div className={styles.modalBackdrop} onMouseDown={() => setCategoryCreatorOpen(false)}>
                    <form className={`${styles.newMessageModal} ${styles.managementModal} ${styles.channelModal}`} onSubmit={createCategory} onMouseDown={(event) => event.stopPropagation()}>
                        <header>
                            <div><span>{activeCommunity.name}</span><h2>New category</h2></div>
                            <button type="button" onClick={() => setCategoryCreatorOpen(false)} aria-label="Close"><X /></button>
                        </header>
                        <div className={styles.managementBody}>
                            <label className={styles.formField}>
                                <span>Category name</span>
                                <div className={styles.roomNameInput}><FolderPlus /><input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Games, projects, after hours…" autoFocus maxLength={30} /></div>
                            </label>
                            <div className={styles.categoryPreview}>
                                <div><span>{categoryName.trim() || "New category"}</span><Plus /></div>
                                <p><Hash /> text-room</p>
                                <p><Headphones /> voice-room</p>
                            </div>
                        </div>
                        <footer><span>Text and voice rooms can live together.</span><button type="submit" disabled={!makeRoomName(categoryName)}>Create category <FolderPlus /></button></footer>
                    </form>
                </div>
            )}

            {roomSettingsOpen && activeCommunity && (
                <div className={styles.modalBackdrop} onMouseDown={() => setRoomSettingsOpen(false)}>
                    <form className={`${styles.newMessageModal} ${styles.managementModal} ${styles.channelModal}`} onSubmit={saveRoomSettings} onMouseDown={(event) => event.stopPropagation()}>
                        <header>
                            <div><span>{activeCommunity.name}</span><h2>Edit room</h2></div>
                            <button type="button" onClick={() => setRoomSettingsOpen(false)} aria-label="Close"><X /></button>
                        </header>
                        <div className={styles.managementBody}>
                            <label className={styles.formField}>
                                <span>Room name</span>
                                <div className={styles.roomNameInput}>{selectedRoomKind === "text" ? <Hash /> : <Headphones />}<input value={roomSettingsName} onChange={(event) => setRoomSettingsName(event.target.value)} autoFocus maxLength={36} /></div>
                            </label>
                            <label className={styles.formField}>
                                <span>Move to category</span>
                                <select value={roomSettingsCategory} onChange={(event) => setRoomSettingsCategory(event.target.value)}>
                                    {activeCommunity.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                                </select>
                            </label>
                            <div className={styles.roomTypeNote}>
                                {selectedRoomKind === "text" ? <Hash /> : <Headphones />}
                                <p><strong>{selectedRoomKind === "text" ? "Text room" : "Voice room"}</strong><span>You can rename it or move it without changing its type.</span></p>
                            </div>
                        </div>
                        <footer><span>{selectedCategory?.label} → {activeCommunity.categories.find((category) => category.id === roomSettingsCategory)?.label}</span><button type="submit" disabled={!makeRoomName(roomSettingsName)}>Save room <Check /></button></footer>
                    </form>
                </div>
            )}
        </main>
    );
}

function AudioWave() {
    return <span className={styles.audioWave} aria-label="Speaking"><i /><i /><i /></span>;
}

interface GroupAvatarProps {
    compact?: boolean;
    large?: boolean;
    members: Array<{ initials: string; tone: string }>;
    total: number;
}

function GroupAvatar({ compact = false, large = false, members, total }: GroupAvatarProps) {
    return (
        <span className={`${styles.groupAvatar} ${compact ? styles.compactGroupAvatar : ""} ${large ? styles.largeGroupAvatar : ""}`} aria-label={`${total} people in this conversation`}>
            {members.slice(0, 3).map((member, index) => (
                <i key={`${member.initials}-${index}`} className={styles[member.tone]}>{member.initials}</i>
            ))}
            <b>+{Math.max(total - 3, 1)}</b>
        </span>
    );
}
