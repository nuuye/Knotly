import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowRight,
    BookOpen,
    Code,
    Gamepad2,
    Heart,
    Music,
    Plus,
    Search,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";
import { CreateCommunityModal } from "../components/createCommunityModal/createCommunityModal";
import { Footer } from "../components/footer/footer";
import { NavBar } from "../components/navBar/navBar";
import styles from "./explore.module.scss";

const COMMUNITIES = [
    {
        id: "1",
        name: "Gamers Paradise",
        description: "Co-op nights, new releases, and a squad that is always ready for one more game.",
        members: 12543,
        online: 3421,
        category: "gaming",
        categoryLabel: "Gaming",
        icon: Gamepad2,
        tone: "ember",
        rooms: ["lfg", "game-nights", "squad-room"],
    },
    {
        id: "2",
        name: "Sound & Soul",
        description: "Trade playlists, discover hidden gems, and listen together after hours.",
        members: 8932,
        online: 1876,
        category: "music",
        categoryLabel: "Music",
        icon: Music,
        tone: "gold",
        rooms: ["now-playing", "discoveries"],
    },
    {
        id: "3",
        name: "The Dev Den",
        description: "A friendly corner for side projects, thoughtful feedback, and stubborn bugs.",
        members: 15678,
        online: 4532,
        category: "tech",
        categoryLabel: "Technology",
        icon: Code,
        tone: "clay",
        rooms: ["show-your-work", "help-desk"],
    },
    {
        id: "4",
        name: "The Reading Room",
        description: "Slow reads, lively opinions, and a monthly book worth talking about.",
        members: 5421,
        online: 892,
        category: "culture",
        categoryLabel: "Books",
        icon: BookOpen,
        tone: "cream",
        rooms: ["current-read", "spoilers"],
    },
    {
        id: "5",
        name: "Move Together",
        description: "Share small wins, find training partners, and keep each other moving.",
        members: 9234,
        online: 2134,
        category: "health",
        categoryLabel: "Wellness",
        icon: Heart,
        tone: "rose",
        rooms: ["daily-check-in", "weekend-runs"],
    },
    {
        id: "6",
        name: "Right Now",
        description: "The conversations, curiosities, and wonderfully random things people cannot stop sharing.",
        members: 18765,
        online: 5678,
        category: "trending",
        categoryLabel: "Trending",
        icon: TrendingUp,
        tone: "dark",
        rooms: ["today", "deep-dives", "voice-lounge"],
    },
];

const CATEGORIES = [
    { id: "all", name: "All spaces", icon: Sparkles },
    { id: "gaming", name: "Gaming", icon: Gamepad2 },
    { id: "music", name: "Music", icon: Music },
    { id: "tech", name: "Tech", icon: Code },
    { id: "culture", name: "Books", icon: BookOpen },
    { id: "health", name: "Wellness", icon: Heart },
    { id: "trending", name: "Trending", icon: TrendingUp },
];

export const Route = createFileRoute("/explore")({
    component: ExplorePage,
});

function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredCommunities = COMMUNITIES.filter((community) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            community.name.toLowerCase().includes(query) || community.description.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "all" || community.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={styles.explore}>
            <NavBar />

            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroOrb} aria-hidden="true" />
                    <div className={styles.heroCopy}>
                        <span className={styles.eyebrow}>Explore Knotly</span>
                        <h1>Find a place that<br /><em>feels like yours.</em></h1>
                        <p>
                            Browse communities built around the games, ideas, habits, and interests you already love.
                        </p>
                    </div>

                    <div className={styles.heroActions}>
                        <button type="button" onClick={() => setIsCreateModalOpen(true)} className={styles.createButton}>
                            <Plus size={18} />
                            Start a community
                        </button>
                        <p>Can’t find your people? Make the space you wish existed.</p>
                    </div>
                </section>

                <section className={styles.discovery} aria-label="Community discovery">
                    <div className={styles.searchBox}>
                        <Search size={20} aria-hidden="true" />
                        <input
                            type="search"
                            aria-label="Search communities"
                            placeholder="Search by name or interest…"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        {searchQuery && <span>{filteredCommunities.length} found</span>}
                    </div>

                    <div className={styles.filterHeader}>
                        <div>
                            <span>Browse by interest</span>
                            <small>{filteredCommunities.length} communities to explore</small>
                        </div>
                    </div>

                    <div className={styles.categories}>
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                                <button
                                    type="button"
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={isActive ? styles.activeCategory : undefined}
                                    aria-pressed={isActive}
                                >
                                    <Icon size={16} />
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {filteredCommunities.length > 0 ? (
                    <section className={styles.grid} aria-label="Communities">
                        {filteredCommunities.map((community) => {
                            const Icon = community.icon;
                            return (
                                <article
                                    key={community.id}
                                    className={`${styles.communityCard} ${styles[community.tone]}`}
                                >
                                    <div className={styles.cardTop}>
                                        <div className={styles.communityIcon}><Icon aria-hidden="true" /></div>
                                        <span>{community.categoryLabel}</span>
                                    </div>

                                    <div className={styles.cardCopy}>
                                        <h2>{community.name}</h2>
                                        <p>{community.description}</p>
                                    </div>

                                    <div className={styles.roomPreview} aria-label="Popular rooms">
                                        {community.rooms.map((room) => <span key={room}># {room}</span>)}
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.stats}>
                                            <span><Users size={14} /> {community.members.toLocaleString()}</span>
                                            <span><i /> {community.online.toLocaleString()} online</span>
                                        </div>
                                        <Link to="/signup" aria-label={`Join ${community.name}`}>
                                            Join <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                ) : (
                    <section className={styles.empty}>
                        <div><Search size={24} /></div>
                        <h2>No community found</h2>
                        <p>Try another word or explore a different interest.</p>
                        <button type="button" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                            Show all communities
                        </button>
                    </section>
                )}
            </main>

            <Footer />
            <CreateCommunityModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}
