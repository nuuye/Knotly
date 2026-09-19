import type { ToggleSettingProps } from "../../types/settings";
import styles from "../../routes/settings.module.scss";

/** Keeps every on/off setting visually and behaviorally consistent. */
export function ToggleSetting({ checked, description, icon: Icon, label, onChange }: ToggleSettingProps) {
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
