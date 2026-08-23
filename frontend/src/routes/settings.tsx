import { ArrowLeft, User, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from "lucide-react";
import { useState } from "react";
import styles from "./Settings.module.scss";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
    component: RouteComponent,
});

export function RouteComponent() {
    const [activeSection, setActiveSection] = useState("account");
    const [notifications, setNotifications] = useState({
        messages: true,
        mentions: true,
        communities: false,
        sounds: true,
    });

    return (
        <div className={styles.settings}>
            <aside className={styles.sidebar}>
                <Link to="/home" className={styles.backLink}>
                    <ArrowLeft />
                    <span>Back</span>
                </Link>

                <nav className={styles.nav}>
                    <button
                        onClick={() => setActiveSection("account")}
                        className={`${styles.navButton} ${activeSection === "account" ? styles.active : ""}`}
                    >
                        <User />
                        <span>My Account</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("notifications")}
                        className={`${styles.navButton} ${activeSection === "notifications" ? styles.active : ""}`}
                    >
                        <Bell />
                        <span>Notifications</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("privacy")}
                        className={`${styles.navButton} ${activeSection === "privacy" ? styles.active : ""}`}
                    >
                        <Shield />
                        <span>Privacy</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("appearance")}
                        className={`${styles.navButton} ${activeSection === "appearance" ? styles.active : ""}`}
                    >
                        <Palette />
                        <span>Appearance</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("language")}
                        className={`${styles.navButton} ${activeSection === "language" ? styles.active : ""}`}
                    >
                        <Globe />
                        <span>Language</span>
                    </button>

                    <div className={styles.divider} />

                    <button className={styles.navButton}>
                        <HelpCircle />
                        <span>Help & Support</span>
                    </button>

                    <button className={`${styles.navButton} ${styles.danger}`}>
                        <LogOut />
                        <span>Log Out</span>
                    </button>
                </nav>
            </aside>

            <main className={styles.main}>
                <div className={styles.content}>
                    {activeSection === "account" && (
                        <>
                            <h1>My Account</h1>

                            <div className={styles.card}>
                                <div className={styles.avatarSection}>
                                    <div className={styles.avatar}>JD</div>
                                    <button>Change Avatar</button>
                                </div>

                                <div className={styles.formField}>
                                    <label>Username</label>
                                    <input type="text" defaultValue="John Doe" />
                                </div>

                                <div className={styles.formField}>
                                    <label>Email</label>
                                    <input type="email" defaultValue="john.doe@example.com" />
                                </div>

                                <div className={styles.formField}>
                                    <label>Bio</label>
                                    <textarea rows={3} placeholder="Tell us about yourself..." />
                                </div>
                            </div>

                            <div className={styles.card}>
                                <h3>Security</h3>
                                <div className={styles.actionList}>
                                    <button className={styles.actionButton}>Change Password</button>
                                    <button className={styles.actionButton}>Enable Two-Factor Authentication</button>
                                </div>
                            </div>

                            <button className={styles.saveButton}>Save Changes</button>
                        </>
                    )}

                    {activeSection === "notifications" && (
                        <>
                            <h1>Notifications</h1>

                            <div className={styles.card}>
                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.settingName}>Direct Messages</div>
                                        <div className={styles.settingDescription}>
                                            Receive notifications for private messages
                                        </div>
                                    </div>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={notifications.messages}
                                            onChange={(e) =>
                                                setNotifications({ ...notifications, messages: e.target.checked })
                                            }
                                        />
                                        <div className={styles.toggleTrack} />
                                    </label>
                                </div>

                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.settingName}>Mentions</div>
                                        <div className={styles.settingDescription}>
                                            Get notified when someone mentions you
                                        </div>
                                    </div>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={notifications.mentions}
                                            onChange={(e) =>
                                                setNotifications({ ...notifications, mentions: e.target.checked })
                                            }
                                        />
                                        <div className={styles.toggleTrack} />
                                    </label>
                                </div>

                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.settingName}>Community Activity</div>
                                        <div className={styles.settingDescription}>
                                            New messages in your communities
                                        </div>
                                    </div>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={notifications.communities}
                                            onChange={(e) =>
                                                setNotifications({ ...notifications, communities: e.target.checked })
                                            }
                                        />
                                        <div className={styles.toggleTrack} />
                                    </label>
                                </div>

                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.settingName}>Notification Sounds</div>
                                        <div className={styles.settingDescription}>
                                            Play a sound when receiving notifications
                                        </div>
                                    </div>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={notifications.sounds}
                                            onChange={(e) =>
                                                setNotifications({ ...notifications, sounds: e.target.checked })
                                            }
                                        />
                                        <div className={styles.toggleTrack} />
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === "privacy" && (
                        <>
                            <h1>Privacy & Security</h1>

                            <div className={styles.card}>
                                <div className={styles.formField}>
                                    <label>Profile Visibility</label>
                                    <select>
                                        <option>Public</option>
                                        <option>Friends Only</option>
                                        <option>Private</option>
                                    </select>
                                </div>

                                <div className={styles.formField}>
                                    <label>Direct Messages</label>
                                    <select>
                                        <option>Everyone</option>
                                        <option>Friends and Community Members</option>
                                        <option>Friends Only</option>
                                    </select>
                                </div>

                                <h3>Data & History</h3>
                                <div className={styles.actionList}>
                                    <button className={styles.actionButton}>Download My Data</button>
                                    <button className={`${styles.actionButton} ${styles.danger}`}>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === "appearance" && (
                        <>
                            <h1>Appearance</h1>

                            <div className={styles.card}>
                                <h3>Theme</h3>
                                <div className={styles.themeGrid}>
                                    <button className={`${styles.themeOption} ${styles.active}`}>
                                        <div className={`${styles.themePreview} ${styles.light}`} />
                                        <div className={styles.themeName}>Light</div>
                                    </button>
                                    <button className={styles.themeOption}>
                                        <div className={`${styles.themePreview} ${styles.dark}`} />
                                        <div className={styles.themeName}>Dark</div>
                                    </button>
                                    <button className={styles.themeOption}>
                                        <div className={`${styles.themePreview} ${styles.auto}`} />
                                        <div className={styles.themeName}>Auto</div>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.card}>
                                <h3>Text Size</h3>
                                <input type="range" min="12" max="20" defaultValue="16" className={styles.rangeInput} />
                                <div className={styles.rangeLabels}>
                                    <span>Small</span>
                                    <span>Medium</span>
                                    <span>Large</span>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === "language" && (
                        <>
                            <h1>Language & Region</h1>

                            <div className={styles.card}>
                                <div className={styles.formField}>
                                    <label>Interface Language</label>
                                    <select>
                                        <option>English</option>
                                        <option>Français</option>
                                        <option>Español</option>
                                        <option>Deutsch</option>
                                    </select>
                                </div>

                                <div className={styles.formField}>
                                    <label>Time Zone</label>
                                    <select>
                                        <option>America/New_York (GMT-5)</option>
                                        <option>Europe/Paris (GMT+1)</option>
                                        <option>Asia/Tokyo (GMT+9)</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
