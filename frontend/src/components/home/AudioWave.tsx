import styles from "../../routes/home.module.scss";

/** Shows a small animated signal next to someone who is speaking. */
export function AudioWave() {
    return <span className={styles.audioWave} aria-label="Speaking"><i /><i /><i /></span>;
}
