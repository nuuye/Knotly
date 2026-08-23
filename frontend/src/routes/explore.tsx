import { Search, Users, TrendingUp, Gamepad2, Music, Code, BookOpen, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { CreateCommunityModal } from "../components/createCommunityModal/CreateCommunityModal";
import styles from "./Explore.module.scss";
import { Link, createFileRoute } from "@tanstack/react-router";
import { NavBar } from "../components/navBar/navBar";

const COMMUNITIES = [
    {
        id: "1",
        name: "Gamers Paradise",
        description: "A community for gaming enthusiasts",
        members: 12543,
        online: 3421,
        category: "gaming",
        icon: Gamepad2,
        banner: "orange",
    },
    {
        id: "2",
        name: "Music Lovers",
        description: "Share and discover music together",
        members: 8932,
        online: 1876,
        category: "music",
        icon: Music,
        banner: "amber",
    },
    {
        id: "3",
        name: "Dev Community",
        description: "Developers, share your code and projects",
        members: 15678,
        online: 4532,
        category: "tech",
        icon: Code,
        banner: "red",
    },
    {
        id: "4",
        name: "Book Club",
        description: "Let's discuss our favorite reads",
        members: 5421,
        online: 892,
        category: "culture",
        icon: BookOpen,
        banner: "orangeDark",
    },
    {
        id: "5",
        name: "Fitness & Health",
        description: "Stay motivated and reach your goals",
        members: 9234,
        online: 2134,
        category: "health",
        icon: Heart,
        banner: "redOrange",
    },
    {
        id: "6",
        name: "Trending Now",
        description: "Today's trending topics",
        members: 18765,
        online: 5678,
        category: "trending",
        icon: TrendingUp,
        banner: "amberRed",
    },
];

const CATEGORIES = [
    { id: "all", name: "All", icon: Users },
    { id: "gaming", name: "Gaming", icon: Gamepad2 },
    { id: "music", name: "Music", icon: Music },
    { id: "tech", name: "Tech", icon: Code },
    { id: "culture", name: "Culture", icon: BookOpen },
    { id: "health", name: "Health", icon: Heart },
    { id: "trending", name: "Trending", icon: TrendingUp },
];

export const Route = createFileRoute("/explore")({
    component: RouteComponent,
});

export function RouteComponent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredCommunities = COMMUNITIES.filter((community) => {
        const matchesSearch =
            community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || community.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={styles.explore}>
            <NavBar />
            <main className={styles.main}>
                <div className={styles.actionContainer}>
                    <div className={styles.searchBar}>
                        <div className={styles.searchInput}>
                            <Search />
                            <input
                                type="text"
                                placeholder="Search for a community..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button onClick={() => setIsCreateModalOpen(true)} className={styles.createButton}>
                            <Plus />
                            Create Community
                        </button>
                        <Link to="/home" className={styles.button}>
                            My Communities
                        </Link>
                    </div>
                </div>

                <div className={styles.categories}>
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`${styles.category} ${selectedCategory === category.id ? styles.active : ""}`}
                            >
                                <Icon />
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {filteredCommunities.length > 0 ? (
                    <div className={styles.grid}>
                        {filteredCommunities.map((community) => {
                            const Icon = community.icon;
                            return (
                                <Link
                                    key={community.id}
                                    to={`/community/${community.id}`}
                                    className={styles.communityCard}
                                >
                                    <div className={`${styles.iconBox} ${styles[community.banner]}`}>
                                        <Icon />
                                    </div>
                                    <h3>{community.name}</h3>
                                    <p className={styles.description}>{community.description}</p>
                                    <div className={styles.stats}>
                                        <div className={styles.members}>
                                            <Users />
                                            <span>{community.members.toLocaleString()} members</span>
                                        </div>
                                        <div className={styles.online}>
                                            <div className={styles.dot} />
                                            <span>{community.online.toLocaleString()} online</span>
                                        </div>
                                    </div>
                                    <button className={styles.joinButton}>Join</button>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <Users />
                        <h3>No communities found</h3>
                        <p>Try different keywords</p>
                    </div>
                )}
            </main>

            <CreateCommunityModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}
