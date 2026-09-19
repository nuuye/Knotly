import type { GroupAvatarProps } from "../../types/home";
import styles from "../../routes/home.module.scss";

/** Combines several initials into one compact group avatar. */
export function GroupAvatar({ compact = false, large = false, members, total }: GroupAvatarProps) {
    return (
        <span className={`${styles.groupAvatar} ${compact ? styles.compactGroupAvatar : ""} ${large ? styles.largeGroupAvatar : ""}`} aria-label={`${total} people in this conversation`}>
            {members.slice(0, 3).map((member, index) => (
                <i key={`${member.initials}-${index}`} className={styles[member.tone]}>{member.initials}</i>
            ))}
            <b>+{Math.max(total - 3, 1)}</b>
        </span>
    );
}
