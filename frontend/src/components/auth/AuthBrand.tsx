import { Link } from "@tanstack/react-router";
import knotlyLogo from "../../assets/knotly.png";
import type { AuthBrandProps } from "../../types/auth";

/** Keeps the desktop and mobile authentication logos consistent. */
export function AuthBrand({ className }: AuthBrandProps) {
    return (
        <Link to="/" className={className}>
            <img src={knotlyLogo} alt="" />
            <span>Knotly</span>
        </Link>
    );
}
