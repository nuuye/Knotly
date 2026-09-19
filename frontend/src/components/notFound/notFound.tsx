import { Link } from "@tanstack/react-router";
import { ArrowLeft, WifiOff } from "lucide-react";
import knotlyLogo from "../../assets/knotly.png";
import styles from "./notFound.module.scss";

/** Shows a simple fallback when no application route matches the URL. */
export function NotFoundPage() {
    return (
        <main className={styles.notFoundPage}>
            <Link to="/" className={styles.brand} aria-label="Knotly home">
                <img src={knotlyLogo} alt="" />
                <span>Knotly</span>
            </Link>

            <section className={styles.content}>
                <div className={styles.interruption} aria-hidden="true">
                    <span className={styles.node}><i /></span>
                    <span className={styles.line} />
                    <b><WifiOff /></b>
                    <span className={`${styles.line} ${styles.lineRight}`} />
                    <span className={`${styles.node} ${styles.nodeRight}`}><i /></span>
                </div>

                <span className={styles.errorCode}>404 · Connection interrupted</span>
                <h1>This page is out of reach.</h1>
                <p>The link may be old, or the page may have moved.</p>
                <Link to="/" className={styles.homeLink}><ArrowLeft /> Back to Knotly</Link>
            </section>
        </main>
    );
}
