import { motion } from "motion/react";
import { Hash, Volume2, User } from "lucide-react";
import styles from "./FloatingElements.module.scss";

export function FloatingElements() {
    return (
        <div className={styles.floatingContainer}>
            {/* Channel Sidebar */}
            <motion.div
                className={`${styles.glassCard} ${styles.sidebar}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className={styles.sidebarHeader}>
                    <h4>My Community</h4>
                </div>
                <div className={styles.channels}>
                    <div className={styles.channel}>
                        <Hash size={16} />
                        <span>general</span>
                    </div>
                    <div className={`${styles.channel} ${styles.active}`}>
                        <Hash size={16} />
                        <span>announcements</span>
                    </div>
                    <div className={styles.channel}>
                        <Volume2 size={16} />
                        <span>Voice Chat</span>
                    </div>
                </div>
            </motion.div>

            {/* Chat Bubbles */}
            <motion.div
                className={`${styles.glassCard} ${styles.chatCard}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className={styles.message}>
                    <div
                        className={styles.avatar}
                        style={{ background: "linear-gradient(135deg, #f6b048 0%, #f45ea7 100%)" }}
                    >
                        <User size={16} />
                    </div>
                    <div className={styles.messageContent}>
                        <div className={styles.messageName}>Sarah</div>
                        <div className={styles.messageText}>Anything planned for today?</div>
                    </div>
                </div>
                <div className={styles.message}>
                    <div
                        className={styles.avatar}
                        style={{ background: "linear-gradient(135deg, #f52525 0%, #00F2FE 100%)" }}
                    >
                        <User size={16} />
                    </div>
                    <div className={styles.messageContent}>
                        <div className={styles.messageName}>Ben</div>
                        <div className={styles.messageText}>I was thinking of hiking!</div>
                    </div>
                </div>
            </motion.div>

            {/* Typing Indicator */}
            <motion.div
                className={`${styles.glassCard} ${styles.typingCard}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <div className={styles.typingIndicator}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                </div>
                <span className={styles.typingText}>Someone is typing...</span>
            </motion.div>
        </div>
    );
}
