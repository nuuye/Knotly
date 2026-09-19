import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, AtSign, Check, Mail } from "lucide-react";
import { useState } from "react";
import { AuthBrand } from "../components/auth/AuthBrand";
import { PasswordField } from "../components/auth/PasswordField";
import { ConnectionNetwork } from "../components/ConnectionNetwork";
import type { SignupFormData } from "../types/user";
import styles from "./auth.module.scss";

export const Route = createFileRoute("/signup")({
    component: SignupPage,
});

/** Collects the basic details needed to create a Knotly account. */
function SignupPage() {
    const [formData, setFormData] = useState<SignupFormData>({ username: "", email: "", password: "" });

    // Reuse one handler for every field by reading its name attribute.
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    // Account creation will be added here when the backend is ready.
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <main className={styles.authPage}>
            <Link to="/" className={styles.backLink}>
                <ArrowLeft size={18} />
                Back to Knotly
            </Link>

            <section className={`${styles.showcase} ${styles.signupShowcase}`}>
                <ConnectionNetwork variant="signup" className={styles.connectionField} />
                <AuthBrand className={styles.brand} />

                <div className={styles.showcaseCopy}>
                    <span className={styles.eyebrow}>Join on your own terms</span>
                    <h1>Start the space. Let everyone make it theirs.</h1>
                    <p>Choose a username, keep your real name private, and start gathering your people.</p>
                </div>

                <div className={`${styles.communityPreview} ${styles.setupPreview}`} aria-hidden="true">
                    <div className={styles.previewHeader}>
                        <div className={styles.communityMark}>K</div>
                        <div><strong>Your new community</strong><span>Almost ready</span></div>
                        <div className={styles.progress}>2 / 3</div>
                    </div>
                    <div className={styles.setupStep}>
                        <i><Check size={14} /></i>
                        <span><strong>Choose a username</strong><small>No real name required</small></span>
                    </div>
                    <div className={styles.setupStep}>
                        <i><Check size={14} /></i>
                        <span><strong>Add a few rooms</strong><small># general · # share-your-work</small></span>
                    </div>
                    <div className={`${styles.setupStep} ${styles.nextStep}`}>
                        <i>3</i>
                        <span><strong>Send the first invite</strong><small>The good part starts here</small></span>
                    </div>
                </div>
            </section>

            <section className={styles.formSide}>
                <div className={`${styles.formCard} ${styles.signupCard}`}>
                    <AuthBrand className={styles.mobileBrand} />

                    <div className={styles.formHeading}>
                        <span>Join Knotly</span>
                        <h2>Create your account.</h2>
                        <p>Your first community can be ready in a few minutes.</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <div className={styles.inputWrap}>
                                <AtSign size={17} />
                                <input id="username" name="username" type="text" autoComplete="username" placeholder="nightowl" value={formData.username} onChange={handleChange} minLength={3} maxLength={24} required />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="signup-email">Email address</label>
                            <div className={styles.inputWrap}>
                                <Mail size={17} />
                                <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <PasswordField
                            id="signup-password"
                            name="password"
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            minLength={8}
                            value={formData.password}
                            onChange={(password) => setFormData((current) => ({ ...current, password }))}
                        />

                        <p className={styles.terms}>By creating an account, you agree to Knotly’s terms and privacy policy.</p>

                        <button type="submit" className={styles.submitButton}>
                            Create my account <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className={styles.switchAuth}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
