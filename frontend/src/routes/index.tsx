import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowRight,
    BookOpen,
    Check,
    Gamepad2,
    Headphones,
    MessageCircleMore,
    Palette,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from "lucide-react";
import { Footer } from "../components/footer/footer";
import { FloatingElements } from "../components/floatingElements/floatingElements";
import { NavBar } from "../components/navBar/navBar";
import styles from "./index.module.scss";

export const Route = createFileRoute("/")({
    component: LandingPage,
});

// These cards show how the same product can serve different kinds of groups.
const communityTypes = [
    {
        icon: Gamepad2,
        title: "Gaming crews",
        description: "Plan the next session, jump into voice, and keep every running joke alive.",
        detail: "Raids · LFG · Voice rooms",
        className: styles.gamingCard,
    },
    {
        icon: Palette,
        title: "Creative circles",
        description: "Share work in progress, trade feedback, and make something together.",
        detail: "Showcase · Feedback · Resources",
        className: styles.creativeCard,
    },
    {
        icon: BookOpen,
        title: "Study groups",
        description: "Turn scattered notes and late-night questions into steady progress.",
        detail: "Notes · Focus rooms · Q&A",
        className: styles.studyCard,
    },
    {
        icon: UsersRound,
        title: "Friend groups",
        description: "A shared home for weekend plans, photo dumps, and everyday check-ins.",
        detail: "Plans · Photos · Catch-ups",
        className: styles.friendsCard,
    },
];

/** Renders the public landing page and its main product story. */
function LandingPage() {
    return (
        <div className={styles.root}>
            <NavBar />

            <main>
                <section className={styles.hero}>
                    <div className={styles.heroGlow} aria-hidden="true" />
                    <div className={styles.heroContent}>
                        <div className={styles.heroCopy}>
                            <h1>
                                Your people. Your place.
                                <span>Your kind of chaos.</span>
                            </h1>
                            <p className={styles.heroLead}>
                                Knotly brings conversations, voice hangouts, and shared moments into one warm,
                                organized home—without making community feel like work.
                            </p>
                            <div className={styles.heroActions}>
                                <Link to="/signup" className={styles.primaryButton}>
                                    Create your space
                                    <ArrowRight size={18} aria-hidden="true" />
                                </Link>
                                <Link to="/explore" className={styles.secondaryButton}>
                                    Explore communities
                                </Link>
                            </div>
                            <div className={styles.heroNotes} aria-label="Knotly highlights">
                                <span><Check size={15} aria-hidden="true" /> Free to join</span>
                                <span><Check size={15} aria-hidden="true" /> Easy to set up</span>
                                <span><Check size={15} aria-hidden="true" /> Yours to shape</span>
                            </div>
                        </div>

                        <div className={styles.productPreview}>
                            <FloatingElements />
                        </div>
                    </div>

                    <div className={styles.scrollCue} aria-hidden="true">
                        <span>See what makes it feel different</span>
                        <div />
                    </div>
                </section>

                <section className={styles.featureSection} id="features">
                    <div className={styles.sectionIntro}>
                        <span className={styles.sectionLabel}>Made for real communities</span>
                        <h2>Less scrolling.<br />More belonging.</h2>
                        <p>
                            The structure you need to stay organized, with the casual energy that makes people want to
                            come back.
                        </p>
                    </div>

                    <div className={styles.bentoGrid}>
                        <article className={`${styles.bentoCard} ${styles.conversationCard}`}>
                            <div className={styles.cardIcon}><MessageCircleMore aria-hidden="true" /></div>
                            <div className={styles.cardCopy}>
                                <h3>Conversations with a place to land</h3>
                                <p>
                                    Give every topic its own room, so plans, ideas, and good conversations never get
                                    buried in one endless feed.
                                </p>
                            </div>
                            <div className={styles.channelStack} aria-hidden="true">
                                <div><span>#</span> weekend-plans <small>12</small></div>
                                <div><span>#</span> share-your-work <small>8</small></div>
                                <div><span>#</span> random-but-important <small>24</small></div>
                            </div>
                        </article>

                        <article className={`${styles.bentoCard} ${styles.voiceCard}`}>
                            <div className={styles.cardIcon}><Headphones aria-hidden="true" /></div>
                            <h3>Drop in. Hang out.</h3>
                            <p>Voice rooms make catching up feel spontaneous, not scheduled.</p>
                            <div className={styles.voiceRoom} aria-hidden="true">
                                <div className={styles.voicePulse}><Headphones size={18} /></div>
                                <div><strong>Cozy corner</strong><span>4 friends talking</span></div>
                                <div className={styles.miniAvatars}><i>J</i><i>M</i><i>A</i><i>+</i></div>
                            </div>
                        </article>

                        <article className={`${styles.bentoCard} ${styles.discoveryCard}`}>
                            <div className={styles.cardIcon}><Sparkles aria-hidden="true" /></div>
                            <h3>Find your kind of people</h3>
                            <p>Explore spaces built around the things you already love.</p>
                            <div className={styles.topicCloud} aria-hidden="true">
                                <span>Indie games</span><span>Photography</span><span>Running</span>
                                <span>Design</span><span>Books</span>
                            </div>
                        </article>

                        <article className={`${styles.bentoCard} ${styles.controlCard}`}>
                            <div className={styles.cardIcon}><ShieldCheck aria-hidden="true" /></div>
                            <div className={styles.cardCopy}>
                                <h3>Your community, your boundaries</h3>
                                <p>
                                    Keep things comfortable with clear roles, thoughtful permissions, and the freedom
                                    to choose who gets a seat at the table.
                                </p>
                            </div>
                            <div className={styles.permissionList} aria-hidden="true">
                                <div><i className={styles.ownerDot} /><span><strong>Owners</strong><small>Full control</small></span><Check size={16} /></div>
                                <div><i className={styles.memberDot} /><span><strong>Members</strong><small>Chat & voice</small></span><Check size={16} /></div>
                                <div><i className={styles.guestDot} /><span><strong>Guests</strong><small>Selected rooms</small></span><Check size={16} /></div>
                            </div>
                        </article>
                    </div>
                </section>

                <section className={styles.communitiesSection}>
                    <div className={styles.communitiesHeader}>
                        <div>
                            <span className={styles.sectionLabel}>One platform, many worlds</span>
                            <h2>A place for whatever<br />brings you together.</h2>
                        </div>
                        <p>
                            No two communities feel the same. Knotly gives each one room to build its own rhythm,
                            rituals, and personality.
                        </p>
                    </div>

                    <div className={styles.communityGrid}>
                        {communityTypes.map(({ icon: Icon, title, description, detail, className }) => (
                            <article className={`${styles.communityCard} ${className}`} key={title}>
                                <div className={styles.communityTop}>
                                    <div className={styles.communityIcon}><Icon aria-hidden="true" /></div>
                                    <ArrowRight aria-hidden="true" />
                                </div>
                                <div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                    <span>{detail}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.stepsSection}>
                    <div className={styles.stepsIntro}>
                        <span className={styles.sectionLabel}>From “we should” to “we did”</span>
                        <h2>Your new gathering place,<br />ready in minutes.</h2>
                    </div>
                    <div className={styles.steps}>
                        <article>
                            <span>1</span>
                            <div><h3>Start a space</h3><p>Give your community a name, a look, and a reason to gather.</p></div>
                        </article>
                        <article>
                            <span>2</span>
                            <div><h3>Make it yours</h3><p>Add rooms for the conversations and moments your people share.</p></div>
                        </article>
                        <article>
                            <span>3</span>
                            <div><h3>Bring people in</h3><p>Share one invite and let the introductions, ideas, and inside jokes begin.</p></div>
                        </article>
                    </div>
                </section>

                <section className={styles.finalCta}>
                    <div className={styles.ctaOrb} aria-hidden="true" />
                    <div className={styles.ctaMark} aria-hidden="true">K</div>
                    <div className={styles.ctaCopy}>
                        <span>There’s room for everyone</span>
                        <h2>Your group chat deserves room to grow.</h2>
                        <p>Create a home your people will actually want to come back to.</p>
                    </div>
                    <Link to="/signup" className={styles.lightButton}>
                        Start your community
                        <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
