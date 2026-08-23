import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import knotlyLogo from "../../src/assets/knotly.png";
import styles from "./Login.module.scss";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BackgroundShapes } from "../components/BackgroundShapes";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

export function RouteComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic
    };

    return (
        <div className={styles.login}>
            <BackgroundShapes />
            <Link to="/" className={styles.backLink}>
                <ArrowLeft />
                <span>Back</span>
            </Link>

            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <img src={knotlyLogo} alt="Knotly" />
                        </div>
                        <h1>Knotly</h1>
                    </div>

                    <div className={styles.title}>
                        <h2>Welcome Back!</h2>
                        <p>Sign in to reconnect with your communities</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.forgotPassword}>
                            <button>Forgot password?</button>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Sign In
                        </button>

                        <div className={styles.divider}>
                            <div className={styles.line} />
                            <span>or</span>
                            <div className={styles.line} />
                        </div>

                        <div className={styles.signup}>
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
