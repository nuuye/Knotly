import { Check, Clock3, Copy, Link2, RefreshCw, Search, Send, X } from "lucide-react";
import type { InviteMembersDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

/** Lets members share a reusable link or invite existing friends directly. */
export function InviteMembersDialog({
    community,
    friends,
    invitedFriendIds,
    inviteUrl,
    isLinkCopied,
    query,
    setQuery,
    onClose,
    onCopyLink,
    onRegenerateLink,
    onToggleInvite,
}: InviteMembersDialogProps) {
    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.inviteDialog}`} role="dialog" aria-modal="true" aria-labelledby="invite-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>{community.name}</span><h2 id="invite-title">Invite people</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>

                <div className={styles.inviteCommunityPreview}>
                    <i className={`${styles.communityMark} ${styles[community.tone]}`}>{community.initials}</i>
                    <span><strong>Bring someone into {community.name}</strong><small>Send a direct invitation or share the link.</small></span>
                </div>

                <div className={styles.inviteLinkBlock}>
                    <div className={styles.inviteSectionHeading}><span><Link2 /> Invite link</span><small><Clock3 /> Expires in 7 days</small></div>
                    <div className={styles.inviteLinkRow}>
                        <span title={inviteUrl}>{inviteUrl}</span>
                        <button type="button" className={isLinkCopied ? styles.copiedInviteLink : ""} onClick={onCopyLink}>{isLinkCopied ? <Check /> : <Copy />}{isLinkCopied ? "Copied" : "Copy"}</button>
                        <button type="button" className={styles.regenerateInviteLink} onClick={onRegenerateLink} aria-label="Create a new invite link"><RefreshCw /></button>
                    </div>
                </div>

                <div className={styles.invitePeopleHeading}><span>Invite your friends</span><small>{invitedFriendIds.length} sent</small></div>
                <label className={styles.modalSearch}>
                    <Search />
                    <span className={styles.srOnly}>Search friends to invite</span>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your friends" autoFocus />
                </label>

                <div className={styles.inviteFriendList}>
                    {friends.length > 0 ? friends.map((friend) => {
                        const invited = invitedFriendIds.includes(friend.id);
                        return (
                            <div key={friend.id} className={styles.inviteFriendRow}>
                                <span className={`${styles.personAvatar} ${styles[friend.tone]} ${friend.status === "offline" ? styles.offlineAvatar : ""}`}>{friend.initials}<i /></span>
                                <span><strong>{friend.name}</strong><small>{friend.status === "online" ? friend.activity : "Offline"}</small></span>
                                <button type="button" className={invited ? styles.invitedFriendButton : ""} onClick={() => onToggleInvite(friend.id)} aria-pressed={invited}>
                                    {invited ? <><Check /> Sent</> : <><Send /> Invite</>}
                                </button>
                            </div>
                        );
                    }) : (
                        <div className={styles.inviteEmpty}><Search /><strong>No friend found</strong><span>Try another name.</span></div>
                    )}
                </div>

                <footer>
                    <span>Invitations can be cancelled by selecting “Sent”.</span>
                    <button type="button" onClick={onClose}>Done <Check /></button>
                </footer>
            </section>
        </div>
    );
}
