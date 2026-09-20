import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowRight,
    Plus,
    Search,
    Users,
} from "lucide-react";
import { useState } from "react";
import { CreateCommunityModal } from "../components/createCommunityModal/createCommunityModal";
import { Footer } from "../components/footer/footer";
import { NavBar } from "../components/navBar/navBar";
import { EXPLORE_CATEGORIES, EXPLORE_COMMUNITIES } from "../data/explore";
import styles from "./explore.module.scss";

export const Route = createFileRoute("/explore")({
    component: ExplorePage,
});

/** Lets visitors search and filter the public community list. */
function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Both the text search and selected category must match.
    const filteredCommunities = EXPLORE_COMMUNITIES.filter((community) => {
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
                    <div className={styles.heroSonar} aria-hidden="true">
                        <span />
                    </div>
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
                        {EXPLORE_CATEGORIES.map((category) => {
                            // Icon components are stored in data so every filter uses the same markup.
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
                            // Each community chooses its own icon and color tone from the data above.
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
