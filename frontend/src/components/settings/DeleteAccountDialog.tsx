import { ArrowRight, Eye, EyeOff, ShieldAlert, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { DeleteAccountDialogProps } from "../../types/settings";
import styles from "../../routes/settings.module.scss";

/** Requires both the username and password before confirming account deletion. */
export function DeleteAccountDialog({ username, onClose, onFinish }: DeleteAccountDialogProps) {
    const [confirmation, setConfirmation] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const expectedConfirmation = `@${username}`;
    const canDelete = confirmation.trim().toLowerCase() === expectedConfirmation.toLowerCase() && password.length > 0;

    const deleteAccount = (event: React.FormEvent) => {
        event.preventDefault();
        if (!canDelete) return;
        setDeleted(true);
    };

    return (
        <div className={styles.passwordBackdrop} onMouseDown={deleted ? undefined : onClose}>
            <section className={`${styles.passwordDialog} ${styles.deleteAccountDialog}`} role="alertdialog" aria-modal="true" aria-labelledby="delete-account-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>Danger zone</span><h2 id="delete-account-title">{deleted ? "Account deleted" : "Delete your account?"}</h2></div>
                    {!deleted && <button type="button" onClick={onClose} aria-label="Close"><X /></button>}
                </header>

                {deleted ? (
                    <div className={styles.accountDeletedState}>
                        <i><Trash2 /></i>
                        <strong>Your Knotly account has been deleted.</strong>
                        <p>You have been signed out and your account data is scheduled for removal.</p>
                        <button type="button" onClick={onFinish}>Return to Knotly <ArrowRight /></button>
                    </div>
                ) : (
                    <form onSubmit={deleteAccount}>
                        <div className={styles.deleteAccountWarning}>
                            <ShieldAlert />
                            <span><strong>This action cannot be undone.</strong><small>Your profile, private messages, friendships, and community memberships will be removed.</small></span>
                        </div>

                        <label className={styles.deleteConfirmationField}>
                            <span>Type <strong>{expectedConfirmation}</strong> to confirm</span>
                            <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" spellCheck={false} autoFocus />
                        </label>

                        <label className={styles.deleteConfirmationField}>
                            <span>Current password</span>
                            <div className={styles.deletePasswordField}>
                                <input type={passwordVisible ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
                                <button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "Hide password" : "Show password"}>{passwordVisible ? <EyeOff /> : <Eye />}</button>
                            </div>
                        </label>

                        <footer>
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit" className={styles.confirmAccountDeletion} disabled={!canDelete}><Trash2 /> Delete account</button>
                        </footer>
                    </form>
                )}
            </section>
        </div>
    );
}
