import { createFileRoute, Link } from "@tanstack/react-router";
import { BackgroundShapes } from "../components/BackgroundShapes";
import { NavBar } from "../components/navBar/navBar";
import styles from "./index.module.scss";
import { FloatingElements } from "../components/floatingElements/floatingElements";
import { Users, Video, Shield, Briefcase, Gamepad2, BookOpen, Palette, Lock, Zap } from "lucide-react";
import { Footer } from "../components/footer/Footer";

export const Route = createFileRoute("/")({
    component: () => (
        <div className={styles.root}>
            <BackgroundShapes />
            <NavBar />

            <main>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroLeft}>
                            <div className={styles.badge}>
                                <div className={styles.dot} />
                                <span>Platform in Beta</span>
                            </div>
                            <h1 className={styles.heroTitle}>
                                Build Your
                                <br />
                                Community
                            </h1>
                            <p className={styles.subtitle}>
                                Chat, share, and connect with your friends, teams, and communities in a warm and
                                welcoming space.
                            </p>
                            <div className={styles.cta}>
                                <Link to="/signup" className={`${styles.button} ${styles.primary}`}>
                                    Get Started
                                </Link>
                                <Link to="/explore" className={`${styles.button} ${styles.secondary}`}>
                                    Discover Communities
                                </Link>
                            </div>
                        </div>
                        <div className={styles.heroRight}>
                            <FloatingElements />
                        </div>
                    </div>
                </section>

                <section className={styles.features}>
                    <div className={styles.feature}>
                        <div className={styles.icon}>
                            <Users />
                        </div>
                        <h3>Vibrant Communities</h3>
                        <p>Join or create communities around your passions and meet like-minded people.</p>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.icon}>
                            <Video />
                        </div>
                        <h3>Voice & Text Channels</h3>
                        <p>
                            Organize your discussions with dedicated channels. Text chat or connect via voice for live
                            conversations.
                        </p>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.icon}>
                            <Shield />
                        </div>
                        <h3>Safe & Private</h3>
                        <p>
                            Control who can join your community and manage permissions for each member for a secure
                            experience.
                        </p>
                    </div>
                </section>

                <section className={styles.security}>
                    <div className={styles.securityContent}>
                        <div className={styles.securityIcon}>
                            <Lock />
                        </div>
                        <h2>Security & Privacy First</h2>
                        <p className={styles.securityDescription}>
                            Your conversations are protected with end-to-end encryption. Our Apache Kafka-based
                            infrastructure ensures reliable and fast messaging.
                        </p>
                        <div className={styles.securityFeatures}>
                            <div className={styles.securityFeature}>
                                <Lock className={styles.featureIcon} />
                                <span>E2E Encryption</span>
                            </div>
                            <div className={styles.securityFeature}>
                                <Zap className={styles.featureIcon} />
                                <span>Powered by Kafka</span>
                            </div>
                            <div className={styles.securityFeature}>
                                <Shield className={styles.featureIcon} />
                                <span>Secure Data</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.useCases}>
                    <div className={styles.sectionTitle}>
                        <h2>Perfect for All Your Needs</h2>
                        <p>Whether you're a team, community, or group of friends</p>
                    </div>
                    <div className={styles.useCasesGrid}>
                        <div className={styles.useCase}>
                            <div className={styles.useCaseIcon}>
                                <Briefcase />
                            </div>
                            <h3>Professional Teams</h3>
                            <p>
                                Collaborate effectively with colleagues, share files, and organize meetings with just a
                                few clicks.
                            </p>
                        </div>
                        <div className={styles.useCase}>
                            <div className={styles.useCaseIcon}>
                                <Gamepad2 />
                            </div>
                            <h3>Gaming Communities</h3>
                            <p>
                                Create voice channels for your gaming sessions, organize tournaments, and stay connected
                                with your guild.
                            </p>
                        </div>
                        <div className={styles.useCase}>
                            <div className={styles.useCaseIcon}>
                                <BookOpen />
                            </div>
                            <h3>Study Groups</h3>
                            <p>Share notes, discuss courses, and organize review sessions with your classmates.</p>
                        </div>
                        <div className={styles.useCase}>
                            <div className={styles.useCaseIcon}>
                                <Palette />
                            </div>
                            <h3>Content Creators</h3>
                            <p>
                                Build a community around your passion, share your creations, and engage with your fans.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.callToAction}>
                    <h2>Ready to Join the Conversation?</h2>
                    <p className={styles.subtitle}>Get started now and create your first community.</p>
                    <Link to="/signup" className={styles.button}>
                        Create Free Account
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    ),
});
