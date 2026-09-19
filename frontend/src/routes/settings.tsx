import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowLeft,
    Bell,
    ChevronRight,
    Globe2,
    HelpCircle,
    ImagePlus,
    Languages,
    LockKeyhole,
    LogOut,
    Monitor,
    Moon,
    Palette,
    Save,
    ShieldCheck,
    Smartphone,
    Sun,
    Trash2,
    UserRound,
    Volume2,
} from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { ToggleSetting } from "../components/settings/ToggleSetting";
import {
    INITIAL_NOTIFICATIONS,
    INITIAL_PRIVACY,
    SETTINGS_COPY,
    SETTINGS_SECTIONS,
} from "../data/settings";
import { DEMO_USER_PROFILE } from "../data/user";
import type { NotificationSettings, SettingsSectionId, ThemeId } from "../types/settings";
import { getUsernameMark } from "../utils/text";
import styles from "./settings.module.scss";

export const Route = createFileRoute("/settings")({
    component: SettingsPage,
});

/** Manages the local settings demo and switches between settings sections. */
function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingsSectionId>("account");
    const [theme, setTheme] = useState<ThemeId>("warm");
    const [textSize, setTextSize] = useState(16);
    const [account, setAccount] = useState(DEMO_USER_PROFILE);
    const [savedAccount, setSavedAccount] = useState(DEMO_USER_PROFILE);
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [privacy, setPrivacy] = useState(INITIAL_PRIVACY);

    const sectionCopy = SETTINGS_COPY[activeSection];
    // Compare the draft with the last saved copy before showing the save bar.
    const hasChanges = Object.keys(account).some(
        (key) => account[key as keyof typeof account] !== savedAccount[key as keyof typeof savedAccount],
    );
    const userMark = getUsernameMark(account.username);

    // Update one notification option without replacing the other values.
    const updateNotification = (key: keyof NotificationSettings, checked: boolean) => {
        setNotifications((current) => ({ ...current, [key]: checked }));
    };

    // Preview the selected image locally until the backend handles uploads.
    const updateProfilePicture = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (typeof reader.result === "string") {
                setAccount((current) => ({ ...current, avatarUrl: reader.result as string }));
            }
        });
        reader.readAsDataURL(file);
    };

    return (
        <div className={styles.settingsPage}>
            <header className={styles.mobileHeader}>
                <Link to="/home" className={styles.mobileBackLink}><ArrowLeft aria-hidden="true" /><span>Back to Knotly</span></Link>
            </header>

            <aside className={styles.sidebar}>
                <div>
                    <Link to="/home" className={styles.backLink}>
                        <ArrowLeft aria-hidden="true" /> Back to Knotly
                    </Link>

                    <div className={styles.accountSummary}>
                        <div className={styles.miniAvatar}>{account.avatarUrl ? <img src={account.avatarUrl} alt="" /> : userMark}<span /></div>
                        <div><strong>@{account.username}</strong><span>{account.email}</span></div>
                    </div>

                    <nav className={styles.navigation} aria-label="Settings sections">
                        <span>Settings</span>
                        {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                className={activeSection === id ? styles.activeNav : ""}
                                onClick={() => setActiveSection(id)}
                            >
                                <Icon aria-hidden="true" />
                                <span>{label}</span>
                                <ChevronRight aria-hidden="true" />
                            </button>
                        ))}
                    </nav>
                </div>

                <div className={styles.sidebarFooter}>
                    <Link to="/faq"><HelpCircle aria-hidden="true" /> Help & FAQ</Link>
                    <Link to="/" className={styles.signOut}><LogOut aria-hidden="true" /> Sign out</Link>
                </div>
            </aside>

            <main className={styles.main}>
                <div className={styles.mobileTabs} aria-label="Settings sections">
                    {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            className={activeSection === id ? styles.activeTab : ""}
                            onClick={() => setActiveSection(id)}
                            aria-label={label}
                        >
                            <Icon aria-hidden="true" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.content}>
                    <header className={styles.pageHeading}>
                        <span>{sectionCopy.eyebrow}</span>
                        <h1>{sectionCopy.title}</h1>
                        <p>{sectionCopy.description}</p>
                    </header>

                    {activeSection === "account" && (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                // Saving copies the current draft and hides the save bar.
                                setSavedAccount(account);
                            }}
                        >
                            <section className={`${styles.card} ${styles.profileCard}`}>
                                <div className={styles.profileBanner} />
                                <div className={styles.profileIdentity}>
                                    <div className={styles.largeAvatar}>{account.avatarUrl ? <img src={account.avatarUrl} alt="" /> : userMark}<span /></div>
                                    <div>
                                        <h2>@{account.username}</h2>
                                        <p>Your username is your identity across Knotly. Your real name stays private.</p>
                                    </div>
                                    <label className={styles.secondaryButton}>
                                        <ImagePlus aria-hidden="true" /> Change picture
                                        <input className={styles.srOnly} type="file" accept="image/*" onChange={updateProfilePicture} />
                                    </label>
                                </div>

                                <div className={styles.formGrid}>
                                    <label>
                                        <span>Username</span>
                                        <div className={styles.prefixedInput}><i>@</i><input type="text" value={account.username} onChange={(event) => setAccount((current) => ({ ...current, username: event.target.value }))} minLength={3} maxLength={24} autoComplete="username" required /></div>
                                        <small>This is the only name other people see.</small>
                                    </label>
                                    <label>
                                        <span>Email address</span>
                                        <input type="email" value={account.email} onChange={(event) => setAccount((current) => ({ ...current, email: event.target.value }))} autoComplete="email" required />
                                        <small>Used for sign-in and important account updates.</small>
                                    </label>
                                    <label className={styles.fullField}>
                                        <span>Biography <small>Optional</small></span>
                                        <textarea rows={3} value={account.bio} onChange={(event) => setAccount((current) => ({ ...current, bio: event.target.value }))} maxLength={160} />
                                        <small>Share only what you want other people to know.</small>
                                    </label>
                                </div>
                            </section>

                            <section className={styles.card}>
                                <div className={styles.cardHeading}>
                                    <div><span>Security</span><h2>Keep your account close.</h2></div>
                                    <LockKeyhole aria-hidden="true" />
                                </div>
                                <div className={styles.actionRows}>
                                    <button type="button">
                                        <span><strong>Password</strong><small>Last changed 3 months ago</small></span>
                                        <span>Change <ChevronRight /></span>
                                    </button>
                                    <button type="button">
                                        <span><strong>Two-factor authentication</strong><small>Add an extra step when signing in</small></span>
                                        <span>Set up <ChevronRight /></span>
                                    </button>
                                </div>
                            </section>

                            {hasChanges && (
                                <div className={styles.saveBar}>
                                    <span>You have unsaved changes.</span>
                                    <button type="submit"><Save aria-hidden="true" /> Save changes</button>
                                </div>
                            )}
                        </form>
                    )}

                    {activeSection === "notifications" && (
                        <section className={styles.card}>
                            <div className={styles.cardHeading}>
                                <div><span>Activity</span><h2>Choose your signals.</h2><p>You can still check everything inside Knotly whenever you like.</p></div>
                                <Bell aria-hidden="true" />
                            </div>
                            <div className={styles.settingList}>
                                <ToggleSetting icon={Smartphone} label="Direct messages" description="When someone sends a message directly to you." checked={notifications.directMessages} onChange={(checked) => updateNotification("directMessages", checked)} />
                                <ToggleSetting icon={UserRound} label="Mentions" description="When your name is mentioned in a room." checked={notifications.mentions} onChange={(checked) => updateNotification("mentions", checked)} />
                                <ToggleSetting icon={Globe2} label="Community activity" description="Occasional highlights from your communities." checked={notifications.communityActivity} onChange={(checked) => updateNotification("communityActivity", checked)} />
                                <ToggleSetting icon={Volume2} label="Notification sounds" description="Play a subtle sound for new notifications." checked={notifications.sounds} onChange={(checked) => updateNotification("sounds", checked)} />
                            </div>
                        </section>
                    )}

                    {activeSection === "privacy" && (
                        <>
                            <section className={styles.card}>
                                <div className={styles.cardHeading}>
                                    <div><span>Discoverability</span><h2>Set your boundaries.</h2></div>
                                    <ShieldCheck aria-hidden="true" />
                                </div>
                                <div className={styles.formGrid}>
                                    <label>
                                        <span>Profile visibility</span>
                                        <select defaultValue="communities"><option value="everyone">Everyone</option><option value="communities">Shared communities</option><option value="private">Only me</option></select>
                                    </label>
                                    <label>
                                        <span>Direct messages</span>
                                        <select defaultValue="communities"><option value="everyone">Everyone</option><option value="communities">Shared communities</option><option value="friends">Friends only</option></select>
                                    </label>
                                </div>
                                <div className={styles.settingList}>
                                    <ToggleSetting icon={UserRound} label="Friend requests" description="Let people you share a community with add you." checked={privacy.friendRequests} onChange={(checked) => setPrivacy((current) => ({ ...current, friendRequests: checked }))} />
                                    <ToggleSetting icon={Globe2} label="Activity status" description="Show when you are online or in a voice room." checked={privacy.activityStatus} onChange={(checked) => setPrivacy((current) => ({ ...current, activityStatus: checked }))} />
                                </div>
                            </section>

                            <section className={`${styles.card} ${styles.dangerCard}`}>
                                <div><Trash2 aria-hidden="true" /><span><strong>Delete your account</strong><small>This permanently removes your profile and cannot be undone.</small></span></div>
                                <button type="button">Delete account</button>
                            </section>
                        </>
                    )}

                    {activeSection === "appearance" && (
                        <>
                            <section className={styles.card}>
                                <div className={styles.cardHeading}>
                                    <div><span>Theme</span><h2>Pick your light.</h2></div>
                                    <Palette aria-hidden="true" />
                                </div>
                                <div className={styles.themeGrid}>
                                    {([
                                        { id: "warm" as const, label: "Warm", icon: Sun },
                                        { id: "dark" as const, label: "After dark", icon: Moon },
                                        { id: "system" as const, label: "Follow device", icon: Monitor },
                                    ]).map(({ id, label, icon: Icon }) => (
                                        <button key={id} type="button" className={theme === id ? styles.selectedTheme : ""} onClick={() => setTheme(id)}>
                                            <div className={`${styles.themePreview} ${styles[id]}`}><span /><i /><b /></div>
                                            <span><Icon aria-hidden="true" /> {label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className={styles.card}>
                                <div className={styles.cardHeading}>
                                    <div><span>Reading</span><h2>Text size</h2><p>Preview: Conversations should feel easy to read.</p></div>
                                    <strong className={styles.sizeValue}>{textSize}px</strong>
                                </div>
                                <input className={styles.range} type="range" min="13" max="20" value={textSize} onChange={(event) => setTextSize(Number(event.target.value))} />
                                <div className={styles.rangeLabels}><span>Compact</span><span>Comfortable</span><span>Large</span></div>
                            </section>
                        </>
                    )}

                    {activeSection === "language" && (
                        <section className={styles.card}>
                            <div className={styles.cardHeading}>
                                <div><span>Language & region</span><h2>Keep things familiar.</h2></div>
                                <Languages aria-hidden="true" />
                            </div>
                            <div className={styles.formGrid}>
                                <label>
                                    <span>Interface language</span>
                                    <select defaultValue="en"><option value="en">English</option><option value="fr">Français</option><option value="es">Español</option><option value="de">Deutsch</option></select>
                                    <small>Changes the language used throughout Knotly.</small>
                                </label>
                                <label>
                                    <span>Time zone</span>
                                    <select defaultValue="paris"><option value="new-york">New York · UTC−5</option><option value="paris">Paris · UTC+1</option><option value="tokyo">Tokyo · UTC+9</option></select>
                                    <small>Used for message times and community events.</small>
                                </label>
                                <label>
                                    <span>Date format</span>
                                    <select defaultValue="day-first"><option value="day-first">19 September 2026</option><option value="month-first">September 19, 2026</option><option value="numeric">19/09/2026</option></select>
                                </label>
                                <label>
                                    <span>First day of the week</span>
                                    <select defaultValue="monday"><option value="monday">Monday</option><option value="sunday">Sunday</option></select>
                                </label>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
