import { MessageCircleMore, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import type { FaqCategory, FaqEntry } from "../types/faq";

export const FAQ_CATEGORIES: FaqCategory[] = [
    { id: "getting-started", label: "Getting started", description: "The essentials for finding or creating your place.", icon: Sparkles },
    { id: "conversations", label: "Chat & voice", description: "Rooms, messages, and dropping into a conversation.", icon: MessageCircleMore },
    { id: "communities", label: "Communities", description: "Invites, organization, roles, and discovery.", icon: UsersRound },
    { id: "account", label: "Account & safety", description: "Your profile, access, privacy, and moderation.", icon: ShieldCheck },
];

export const FAQ_ENTRIES: FaqEntry[] = [
    { category: "getting-started", question: "What is Knotly?", answer: "Knotly is a place for communities to talk, organize conversations into rooms, and spend time together in voice. It is designed for friend groups, clubs, study circles, creative collectives, and any group that wants a shared home online." },
    { category: "getting-started", question: "How do I create my first community?", answer: "Create an account, choose a name and an icon for your community, then add the rooms your group needs. You can start small with one general room and shape the space as your community grows." },
    { category: "getting-started", question: "Can I join an existing community instead?", answer: "Yes. Open an invite shared by a community member, or browse public communities from Explore. You can belong to several communities and move between them from their icons in the app." },
    { category: "getting-started", question: "Is Knotly free to use?", answer: "Knotly is currently free during its beta. The core experience—communities, text rooms, and voice rooms—is available without a paid plan while we learn what groups need most." },
    { category: "conversations", question: "How are conversations organized?", answer: "Each community can create rooms around a topic, project, or activity. Keeping conversations separate makes it easier to follow what matters without losing the casual feeling of a group chat." },
    { category: "conversations", question: "How do voice rooms work?", answer: "Voice rooms are always ready when your community is. Join a room to see who is there and start talking—there is no meeting link to create and no calendar invite required." },
    { category: "conversations", question: "Can I see who is speaking?", answer: "Yes. People in a voice room appear beside the room, and an audio indicator shows who is currently speaking so the conversation stays easy to follow." },
    { category: "communities", question: "How do I invite people?", answer: "Create an invite from your community and share its link with the people you want to bring in. Community owners can manage how invitations are used from their community settings." },
    { category: "communities", question: "Can I personalize a community?", answer: "Yes. Choose its identity, organize rooms around the way your group talks, and use categories to keep larger spaces readable. A study group and a gaming community do not need to feel the same." },
    { category: "communities", question: "What can roles and permissions control?", answer: "Roles help community owners decide who can manage the space and which rooms members or guests can access. This keeps responsibilities clear without making everyday conversation feel complicated." },
    { category: "communities", question: "How do I discover new communities?", answer: "Visit Explore to browse public communities by interest. Each card gives you a quick sense of the group, its popular rooms, and how active it is before you decide to join." },
    { category: "account", question: "Can I use Knotly on my phone?", answer: "The web experience is designed to work across desktop and mobile browsers. A larger screen is useful for busy communities, but you can still check conversations and stay connected from your phone." },
    { category: "account", question: "Who controls access to a community?", answer: "Community owners and moderators manage invitations, roles, and room permissions. Members only see and use the spaces their access allows." },
    { category: "account", question: "What should I do if someone makes the space uncomfortable?", answer: "Start with the community’s moderators, who can review the situation and manage the member’s access. Community rules and clearly assigned moderators make it easier to handle problems early." },
    { category: "account", question: "Where can I change my profile and preferences?", answer: "Open Settings from the app to update your profile and adjust the preferences available to your account. Community-specific controls remain inside each community’s settings." },
];
