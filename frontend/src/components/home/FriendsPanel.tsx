import { ArrowLeft, Ban, Check, MailOpen, MessageCircleMore, MoreHorizontal, UserMinus, UserPlus, UserX, UsersRound, X } from "lucide-react";
import type { FriendsPanelProps } from "../../types/home";
import styles from "../../routes/home.module.scss";

/** Keeps friend browsing and request actions separate from the main home workspace. */
export function FriendsPanel({
    blockedUsers,
    friendFilter,
    friendMenuId,
    friendMenuOpen,
    friendMenuRef,
    friendRequests,
    friends,
    friendsView,
    onAcceptRequest,
    onAddFriend,
    onBlockRequest,
    onChangeFilter,
    onChangeView,
    onMessageFriend,
    onMobileBack,
    onOpenRemoveFriend,
    onRemoveRequest,
    onToggleFriendMenu,
    onUnblock,
}: FriendsPanelProps) {
    const filteredFriends = friends.filter((friend) => friendFilter === "all" || friend.status === friendFilter);
    const receivedRequests = friendRequests.filter((request) => request.direction === "received");
    const sentRequests = friendRequests.filter((request) => request.direction === "sent");

    return (
        <section className={`${styles.chatPanel} ${styles.friendsPanel}`}>
            <header className={styles.chatHeader}>
                <button type="button" className={styles.mobileBack} onClick={onMobileBack} aria-label="Back to conversations"><ArrowLeft /></button>
                <span className={styles.roomIcon}><UsersRound /></span>
                <div><strong>{friendsView === "friends" ? "Friends" : "Friend requests"}</strong><span>{friendsView === "friends" ? "People you’ve added on Knotly" : "Received, sent, and blocked profiles"}</span></div>
                <button type="button" className={styles.addFriendButton} onClick={onAddFriend}><UserPlus /> Add friend</button>
            </header>

            <div className={styles.friendsContent}>
                <div className={styles.friendsToolbar}>
                    <div className={styles.friendsViewTabs}>
                        <button type="button" className={friendsView === "friends" ? styles.activeFriendsView : ""} onClick={() => onChangeView("friends")}><UsersRound /> Friends <small>{friends.length}</small></button>
                        <button type="button" className={friendsView === "requests" ? styles.activeFriendsView : ""} onClick={() => onChangeView("requests")}><MailOpen /> Requests {receivedRequests.length > 0 && <small>{receivedRequests.length}</small>}</button>
                    </div>
                    {friendsView === "friends" && <div className={styles.friendFilters}>
                        {(["all", "online", "offline"] as const).map((filter) => (
                            <button key={filter} type="button" className={friendFilter === filter ? styles.activeFilter : ""} onClick={() => onChangeFilter(filter)}>
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>}
                </div>

                {friendsView === "friends" ? (
                    <div className={styles.friendGroups} key={friendFilter}>
                        {(["online", "offline"] as const).map((status) => {
                            const group = filteredFriends.filter((friend) => friend.status === status);
                            if (group.length === 0) return null;

                            return (
                                <section key={status}>
                                    <div className={styles.friendGroupLabel}><span>{status}</span><small>{group.length}</small></div>
                                    <div className={styles.friendList}>
                                        {group.map((friend) => (
                                            <div key={friend.id} className={styles.friendRow}>
                                                <span className={`${styles.personAvatar} ${styles[friend.tone]} ${friend.status === "offline" ? styles.offlineAvatar : ""}`}>{friend.initials}<i /></span>
                                                <div><strong>{friend.name}</strong><span>{friend.activity}</span></div>
                                                <button type="button" aria-label={`Message ${friend.name}`} onClick={() => onMessageFriend(friend)}><MessageCircleMore /></button>
                                                <div className={styles.friendRowMenu} ref={friendMenuOpen && friendMenuId === friend.id ? friendMenuRef : undefined}>
                                                    <button type="button" className={friendMenuOpen && friendMenuId === friend.id ? styles.activeFriendMenu : ""} aria-label={`More options for ${friend.name}`} aria-expanded={friendMenuOpen && friendMenuId === friend.id} onClick={() => onToggleFriendMenu(friend.id)}><MoreHorizontal /></button>
                                                    {friendMenuOpen && friendMenuId === friend.id && (
                                                        <div className={styles.friendActionsMenu}>
                                                            <div><strong>{friend.name}</strong><small>@{friend.id}</small></div>
                                                            <button type="button" onClick={() => onMessageFriend(friend)}><MessageCircleMore /> Message</button>
                                                            <button type="button" className={styles.dangerMenuAction} onClick={() => onOpenRemoveFriend(friend.id)}><UserMinus /> Remove friend</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.friendRequestGroups}>
                        <section>
                            <div className={styles.friendGroupLabel}><span>Received</span><small>{receivedRequests.length}</small></div>
                            {receivedRequests.length ? receivedRequests.map((request) => (
                                <div className={styles.friendRequestRow} key={request.id}>
                                    <span className={`${styles.personAvatar} ${styles[request.person.tone]}`}>{request.person.initials}<i /></span>
                                    <div><strong>{request.person.name}</strong><span>@{request.person.id} · {request.sentAt}</span></div>
                                    <div className={styles.friendRequestActions}>
                                        <button type="button" className={styles.acceptRequest} onClick={() => onAcceptRequest(request.id)} aria-label={`Accept ${request.person.name}`}><Check /><span>Accept</span></button>
                                        <button type="button" onClick={() => onRemoveRequest(request.id, "received")} aria-label={`Decline ${request.person.name}`}><UserX /><span>Decline</span></button>
                                        <button type="button" className={styles.blockRequest} onClick={() => onBlockRequest(request.id)} aria-label={`Block ${request.person.name}`}><Ban /></button>
                                    </div>
                                </div>
                            )) : <p className={styles.friendRequestEmpty}>No received requests right now.</p>}
                        </section>

                        <section>
                            <div className={styles.friendGroupLabel}><span>Sent</span><small>{sentRequests.length}</small></div>
                            {sentRequests.length ? sentRequests.map((request) => (
                                <div className={styles.friendRequestRow} key={request.id}>
                                    <span className={`${styles.personAvatar} ${styles[request.person.tone]}`}>{request.person.initials}</span>
                                    <div><strong>{request.person.name}</strong><span>Pending · {request.sentAt}</span></div>
                                    <div className={styles.friendRequestActions}>
                                        <button type="button" onClick={() => onRemoveRequest(request.id, "sent")}><X /><span>Cancel</span></button>
                                        <button type="button" className={styles.blockRequest} onClick={() => onBlockRequest(request.id)} aria-label={`Block ${request.person.name}`}><Ban /></button>
                                    </div>
                                </div>
                            )) : <p className={styles.friendRequestEmpty}>No sent requests are waiting.</p>}
                        </section>

                        {blockedUsers.length > 0 && <section>
                            <div className={styles.friendGroupLabel}><span>Blocked</span><small>{blockedUsers.length}</small></div>
                            {blockedUsers.map((friend) => (
                                <div className={`${styles.friendRequestRow} ${styles.blockedFriendRow}`} key={friend.id}>
                                    <span className={`${styles.personAvatar} ${styles[friend.tone]} ${styles.offlineAvatar}`}>{friend.initials}</span>
                                    <div><strong>{friend.name}</strong><span>@{friend.id}</span></div>
                                    <div className={styles.friendRequestActions}><button type="button" onClick={() => onUnblock(friend.id)}><Ban /><span>Unblock</span></button></div>
                                </div>
                            ))}
                        </section>}
                    </div>
                )}
            </div>
        </section>
    );
}
