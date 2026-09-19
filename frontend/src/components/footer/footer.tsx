import { Link } from "@tanstack/react-router";
import knotlyLogo from "../../assets/knotly.png";
import styles from "./footer.module.scss";

/** Shows the shared footer and its main navigation links. */
export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <Link className={styles.brand} to="/">
                            <img src={knotlyLogo} alt="" />
                            <span>Knotly</span>
                        </Link>
                        <p>
                            A warmer home for conversations, voice hangouts, and the people you keep coming back to.
                        </p>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>Product</h3>
                        <Link to="/explore">Explore communities</Link>
                        <a href="#features">Features</a>
                        <Link to="/signup">Create a community</Link>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>Inside Knotly</h3>
                        <span>Organized conversations</span>
                        <span>Drop-in voice rooms</span>
                        <span>Roles and permissions</span>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>Get started</h3>
                        <Link to="/signup">Create an account</Link>
                        <Link to="/login">Sign in</Link>
                        <Link to="/faq">Frequently asked questions</Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; 2026 Knotly. All rights reserved.</p>
                    <p>Connect differently.</p>
                </div>
            </div>
        </footer>
    );
}
