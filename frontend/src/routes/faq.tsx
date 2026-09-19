import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowRight,
    ChevronRight,
    Compass,
    MessageCircleMore,
    Mic2,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Footer } from "../components/footer/footer";
import { NavBar } from "../components/navBar/navBar";
import styles from "./faq.module.scss";

export const Route = createFileRoute("/faq")({
    component: FAQPage,
});

type CategoryId = "getting-started" | "conversations" | "communities" | "account";

interface FAQEntry {
    category: CategoryId;
    question: string;
    answer: string;
}

const CATEGORIES = [
    {
        id: "getting-started" as const,
        label: "Getting started",
        description: "The essentials for finding or creating your place.",
        icon: Sparkles,
    },
    {
        id: "conversations" as const,
        label: "Chat & voice",
        description: "Rooms, messages, and dropping into a conversation.",
        icon: MessageCircleMore,
    },
    {
        id: "communities" as const,
        label: "Communities",
        description: "Invites, organization, roles, and discovery.",
        icon: UsersRound,
    },
    {
        id: "account" as const,
        label: "Account & safety",
        description: "Your profile, access, privacy, and moderation.",
        icon: ShieldCheck,
    },
];

const FAQS: FAQEntry[] = [
    {
        category: "getting-started",
        question: "What is Knotly?",
        answer: "Knotly is a place for communities to talk, organize conversations into rooms, and spend time together in voice. It is designed for friend groups, clubs, study circles, creative collectives, and any group that wants a shared home online.",
    },
    {
        category: "getting-started",
        question: "How do I create my first community?",
        answer: "Create an account, choose a name and an icon for your community, then add the rooms your group needs. You can start small with one general room and shape the space as your community grows.",
    },
    {
        category: "getting-started",
        question: "Can I join an existing community instead?",
        answer: "Yes. Open an invite shared by a community member, or browse public communities from Explore. You can belong to several communities and move between them from their icons in the app.",
    },
    {
        category: "getting-started",
        question: "Is Knotly free to use?",
        answer: "Knotly is currently free during its beta. The core experience—communities, text rooms, and voice rooms—is available without a paid plan while we learn what groups need most.",
    },
    {
        category: "conversations",
        question: "How are conversations organized?",
        answer: "Each community can create rooms around a topic, project, or activity. Keeping conversations separate makes it easier to follow what matters without losing the casual feeling of a group chat.",
    },
    {
        category: "conversations",
        question: "How do voice rooms work?",
        answer: "Voice rooms are always ready when your community is. Join a room to see who is there and start talking—there is no meeting link to create and no calendar invite required.",
    },
    {
        category: "conversations",
        question: "Can I see who is speaking?",
        answer: "Yes. People in a voice room appear beside the room, and an audio indicator shows who is currently speaking so the conversation stays easy to follow.",
    },
    {
        category: "communities",
        question: "How do I invite people?",
        answer: "Create an invite from your community and share its link with the people you want to bring in. Community owners can manage how invitations are used from their community settings.",
    },
    {
        category: "communities",
        question: "Can I personalize a community?",
        answer: "Yes. Choose its identity, organize rooms around the way your group talks, and use categories to keep larger spaces readable. A study group and a gaming community do not need to feel the same.",
    },
    {
        category: "communities",
        question: "What can roles and permissions control?",
        answer: "Roles help community owners decide who can manage the space and which rooms members or guests can access. This keeps responsibilities clear without making everyday conversation feel complicated.",
    },
    {
        category: "communities",
        question: "How do I discover new communities?",
        answer: "Visit Explore to browse public communities by interest. Each card gives you a quick sense of the group, its popular rooms, and how active it is before you decide to join.",
    },
    {
        category: "account",
        question: "Can I use Knotly on my phone?",
        answer: "The web experience is designed to work across desktop and mobile browsers. A larger screen is useful for busy communities, but you can still check conversations and stay connected from your phone.",
    },
    {
        category: "account",
        question: "Who controls access to a community?",
        answer: "Community owners and moderators manage invitations, roles, and room permissions. Members only see and use the spaces their access allows.",
    },
    {
        category: "account",
        question: "What should I do if someone makes the space uncomfortable?",
        answer: "Start with the community’s moderators, who can review the situation and manage the member’s access. Community rules and clearly assigned moderators make it easier to handle problems early.",
    },
    {
        category: "account",
        question: "Where can I change my profile and preferences?",
        answer: "Open Settings from the app to update your profile and adjust the preferences available to your account. Community-specific controls remain inside each community’s settings.",
    },
];

interface FAQItemProps {
    entry: FAQEntry;
    categoryLabel?: string;
    isOpen: boolean;
    onToggle: () => void;
}

function FAQItem({ entry, categoryLabel, isOpen, onToggle }: FAQItemProps) {
    const answerId = useId();
    const questionId = `${answerId}-question`;

    return (
        <article className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}>
            <button
                id={questionId}
                type="button"
                className={styles.question}
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={answerId}
            >
                <span>
                    {categoryLabel && <small>{categoryLabel}</small>}
                    {entry.question}
                </span>
                <i><Plus className={styles.plusIcon} aria-hidden="true" /></i>
            </button>
            <div
                id={answerId}
                className={styles.answer}
                role="region"
                aria-labelledby={questionId}
                aria-hidden={!isOpen}
            >
                <div><p>{entry.answer}</p></div>
            </div>
        </article>
    );
}

function FAQPage() {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryId>("getting-started");
    const [query, setQuery] = useState("");
    const [openQuestion, setOpenQuestion] = useState<string | null>(FAQS[0].question);

    const normalizedQuery = query.trim().toLowerCase();
    const activeCategoryInfo = CATEGORIES.find((category) => category.id === activeCategory) ?? CATEGORIES[0];
    const visibleFaqs = useMemo(() => {
        if (!normalizedQuery) return FAQS.filter((entry) => entry.category === activeCategory);

        return FAQS.filter((entry) =>
            `${entry.question} ${entry.answer}`.toLowerCase().includes(normalizedQuery),
        );
    }, [activeCategory, normalizedQuery]);

    useEffect(() => {
        const focusSearch = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", focusSearch);
        return () => window.removeEventListener("keydown", focusSearch);
    }, []);

    const chooseCategory = (category: CategoryId) => {
        const firstQuestion = FAQS.find((entry) => entry.category === category)?.question ?? null;
        setActiveCategory(category);
        setQuery("");
        setOpenQuestion(firstQuestion);
        document.getElementById("answers")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className={styles.page}>
            <NavBar />

            <main>
                <div className={styles.heroShell}>
                    <section className={styles.hero}>
                        <div className={styles.heroCopy}>
                            <span className={styles.eyebrow}>Knotly help</span>
                            <h1>Answers, without the maze.</h1>
                            <p>Find the useful bit, get back to your people, and leave the technical jargon behind.</p>

                            <label className={styles.searchBox}>
                                <span className={styles.srOnly}>Search frequently asked questions</span>
                                <Search size={20} aria-hidden="true" />
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        setOpenQuestion(null);
                                    }}
                                    placeholder="Search invites, voice rooms, roles…"
                                />
                                <kbd>⌘ K</kbd>
                            </label>
                        </div>
                    </section>
                </div>

                <section className={styles.quickPaths} aria-labelledby="quick-heading">
                    <div className={styles.sectionIntro}>
                        <span>Start here</span>
                        <h2 id="quick-heading">What are you trying to do?</h2>
                    </div>
                    <div className={styles.quickGrid}>
                        <button type="button" onClick={() => chooseCategory("getting-started")}>
                            <span className={styles.quickIcon}><Sparkles /></span>
                            <span><strong>Set up a new space</strong><small>Accounts, first rooms, and the basics</small></span>
                            <ChevronRight aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => chooseCategory("conversations")}>
                            <span className={styles.quickIcon}><Mic2 /></span>
                            <span><strong>Join the conversation</strong><small>Text rooms, voice, and activity</small></span>
                            <ChevronRight aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => chooseCategory("communities")}>
                            <span className={styles.quickIcon}><UsersRound /></span>
                            <span><strong>Shape your community</strong><small>Invites, roles, and organization</small></span>
                            <ChevronRight aria-hidden="true" />
                        </button>
                    </div>
                </section>

                <section className={styles.helpSection}>
                    <aside className={styles.topicRail} aria-label="FAQ topics">
                        <span className={styles.railLabel}>Browse by topic</span>
                        <div className={styles.topicList}>
                            {CATEGORIES.map(({ id, label, description, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className={!normalizedQuery && activeCategory === id ? styles.activeTopic : ""}
                                    onClick={() => chooseCategory(id)}
                                >
                                    <i><Icon aria-hidden="true" /></i>
                                    <span><strong>{label}</strong><small>{description}</small></span>
                                    <ChevronRight aria-hidden="true" />
                                </button>
                            ))}
                        </div>

                        <div className={styles.exploreNote}>
                            <Compass size={20} aria-hidden="true" />
                            <strong>Looking for your people?</strong>
                            <p>Browse communities built around games, study, music, books, and more.</p>
                            <Link to="/explore">Explore communities <ArrowRight size={15} /></Link>
                        </div>
                    </aside>

                    <div className={styles.answersPanel} id="answers">
                        <header className={styles.answersHeader}>
                            <div>
                                <span>{normalizedQuery ? "Search results" : activeCategoryInfo.label}</span>
                                <h2>{normalizedQuery ? `Results for “${query.trim()}”` : activeCategoryInfo.description}</h2>
                            </div>
                            <strong>{visibleFaqs.length} {visibleFaqs.length === 1 ? "answer" : "answers"}</strong>
                        </header>

                        {visibleFaqs.length > 0 ? (
                            <div className={styles.faqList}>
                                {visibleFaqs.map((entry) => (
                                    <FAQItem
                                        key={entry.question}
                                        entry={entry}
                                        categoryLabel={normalizedQuery ? CATEGORIES.find((category) => category.id === entry.category)?.label : undefined}
                                        isOpen={openQuestion === entry.question}
                                        onToggle={() => setOpenQuestion((current) => current === entry.question ? null : entry.question)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Search size={26} aria-hidden="true" />
                                <h3>No answer hiding here.</h3>
                                <p>Try a shorter phrase, or choose a topic from the list.</p>
                                <button type="button" onClick={() => setQuery("")}>Clear search</button>
                            </div>
                        )}
                    </div>
                </section>

                <section className={styles.bottomCta}>
                    <div>
                        <span>Ready when you are</span>
                        <h2>Make some room for your people.</h2>
                        <p>Start a community, add the rooms you need, and send the first invite.</p>
                    </div>
                    <Link to="/signup">Create your space <ArrowRight size={18} /></Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
