import { Search, UserMinus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import type { GroupMembersDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

/** Shows the full group roster and lets the current user change it locally. */
export function GroupMembersDialog({ friends, groupName, members, onAddMember, onClose, onRemoveMember }: GroupMembersDialogProps) {
    const [query, setQuery] = useState("");
    const normalizedQuery = query.trim().toLowerCase();
    const availableFriends = friends.filter((friend) => (
        !members.some((member) => member.id === friend.id)
        && friend.name.toLowerCase().includes(normalizedQuery)
    ));

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.groupMembersModal}`} role="dialog" aria-modal="true" aria-labelledby="group-members-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>{groupName}</span><h2 id="group-members-title">Group members</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>

                <div className={styles.groupMembersBody}>
                    <section>
                        <div className={styles.groupMembersSectionTitle}><span>In this conversation</span><small>{members.length + 1}</small></div>
                        <div className={`${styles.groupMemberRow} ${styles.currentGroupMember}`}>
                            <i className={`${styles.personAvatar} ${styles.brown}`}>YO</i>
                            <span><strong>You</strong><small>Group member</small></span>
                            <b>YOU</b>
                        </div>
                        {members.map((member) => (
                            <div key={member.id} className={styles.groupMemberRow}>
                                <i className={`${styles.personAvatar} ${styles[member.tone]}`}>{member.initials}</i>
                                <span><strong>{member.name}</strong><small>Group member</small></span>
                                <button type="button" onClick={() => onRemoveMember(member.id)} aria-label={`Remove ${member.name}`}><UserMinus /></button>
                            </div>
                        ))}
                    </section>

                    <section>
                        <div className={styles.groupMembersSectionTitle}><span>Add people</span><small>{availableFriends.length}</small></div>
                        <label className={styles.groupMemberSearch}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your friends" /></label>
                        <div className={styles.availableGroupMembers}>
                            {availableFriends.length > 0 ? availableFriends.map((friend) => (
                                <button key={friend.id} type="button" onClick={() => onAddMember(friend.id)}>
                                    <i className={`${styles.personAvatar} ${styles[friend.tone]}`}>{friend.initials}</i>
                                    <span><strong>{friend.name}</strong><small>{friend.activity}</small></span>
                                    <b><UserPlus /></b>
                                </button>
                            )) : <p>{normalizedQuery ? "No friend matches this search." : "Everyone is already in this group."}</p>}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
