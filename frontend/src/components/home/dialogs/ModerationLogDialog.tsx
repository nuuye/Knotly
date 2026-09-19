import { ArrowLeft, LayoutGrid, Link2, ScrollText, Settings2, ShieldCheck, Tags, UsersRound, X } from "lucide-react";
import { useState } from "react";
import type { ModerationLogCategory, ModerationLogDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

const LOG_FILTERS: Array<{ id: "all" | ModerationLogCategory; label: string }> = [
    { id: "all", label: "All" },
    { id: "members", label: "Members" },
    { id: "roles", label: "Roles" },
    { id: "rooms", label: "Rooms" },
    { id: "invites", label: "Invites" },
    { id: "community", label: "Community" },
];

const CATEGORY_ICONS = {
    community: Settings2,
    invites: Link2,
    members: UsersRound,
    roles: Tags,
    rooms: LayoutGrid,
};

/** Shows an immutable-looking timeline of local moderation and admin actions. */
export function ModerationLogDialog({ communityName, entries, onBack, onClose }: ModerationLogDialogProps) {
    const [filter, setFilter] = useState<"all" | ModerationLogCategory>("all");
    const visibleEntries = filter === "all" ? entries : entries.filter((entry) => entry.category === filter);

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.moderationLogModal}`} role="dialog" aria-modal="true" aria-labelledby="moderation-log-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div className={styles.rolesDialogTitle}>
                        <button type="button" onClick={onBack} aria-label="Back to community settings"><ArrowLeft /></button>
                        <div><span>{communityName}</span><h2 id="moderation-log-title">Moderation log</h2></div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>

                <div className={styles.moderationLogBody}>
                    <div className={styles.moderationLogIntro}>
                        <i><ShieldCheck /></i>
                        <span><strong>A clear record of important changes.</strong><small>Role, member, room, invitation, and community actions appear here.</small></span>
                        <b>{entries.length}</b>
                    </div>

                    <div className={styles.moderationLogFilters} aria-label="Filter moderation log">
                        {LOG_FILTERS.map((item) => <button key={item.id} type="button" className={filter === item.id ? styles.activeModerationFilter : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}
                    </div>

                    <div className={styles.moderationLogList}>
                        {visibleEntries.length > 0 ? visibleEntries.map((entry) => {
                            const Icon = CATEGORY_ICONS[entry.category];
                            return (
                                <article key={entry.id}>
                                    <i className={styles[entry.category]}><Icon /></i>
                                    <div><span><strong>{entry.action}</strong><time>{entry.time}</time></span><p>{entry.detail}</p><small>by {entry.actor}</small></div>
                                </article>
                            );
                        }) : (
                            <div className={styles.moderationLogEmpty}><ScrollText /><strong>No activity here yet</strong><span>New actions will appear automatically.</span></div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
