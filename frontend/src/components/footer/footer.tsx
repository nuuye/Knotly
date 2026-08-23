import { Twitter, Github, Linkedin, MessageCircle } from "lucide-react";
import knotlyLogo from "../../assets/knotly.png";
import styles from './Footer.module.scss';
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerTop}>
          <div className={styles.footerSection}>
            <div className={styles.brand}>
              <div className={styles.logo}>
                <img src={knotlyLogo} alt="Knotly" />
              </div>
              <span className={styles.brandName}>Knotly</span>
            </div>
            <p className={styles.tagline}>Connect Differently</p>
            <p className={styles.description}>
              Build vibrant communities with secure messaging, voice channels, and meaningful connections.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Github" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
              <a href="#" aria-label="Discord" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Product</h4>
            <ul>
              <li><Link to="/explore">Explore Communities</Link></li>
              <li><Link to="/">Features</Link></li>
              <li><Link to="/signup">Get Started</Link></li>
              <li><Link to="/">Pricing</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Company</h4>
            <ul>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Blog</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <ul>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Help Center</Link></li>
              <li><Link to="/">API Docs</Link></li>
              <li><Link to="/">Status</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <ul>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Cookie Policy</Link></li>
              <li><Link to="/">Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2026 Knotly. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link to="/">Security</Link>
            <Link to="/">Accessibility</Link>
            <Link to="/">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
