import { AtSign, Bell, CheckCheck, Inbox, MessageCircleMore, UserPlus, UsersRound } from "lucide-react";
import { useState } from "react";
import type { NotificationCenterProps, NotificationFilter, NotificationKind } from "../../types/home";
import styles from "../../routes/home.module.scss";

const NOTIFICATION_ICONS: Record<NotificationKind, typeof Bell> = {
    message: MessageCircleMore,
    mention: AtSign,
    friend: UserPlus,
    community: UsersRound,
};

/** Shows recent activity and keeps read controls close to each destination. */
export function NotificationCenter({ notifications, onMarkAllRead, onOpenNotification }: NotificationCenterProps) {
    const [filter, setFilter] = useState<NotificationFilter>("all");
    const unreadCount = notifications.filter((notification) => !notification.read).length;
    const visibleNotifications = filter === "unread"
        ? notifications.filter((notification) => !notification.read)
        : notifications;

    return (
        <section className={styles.notificationPanel} role="dialog" aria-label="Notifications">
            <header>
                <div><span>Recent activity</span><strong>Notifications</strong></div>
                <button type="button" onClick={onMarkAllRead} disabled={unreadCount === 0}><CheckCheck /> Mark all read</button>
            </header>
            <div className={styles.notificationFilters}>
                <button type="button" className={filter === "all" ? styles.activeNotificationFilter : ""} onClick={() => setFilter("all")}>All <small>{notifications.length}</small></button>
                <button type="button" className={filter === "unread" ? styles.activeNotificationFilter : ""} onClick={() => setFilter("unread")}>Unread <small>{unreadCount}</small></button>
            </div>
            <div className={styles.notificationList}>
                {visibleNotifications.length > 0 ? visibleNotifications.map((notification) => {
                    const KindIcon = NOTIFICATION_ICONS[notification.kind];
                    return (
                        <button key={notification.id} type="button" className={!notification.read ? styles.unreadNotification : ""} onClick={() => onOpenNotification(notification)}>
                            <i className={`${styles.notificationAvatar} ${styles[notification.tone]}`}>{notification.initials}<b><KindIcon /></b></i>
                            <span><strong>{notification.title}</strong><small>{notification.description}</small><time>{notification.time}</time></span>
                            {!notification.read && <em aria-label="Unread" />}
                        </button>
                    );
                }) : (
                    <div className={styles.emptyNotifications}><Inbox /><strong>You’re all caught up</strong><span>New activity will appear here.</span></div>
                )}
            </div>
        </section>
    );
}
