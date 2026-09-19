import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, AudioLines, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { ConnectionNetwork } from "../components/ConnectionNetwork";
import knotlyLogo from "../assets/knotly.png";
import styles from "./auth.module.scss";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        void navigate({ to: "/home" });
    };

    return (
        <main className={styles.authPage}>
            <Link to="/" className={styles.backLink}>
                <ArrowLeft size={18} />
                Back to Knotly
            </Link>

            <section className={styles.showcase}>
                <ConnectionNetwork variant="login" className={styles.connectionField} />
                <Link to="/" className={styles.brand}>
                    <img src={knotlyLogo} alt="" />
                    <span>Knotly</span>
                </Link>

                <div className={styles.showcaseCopy}>
                    <span className={styles.eyebrow}>Your space is waiting</span>
                    <h1>Pick up where the conversation left off.</h1>
                    <p>Your rooms, your people, and probably a few messages you missed.</p>
                </div>

                <div className={styles.communityPreview} aria-hidden="true">
                    <div className={styles.previewHeader}>
                        <div className={styles.communityMark}>S</div>
                        <div><strong>Saturday Club</strong><span>8 friends online</span></div>
                        <div className={styles.previewAvatars}><i>M</i><i>J</i><i>L</i></div>
                    </div>
                    <div className={styles.previewMessage}>
                        <i className={styles.avatarOrange}>M</i>
                        <div><strong>Maya</strong><span>Picnic plans are in #weekend 🌿</span></div>
                    </div>
                    <div className={`${styles.previewMessage} ${styles.reply}`}>
                        <i className={styles.avatarYellow}>J</i>
                        <div><strong>Jules</strong><span>I’m already making the playlist.</span></div>
                    </div>
                    <div className={styles.voicePreview}>
                        <div><AudioLines size={17} /><span><strong>Cozy corner</strong><small>4 connected</small></span></div>
                        <button type="button">Drop in</button>
                    </div>
                </div>
            </section>

            <section className={styles.formSide}>
                <div className={styles.formCard}>
                    <Link to="/" className={styles.mobileBrand}>
                        <img src={knotlyLogo} alt="" />
                        <span>Knotly</span>
                    </Link>

                    <div className={styles.formHeading}>
                        <span>Welcome back</span>
                        <h2>Good to see you again.</h2>
                        <p>Sign in to return to your communities.</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="login-email">Email address</label>
                            <div className={styles.inputWrap}>
                                <Mail size={17} />
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.labelRow}>
                                <label htmlFor="login-password">Password</label>
                                <button type="button" className={styles.textButton}>Forgot password?</button>
                            </div>
                            <div className={styles.inputWrap}>
                                <LockKeyhole size={17} />
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Sign in <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className={styles.switchAuth}>
                        New around here? <Link to="/signup">Create your account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
