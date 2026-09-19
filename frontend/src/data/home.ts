import type {
    ChatMessage,
    Community,
    CommunitySettingsDraft,
    CommunityMember,
    Conversation,
    Friend,
    RoomCategory,
} from "../types/home";

/** Builds a new category list so communities never share mutable arrays. */
function createDefaultCategories(voiceRooms: string[]): RoomCategory[] {
    return [
        { id: "hang-out", label: "Hang out", textRooms: ["general", "weekend-plans", "photo-dump"], voiceRooms },
        { id: "make-things", label: "Make things", textRooms: ["share-your-work", "help-desk"], voiceRooms: [] },
    ];
}

export const INITIAL_COMMUNITIES: Community[] = [
    { id: "saturday", name: "Saturday Club", initials: "SC", online: 8, tone: "coral", description: "Plans, walks and slow weekends together.", visibility: "private", allowInvites: true, categories: createDefaultCategories(["cozy-corner", "music-lounge"]) },
    { id: "studio", name: "Work in Progress", initials: "WP", online: 5, tone: "amber", description: "A shared studio for unfinished ideas.", visibility: "private", allowInvites: true, categories: createDefaultCategories(["studio-table"]) },
    { id: "study", name: "Study Hall", initials: "SH", online: 12, tone: "rose", description: "Quiet focus, helpful notes and study breaks.", visibility: "public", allowInvites: true, categories: createDefaultCategories(["focus-room", "coffee-break"]) },
    { id: "film", name: "Film Club", initials: "FC", online: 3, tone: "brown", description: "Watchlists, screenings and very strong opinions.", visibility: "private", allowInvites: false, categories: createDefaultCategories(["after-credits"]) },
];

export const COMMUNITY_MEMBERS: CommunityMember[] = [
    { name: "@johndoe", initials: "JO", role: "Owner", status: "online", activity: "Reading this room", tone: "brown" },
    { name: "Maya Chen", initials: "MC", role: "Host", status: "online", activity: "Around now", tone: "coral" },
    { name: "Jules Martin", initials: "JM", role: "Member", status: "online", activity: "Listening nearby", tone: "amber" },
    { name: "Lina Torres", initials: "LT", role: "Member", status: "online", activity: "Available", tone: "rose" },
    { name: "Noah Williams", initials: "NW", role: "Member", status: "offline", activity: "Last seen yesterday", tone: "sage" },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
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

export const FRIENDS: Friend[] = [
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

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
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

export const EMPTY_COMMUNITY_DRAFT: CommunitySettingsDraft = {
    name: "",
    description: "",
    tone: "coral",
    visibility: "private",
    allowInvites: true,
    localDisplayName: "",
};
