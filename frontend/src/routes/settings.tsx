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
import { useState } from "react";
import styles from "./settings.module.scss";

export const Route = createFileRoute("/settings")({
    component: SettingsPage,
});

type SectionId = "account" | "notifications" | "privacy" | "appearance" | "language";
type ThemeId = "warm" | "dark" | "system";

const SECTIONS = [
    { id: "account" as const, label: "My account", description: "Profile, identity, and security", icon: UserRound },
    { id: "notifications" as const, label: "Notifications", description: "Choose what gets your attention", icon: Bell },
    { id: "privacy" as const, label: "Privacy & safety", description: "Control how people reach you", icon: ShieldCheck },
    { id: "appearance" as const, label: "Appearance", description: "Make Knotly feel comfortable", icon: Palette },
    { id: "language" as const, label: "Language & region", description: "Language, time, and locale", icon: Globe2 },
];

const SECTION_COPY: Record<SectionId, { eyebrow: string; title: string; description: string }> = {
    account: {
        eyebrow: "Personal settings",
        title: "Your account.",
        description: "Update the details people see when you join a conversation.",
    },
    notifications: {
        eyebrow: "Your attention",
        title: "Hear about what matters.",
        description: "Keep important conversations close without letting every room interrupt you.",
    },
    privacy: {
        eyebrow: "Boundaries",
        title: "You decide who gets through.",
        description: "Choose how people can find you, message you, and interact with your profile.",
    },
    appearance: {
        eyebrow: "Your view",
        title: "Set the right atmosphere.",
        description: "Tune Knotly for your screen, your eyes, and the way you like to read.",
    },
    language: {
        eyebrow: "Local preferences",
        title: "Right language, right time.",
        description: "Set the language and regional details Knotly uses around the app.",
    },
};

const INITIAL_PROFILE = {
    displayName: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "Always up for a late-night voice chat.",
};

interface ToggleSettingProps {
    checked: boolean;
    description: string;
    icon: typeof Bell;
    label: string;
    onChange: (checked: boolean) => void;
}

function ToggleSetting({ checked, description, icon: Icon, label, onChange }: ToggleSettingProps) {
    return (
        <div className={styles.settingRow}>
            <div className={styles.settingIcon}><Icon aria-hidden="true" /></div>
            <div className={styles.settingCopy}>
                <strong>{label}</strong>
                <span>{description}</span>
            </div>
            <label className={styles.toggle}>
                <span className={styles.srOnly}>Toggle {label}</span>
                <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
                <span className={styles.toggleTrack} />
            </label>
        </div>
    );
}

function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SectionId>("account");
    const [theme, setTheme] = useState<ThemeId>("warm");
    const [textSize, setTextSize] = useState(16);
    const [profile, setProfile] = useState(INITIAL_PROFILE);
    const [savedProfile, setSavedProfile] = useState(INITIAL_PROFILE);
    const [notifications, setNotifications] = useState({
        directMessages: true,
        mentions: true,
        communityActivity: false,
        sounds: true,
    });
    const [privacy, setPrivacy] = useState({
        friendRequests: true,
        activityStatus: true,
    });

    const sectionCopy = SECTION_COPY[activeSection];
    const hasChanges = Object.keys(profile).some(
        (key) => profile[key as keyof typeof profile] !== savedProfile[key as keyof typeof savedProfile],
    );

    const updateNotification = (key: keyof typeof notifications, checked: boolean) => {
        setNotifications((current) => ({ ...current, [key]: checked }));
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
                        <div className={styles.miniAvatar}>JD<span /></div>
                        <div><strong>John Doe</strong><span>@johndoe</span></div>
                    </div>

                    <nav className={styles.navigation} aria-label="Settings sections">
                        <span>Settings</span>
                        {SECTIONS.map(({ id, label, icon: Icon }) => (
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
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
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
                                setSavedProfile(profile);
                            }}
                        >
                            <section className={`${styles.card} ${styles.profileCard}`}>
                                <div className={styles.profileBanner} />
                                <div className={styles.profileIdentity}>
                                    <div className={styles.largeAvatar}>JD<span /></div>
                                    <div>
                                        <h2>John Doe</h2>
                                        <p>Your profile travels with you across every community.</p>
                                    </div>
                                    <button type="button" className={styles.secondaryButton}>
                                        <ImagePlus aria-hidden="true" /> Change picture
                                    </button>
                                </div>

                                <div className={styles.formGrid}>
                                    <label>
                                        <span>Display name</span>
                                        <input type="text" value={profile.displayName} onChange={(event) => setProfile((current) => ({ ...current, displayName: event.target.value }))} />
                                    </label>
                                    <label>
                                        <span>Username</span>
                                        <div className={styles.prefixedInput}><i>@</i><input type="text" value={profile.username} onChange={(event) => setProfile((current) => ({ ...current, username: event.target.value }))} /></div>
                                    </label>
                                    <label className={styles.fullField}>
                                        <span>Email address</span>
                                        <input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
                                        <small>Used for sign-in and important account updates.</small>
                                    </label>
                                    <label className={styles.fullField}>
                                        <span>A little about you</span>
                                        <textarea rows={3} value={profile.bio} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} maxLength={160} />
                                        <small>Keep it short—this appears on your profile.</small>
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
