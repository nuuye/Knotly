import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Hash, Radio, SearchX } from "lucide-react";
import knotlyLogo from "../../assets/knotly.png";
import styles from "./notFound.module.scss";

export function NotFoundPage() {
    return (
        <main className={styles.notFoundPage}>
            <Link to="/" className={styles.brand}>
                <img src={knotlyLogo} alt="" />
                <span>Knotly</span>
            </Link>

            <section className={styles.content}>
                <div className={styles.copy}>
                    <span className={styles.errorCode}><SearchX aria-hidden="true" /> Error 404</span>
                    <h1>You wandered into <em>#nowhere.</em></h1>
                    <p>This room may have been moved, renamed, or was only ever a very convincing typo.</p>
                    <div className={styles.actions}>
                        <Link to="/"><ArrowLeft aria-hidden="true" /> Back to safety</Link>
                        <Link to="/explore"><Compass aria-hidden="true" /> Explore communities</Link>
                    </div>
                </div>

                <div className={styles.lostRoom} aria-hidden="true">
                    <div className={styles.roomHeader}>
                        <span><Hash /> nowhere</span>
                        <i>1 member</i>
                    </div>
                    <div className={styles.roomBody}>
                        <div className={styles.systemMessage}>You joined #nowhere</div>
                        <div className={styles.message}>
                            <div className={styles.avatar}>Y</div>
                            <div><strong>You <span>just now</span></strong><p>Hello?</p></div>
                        </div>
                        <div className={styles.silence}>…an impressively committed silence</div>
                    </div>
                    <div className={styles.voiceStatus}>
                        <Radio />
                        <div><strong>Empty voice room</strong><span>Your echo declined the invite.</span></div>
                    </div>
                </div>
            </section>

            <p className={styles.footerNote}>No communities were harmed while losing this page.</p>
        </main>
    );
}
