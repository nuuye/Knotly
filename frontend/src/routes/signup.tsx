import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import knotlyLogo from "../../src/assets/knotly.png";
import styles from "./Signup.module.scss";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BackgroundShapes } from "../components/BackgroundShapes";

export const Route = createFileRoute("/signup")({
    component: RouteComponent,
});

export function RouteComponent() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle signup logic
    };

    return (
        <div className={styles.signup}>
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
                        <h2>Create Account</h2>
                        <p>Start building your community</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.terms}>
                            By creating an account, you agree to our <Link to="/">Terms of Service</Link> and{" "}
                            <Link to="/">Privacy Policy</Link>.
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Create Account
                        </button>

                        <div className={styles.divider}>
                            <div className={styles.line} />
                            <span>or</span>
                            <div className={styles.line} />
                        </div>

                        <div className={styles.login}>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
