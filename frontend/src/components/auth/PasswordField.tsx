import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import type { PasswordFieldProps } from "../../types/auth";
import styles from "../../routes/auth.module.scss";

/** Provides the shared password field and owns its visibility toggle. */
export function PasswordField({
    autoComplete,
    id,
    label = "Password",
    minLength,
    name,
    placeholder,
    showForgotPassword = false,
    value,
    onChange,
}: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className={styles.formGroup}>
            <div className={styles.labelRow}>
                <label htmlFor={id}>{label}</label>
                {showForgotPassword && <button type="button" className={styles.textButton}>Forgot password?</button>}
            </div>
            <div className={styles.inputWrap}>
                <LockKeyhole size={17} />
                <input
                    id={id}
                    name={name}
                    type={isVisible ? "text" : "password"}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    minLength={minLength}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    required
                />
                <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setIsVisible((visible) => !visible)}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                >
                    {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            </div>
        </div>
    );
}
