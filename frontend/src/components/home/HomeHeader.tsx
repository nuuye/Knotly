import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, HelpCircle, LogOut, MessageCircleMore, Plus, Settings } from "lucide-react";
import knotlyLogo from "../../assets/knotly.png";
import type { HomeHeaderProps } from "../../types/home";
import { getUsernameMark } from "../../utils/text";
import styles from "../../routes/home.module.scss";
import { NotificationCenter } from "./NotificationCenter";

/** Displays the main space switcher, account actions, and profile menu. */
export function HomeHeader({
    activeSpace,
    communities,
    isNotificationsOpen,
    isProfileMenuOpen,
    notifications,
    notificationsRef,
    profileMenuRef,
    user,
    onCreateCommunity,
    onOpenCommunity,
    onOpenMessages,
    onMarkAllNotificationsRead,
    onOpenNotification,
    onToggleNotifications,
    onToggleProfileMenu,
}: HomeHeaderProps) {
    const userMark = getUsernameMark(user.username);
    const unreadNotificationCount = notifications.filter((notification) => !notification.read).length;

    return (
        <header className={styles.spaceBar}>
            <Link to="/" className={styles.appBrand} aria-label="Knotly landing page">
                <img src={knotlyLogo} alt="" />
            </Link>

            <nav className={styles.spaceNav} aria-label="Your communities">
                <button type="button" className={`${styles.messageSpace} ${activeSpace === "messages" ? styles.activeSpace : ""}`} onClick={onOpenMessages}>
                    <MessageCircleMore aria-hidden="true" />
                    <span>Messages</span>
                </button>
                <i className={styles.spaceDivider} />
                {communities.map((community) => (
                    <button
                        key={community.id}
                        type="button"
                        className={`${styles.communityButton} ${styles[community.tone]} ${activeSpace === community.id ? styles.activeSpace : ""}`}
                        onClick={() => onOpenCommunity(community.id)}
                        aria-label={`${community.name}, ${community.online} online`}
                        title={community.name}
                    >
                        <span>{community.initials}</span>
                        <small>{community.name}</small>
                    </button>
                ))}
                <button type="button" className={styles.addCommunity} aria-label="Create a community" onClick={onCreateCommunity}><Plus /></button>
            </nav>

            <div className={styles.userActions}>
                <div className={styles.notificationMenuWrap} ref={notificationsRef}>
                    <button type="button" aria-label={`${unreadNotificationCount} unread notifications`} aria-expanded={isNotificationsOpen} className={`${styles.iconButton} ${isNotificationsOpen ? styles.activeIconButton : ""}`} onClick={onToggleNotifications}>
                        <Bell />
                        {unreadNotificationCount > 0 && <b className={styles.notificationBadge}>{unreadNotificationCount}</b>}
                    </button>
                    {isNotificationsOpen && <NotificationCenter notifications={notifications} onMarkAllRead={onMarkAllNotificationsRead} onOpenNotification={onOpenNotification} />}
                </div>
                <Link to="/settings" aria-label="Settings" className={styles.iconButton}><Settings /></Link>
                <div className={styles.profileMenuWrap} ref={profileMenuRef}>
                    <button type="button" className={styles.userMenu} onClick={onToggleProfileMenu} aria-expanded={isProfileMenuOpen}>
                        <span>{userMark}<i /></span><strong>{user.username}</strong><ChevronDown />
                    </button>
                    {isProfileMenuOpen && (
                        <div className={styles.profileMenu}>
                            <div className={styles.profileMenuHeader}><span>{userMark}<i /></span><div><strong>@{user.username}</strong><small>{user.email}</small></div></div>
                            <div className={styles.profilePresence}><i /> Online</div>
                            <Link to="/settings"><Settings /> Account settings</Link>
                            <Link to="/faq"><HelpCircle /> Help & FAQ</Link>
                            <Link to="/" className={styles.profileSignOut}><LogOut /> Sign out</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
