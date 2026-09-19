import { MessageCircleMore, Search, Send, UsersRound, X } from "lucide-react";
import type { NewMessageDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

/** Lets the user choose friends for a direct message or a new group. */
export function NewMessageDialog({
    friends,
    groupName,
    mode,
    query,
    selectedFriendIds,
    setGroupName,
    setMode,
    setQuery,
    setSelectedFriendIds,
    onClose,
    onCreate,
}: NewMessageDialogProps) {
    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={styles.newMessageModal} role="dialog" aria-modal="true" aria-labelledby="new-message-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>Start something</span><h2 id="new-message-title">New message</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>

                <div className={styles.messageModeTabs}>
                    <button type="button" className={mode === "direct" ? styles.activeMode : ""} onClick={() => { setMode("direct"); setSelectedFriendIds([]); }}>
                        <MessageCircleMore /> Direct message
                    </button>
                    <button type="button" className={mode === "group" ? styles.activeMode : ""} onClick={() => { setMode("group"); setSelectedFriendIds([]); }}>
                        <UsersRound /> New group
                    </button>
                </div>

                {mode === "group" && (
                    <label className={styles.groupNameField}>
                        <span>Group name <small>Optional</small></span>
                        <input value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Weekend plans, project crew…" />
                    </label>
                )}

                <label className={styles.modalSearch}>
                    <Search />
                    <span className={styles.srOnly}>Search friends</span>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your friends" autoFocus />
                </label>

                <div className={styles.contactPicker}>
                    {friends.map((friend) => {
                        const selected = selectedFriendIds.includes(friend.id);
                        return (
                            <button
                                key={friend.id}
                                type="button"
                                className={selected ? styles.selectedContact : ""}
                                onClick={() => setSelectedFriendIds((current) => {
                                    if (mode === "direct") return [friend.id];
                                    return selected ? current.filter((id) => id !== friend.id) : [...current, friend.id];
                                })}
                            >
                                <span className={`${styles.personAvatar} ${styles[friend.tone]} ${friend.status === "offline" ? styles.offlineAvatar : ""}`}>{friend.initials}<i /></span>
                                <span><strong>{friend.name}</strong><small>{friend.status === "online" ? friend.activity : "Offline"}</small></span>
                                <i className={styles.selectionMark}>{selected ? "✓" : ""}</i>
                            </button>
                        );
                    })}
                </div>

                <footer>
                    <span>{mode === "group" ? `${selectedFriendIds.length} selected · you’ll be added too` : "Choose one friend"}</span>
                    <button type="button" onClick={onCreate} disabled={mode === "group" ? selectedFriendIds.length < 2 : selectedFriendIds.length !== 1}>
                        {mode === "group" ? "Create group" : "Start conversation"} <Send />
                    </button>
                </footer>
            </section>
        </div>
    );
}
