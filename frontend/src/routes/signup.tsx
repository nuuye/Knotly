import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { ConnectionNetwork } from "../components/ConnectionNetwork";
import knotlyLogo from "../assets/knotly.png";
import styles from "./auth.module.scss";

export const Route = createFileRoute("/signup")({
    component: SignupPage,
});

function SignupPage() {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

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
                <Link to="/" className={styles.brand}>
                    <img src={knotlyLogo} alt="" />
                    <span>Knotly</span>
                </Link>

                <div className={styles.showcaseCopy}>
                    <span className={styles.eyebrow}>Make room for your people</span>
                    <h1>Start the space. Let everyone make it theirs.</h1>
                    <p>A few details now, and your first conversation is only an invite away.</p>
                </div>

                <div className={`${styles.communityPreview} ${styles.setupPreview}`} aria-hidden="true">
                    <div className={styles.previewHeader}>
                        <div className={styles.communityMark}>K</div>
                        <div><strong>Your new community</strong><span>Almost ready</span></div>
                        <div className={styles.progress}>2 / 3</div>
                    </div>
                    <div className={styles.setupStep}>
                        <i><Check size={14} /></i>
                        <span><strong>Give it a name</strong><small>Something your people will recognize</small></span>
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
                    <Link to="/" className={styles.mobileBrand}>
                        <img src={knotlyLogo} alt="" />
                        <span>Knotly</span>
                    </Link>

                    <div className={styles.formHeading}>
                        <span>Join Knotly</span>
                        <h2>Create your account.</h2>
                        <p>Your first community can be ready in a few minutes.</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">First name</label>
                                <div className={styles.inputWrap}>
                                    <UserRound size={17} />
                                    <input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="Maya" value={formData.firstName} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Last name</label>
                                <div className={styles.inputWrap}>
                                    <UserRound size={17} />
                                    <input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="Martin" value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="signup-email">Email address</label>
                            <div className={styles.inputWrap}>
                                <Mail size={17} />
                                <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="signup-password">Password</label>
                            <div className={styles.inputWrap}>
                                <LockKeyhole size={17} />
                                <input id="signup-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" minLength={8} value={formData.password} onChange={handleChange} required />
                                <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

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
