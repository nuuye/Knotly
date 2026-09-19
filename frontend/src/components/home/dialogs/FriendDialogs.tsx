import { Search, UserMinus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import type { AddFriendDialogProps, RemoveFriendDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

/** Finds a local demo profile and adds it to the friends list. */
export function AddFriendDialog({ candidates, onAdd, onClose }: AddFriendDialogProps) {
    const [query, setQuery] = useState("");
    const normalizedQuery = query.trim().toLowerCase();
    const visibleCandidates = candidates.filter((friend) => (
        friend.name.toLowerCase().includes(normalizedQuery)
        || friend.id.toLowerCase().includes(normalizedQuery)
    ));

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.addFriendModal}`} role="dialog" aria-modal="true" aria-labelledby="add-friend-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>Your circle</span><h2 id="add-friend-title">Add a friend</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>
                <div className={styles.addFriendBody}>
                    <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or username" autoFocus /></label>
                    <div className={styles.friendCandidateList}>
                        {visibleCandidates.length > 0 ? visibleCandidates.map((friend) => (
                            <button key={friend.id} type="button" onClick={() => onAdd(friend.id)}>
                                <i className={`${styles.personAvatar} ${styles[friend.tone]}`}>{friend.initials}</i>
                                <span><strong>{friend.name}</strong><small>@{friend.id} · {friend.activity}</small></span>
                                <b><UserPlus /></b>
                            </button>
                        )) : <p>{normalizedQuery ? "No new profile matches this search." : "You have added everyone suggested for now."}</p>}
                    </div>
                </div>
            </section>
        </div>
    );
}

/** Confirms removal before changing the local friends list. */
export function RemoveFriendDialog({ friend, onClose, onConfirm }: RemoveFriendDialogProps) {
    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.removeFriendModal}`} role="dialog" aria-modal="true" aria-labelledby="remove-friend-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>Friend settings</span><h2 id="remove-friend-title">Remove friend?</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>
                <div className={styles.removeFriendBody}>
                    <i className={`${styles.personAvatar} ${styles[friend.tone]}`}>{friend.initials}</i>
                    <div><strong>{friend.name}</strong><span>@{friend.id}</span><p>The private conversation will stay in your inbox.</p></div>
                </div>
                <footer>
                    <button type="button" className={styles.secondaryModalButton} onClick={onClose}>Cancel</button>
                    <button type="button" className={styles.dangerModalButton} onClick={onConfirm}><UserMinus /> Remove friend</button>
                </footer>
            </section>
        </div>
    );
}
