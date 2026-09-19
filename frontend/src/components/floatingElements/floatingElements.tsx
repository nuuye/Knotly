import { motion } from "motion/react";
import {
    Bell,
    AudioLines,
    Hash,
    Headphones,
    Image,
    Mic,
    Paperclip,
    Plus,
    Search,
    Send,
    Smile,
    Volume2,
} from "lucide-react";
import styles from "./floatingElements.module.scss";

const messages = [
    { initial: "M", name: "Maya", time: "10:24", text: "Picnic by the lake on Sunday?", tone: "orange" },
    { initial: "J", name: "Jules", time: "10:26", text: "Yes — I’ll bring the playlist 🌿", tone: "yellow" },
    { initial: "L", name: "Lina", time: "10:28", text: "Count me in. I’ll make a shared list!", tone: "pink" },
];

/** Builds the compact app preview shown in the landing page hero. */
export function FloatingElements() {
    return (
        <motion.div
            className={styles.previewShell}
            initial={{ opacity: 0, y: 22, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: -0.7 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className={styles.appFrame}>
                <header className={styles.topBar}>
                    <div className={styles.communityShortcuts} aria-label="Other communities">
                        <button type="button" className={styles.activeShortcut} aria-label="Saturday Club">S</button>
                        <button type="button" aria-label="Creative Corner">C</button>
                        <button type="button" aria-label="Running Crew">R</button>
                        <button type="button" aria-label="Add a community"><Plus size={15} /></button>
                        <span className={styles.communityName}>Saturday Club</span>
                    </div>

                    <div className={styles.topActions}>
                        <Search size={17} />
                        <Bell size={17} />
                        <div className={styles.profile}>Y<i /></div>
                    </div>
                </header>

                <div className={styles.workspace}>
                    <aside className={styles.roomsPanel}>
                        <div className={styles.panelTitle}><span>Rooms</span><Plus size={14} /></div>
                        <nav aria-label="Room list preview">
                            <div className={`${styles.room} ${styles.activeRoom}`}>
                                <Hash size={15} /><span>general</span><i>3</i>
                            </div>
                            <div className={styles.room}><Hash size={15} /><span>weekend-plans</span></div>
                            <div className={styles.room}><Image size={15} /><span>photos</span></div>
                            <div className={styles.room}><Hash size={15} /><span>everything-else</span></div>
                        </nav>

                        <div className={styles.roomDivider} />
                        <div className={styles.panelTitle}><span>Voice rooms</span></div>
                        <div className={`${styles.room} ${styles.liveRoom}`}>
                            <Volume2 size={15} />
                            <span><strong>Cozy corner</strong><small>4 connected</small></span>
                            <i />
                        </div>
                        <div className={styles.voiceMembers}>
                            <div><i className={styles.voiceOrange}>M</i><span>Maya</span><AudioLines className={styles.speakingIcon} aria-label="Speaking" /></div>
                            <div><i className={styles.voiceYellow}>J</i><span>Jules</span></div>
                            <div><i className={styles.voicePink}>L</i><span>Lina</span><AudioLines className={styles.speakingIcon} aria-label="Speaking" /></div>
                            <div><i className={styles.voiceBrown}>A</i><span>Alex</span></div>
                        </div>
                        <div className={styles.accountBar}>
                            <div className={styles.accountAvatar}>Y<i /></div>
                            <span><strong>You</strong><small>Online</small></span>
                            <Mic size={14} /><Headphones size={14} />
                        </div>
                    </aside>

                    <main className={styles.chatPanel}>
                        <div className={styles.chatHeader}>
                            <div><Hash size={18} /><span><strong>general</strong><small>Where everyone catches up</small></span></div>
                            <div className={styles.onlineAvatars}><i>M</i><i>J</i><i>L</i><span>+5</span></div>
                        </div>

                        <div className={styles.messages}>
                            <div className={styles.dayDivider}><span>Today</span></div>
                            {messages.map((message) => (
                                <article className={styles.message} key={message.name}>
                                    <div className={`${styles.avatar} ${styles[message.tone]}`}>{message.initial}</div>
                                    <div>
                                        <p><strong>{message.name}</strong><time>{message.time}</time></p>
                                        <span>{message.text}</span>
                                        {message.name === "Jules" && <small>🔥 4</small>}
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className={styles.composer}>
                            <Paperclip size={16} />
                            <span>Message #general</span>
                            <Smile size={16} />
                            <button type="button" aria-label="Send message"><Send size={14} /></button>
                        </div>
                    </main>

                </div>
            </div>
        </motion.div>
    );
}
