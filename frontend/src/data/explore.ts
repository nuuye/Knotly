import { BookOpen, Code, Gamepad2, Heart, Music, Sparkles, TrendingUp } from "lucide-react";
import type { ExploreCategory, ExploreCommunity } from "../types/explore";

export const EXPLORE_COMMUNITIES: ExploreCommunity[] = [
    { id: "1", name: "Gamers Paradise", description: "Co-op nights, new releases, and a squad that is always ready for one more game.", members: 12543, online: 3421, category: "gaming", categoryLabel: "Gaming", icon: Gamepad2, tone: "ember", rooms: ["lfg", "game-nights", "squad-room"] },
    { id: "2", name: "Sound & Soul", description: "Trade playlists, discover hidden gems, and listen together after hours.", members: 8932, online: 1876, category: "music", categoryLabel: "Music", icon: Music, tone: "gold", rooms: ["now-playing", "discoveries"] },
    { id: "3", name: "The Dev Den", description: "A friendly corner for side projects, thoughtful feedback, and stubborn bugs.", members: 15678, online: 4532, category: "tech", categoryLabel: "Technology", icon: Code, tone: "clay", rooms: ["show-your-work", "help-desk"] },
    { id: "4", name: "The Reading Room", description: "Slow reads, lively opinions, and a monthly book worth talking about.", members: 5421, online: 892, category: "culture", categoryLabel: "Books", icon: BookOpen, tone: "cream", rooms: ["current-read", "spoilers"] },
    { id: "5", name: "Move Together", description: "Share small wins, find training partners, and keep each other moving.", members: 9234, online: 2134, category: "health", categoryLabel: "Wellness", icon: Heart, tone: "rose", rooms: ["daily-check-in", "weekend-runs"] },
    { id: "6", name: "Right Now", description: "The conversations, curiosities, and wonderfully random things people cannot stop sharing.", members: 18765, online: 5678, category: "trending", categoryLabel: "Trending", icon: TrendingUp, tone: "dark", rooms: ["today", "deep-dives", "voice-lounge"] },
];

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
    { id: "all", name: "All spaces", icon: Sparkles },
    { id: "gaming", name: "Gaming", icon: Gamepad2 },
    { id: "music", name: "Music", icon: Music },
    { id: "tech", name: "Tech", icon: Code },
    { id: "culture", name: "Books", icon: BookOpen },
    { id: "health", name: "Wellness", icon: Heart },
    { id: "trending", name: "Trending", icon: TrendingUp },
];
