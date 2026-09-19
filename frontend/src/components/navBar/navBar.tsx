import styles from "./navBar.module.scss";
import { Link } from "@tanstack/react-router";
import knotlyLogo from "../../assets/knotly.png";
import type { NavBarButton, NavBarProps } from "../../types/navigation";

const NAVBAR_BUTTONS: NavBarButton[] = [
    {
        label: "Explore",
        contained: false,
        link: "/explore",
    },
    {
        label: "FAQ",
        contained: false,
        link: "/faq",
    },
    {
        label: "Sign in",
        contained: false,
        link: "/login",
    },
    {
        label: "Sign up",
        contained: true,
        link: "/signup",
    },
];

/** Shows the shared top navigation and allows pages to replace its buttons. */
export function NavBar({ buttons = NAVBAR_BUTTONS }: NavBarProps) {
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <Link className={styles.brand} to="/">
                    <div className={styles.logo}>
                        <img src={knotlyLogo} alt="Knotly" />
                    </div>
                    <span className={styles.title}>Knotly</span>
                </Link>
                <div className={styles.buttonContainter}>
                    {buttons.map((button) => (
                        <Link
                            key={button.link}
                            className={button.contained ? styles.contained : styles.text}
                            to={button.link}
                        >
                            {button.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
