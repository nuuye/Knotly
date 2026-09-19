import { Check, Eye, EyeOff, KeyRound, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import type { ChangePasswordDialogProps, SettingsPasswordInputProps } from "../../types/settings";
import styles from "../../routes/settings.module.scss";

/** Provides a password input with its own visibility control. */
function SettingsPasswordInput({ autoComplete, id, label, value, onChange }: SettingsPasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <label className={styles.passwordField} htmlFor={id}>
            <span>{label}</span>
            <div>
                <KeyRound aria-hidden="true" />
                <input id={id} type={visible ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} required />
                <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
                    {visible ? <EyeOff /> : <Eye />}
                </button>
            </div>
        </label>
    );
}

/** Validates a new password locally before the backend submission is connected. */
export function ChangePasswordDialog({ onChanged, onClose }: ChangePasswordDialogProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [changed, setChanged] = useState(false);

    const passwordRules = [
        { label: "At least 8 characters", valid: newPassword.length >= 8 },
        { label: "Uppercase and lowercase letters", valid: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) },
        { label: "At least one number or symbol", valid: /[^A-Za-z]/.test(newPassword) },
    ];
    const passwordsMatch = confirmation.length > 0 && newPassword === confirmation;
    const passwordChanged = newPassword.length > 0 && newPassword !== currentPassword;
    const canSubmit = currentPassword.length > 0 && passwordRules.every((rule) => rule.valid) && passwordsMatch && passwordChanged;

    const submitPassword = (event: React.FormEvent) => {
        event.preventDefault();
        if (!canSubmit) return;
        onChanged();
        setChanged(true);
    };

    return (
        <div className={styles.passwordBackdrop} onMouseDown={onClose}>
            <section className={styles.passwordDialog} role="dialog" aria-modal="true" aria-labelledby="change-password-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>Account security</span><h2 id="change-password-title">{changed ? "Password updated" : "Change your password"}</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>

                {changed ? (
                    <div className={styles.passwordSuccess}>
                        <i><ShieldCheck /></i>
                        <strong>Your new password is ready.</strong>
                        <p>Use it the next time you sign in to Knotly.</p>
                        <button type="button" onClick={onClose}>Done <Check /></button>
                    </div>
                ) : (
                    <form onSubmit={submitPassword}>
                        <div className={styles.passwordFields}>
                            <SettingsPasswordInput id="current-password" label="Current password" autoComplete="current-password" value={currentPassword} onChange={setCurrentPassword} />
                            <SettingsPasswordInput id="new-password" label="New password" autoComplete="new-password" value={newPassword} onChange={setNewPassword} />
                            <SettingsPasswordInput id="confirm-password" label="Confirm new password" autoComplete="new-password" value={confirmation} onChange={setConfirmation} />
                        </div>

                        <div className={styles.passwordRules}>
                            <span>Your new password must include:</span>
                            {passwordRules.map((rule) => <p key={rule.label} className={rule.valid ? styles.validPasswordRule : ""}><i>{rule.valid && <Check />}</i>{rule.label}</p>)}
                            {confirmation.length > 0 && <p className={passwordsMatch ? styles.validPasswordRule : styles.invalidPasswordRule}><i>{passwordsMatch && <Check />}</i>{passwordsMatch ? "Passwords match" : "Passwords do not match"}</p>}
                            {newPassword.length > 0 && !passwordChanged && <p className={styles.invalidPasswordRule}><i />Choose a password different from your current one</p>}
                        </div>

                        <footer>
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit" disabled={!canSubmit}>Update password <ShieldCheck /></button>
                        </footer>
                    </form>
                )}
            </section>
        </div>
    );
}
