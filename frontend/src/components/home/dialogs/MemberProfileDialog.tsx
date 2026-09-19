import { Check, ChevronDown, Clipboard, MessageCircleMore, Search, ShieldCheck, StickyNote, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDismissableLayer } from "../../../hooks/useDismissableLayer";
import type { MemberProfileDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

/** Shows community-specific member details and moderation actions. */
export function MemberProfileDialog({ displayName, isCurrentUser, member, memberRoles, note, roles, onClose, onMessage, onNoteChange, onRemove, onToggleRole }: MemberProfileDialogProps) {
    const [copied, setCopied] = useState(false);
    const [confirmingRemoval, setConfirmingRemoval] = useState(false);
    const [rolePickerOpen, setRolePickerOpen] = useState(false);
    const [roleQuery, setRoleQuery] = useState("");
    const rolePickerRef = useRef<HTMLDivElement>(null);
    const filteredRoles = roles.filter((item) => item.name.toLowerCase().includes(roleQuery.trim().toLowerCase()));

    useDismissableLayer(rolePickerOpen, rolePickerRef, setRolePickerOpen);

    const copyUsername = async () => {
        try {
            await navigator.clipboard.writeText(`@${member.username}`);
        } catch {
            // Clipboard access may be unavailable in a local preview.
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.memberProfileModal}`} role="dialog" aria-modal="true" aria-labelledby="member-profile-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>Community member</span><h2 id="member-profile-title">Member details</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>

                <div className={styles.memberProfileBody}>
                    <div className={styles.memberProfileHero}>
                        <i className={`${styles.memberProfileAvatar} ${styles[member.tone]}`}>{member.initials}</i>
                        <div><h3>{displayName}</h3><span>@{member.username}</span></div>
                        <div className={styles.memberProfileRoles}>
                            {memberRoles.slice(0, 2).map((role) => <em key={role.id} style={{ color: role.color, borderColor: role.color }}>{role.name}</em>)}
                            {memberRoles.length > 2 && <small>+{memberRoles.length - 2}</small>}
                        </div>
                    </div>

                    <p className={styles.memberBio}>{member.bio}</p>
                    <div className={styles.memberFacts}>
                        <div><span>Member since</span><strong>{member.joinedAt}</strong></div>
                    </div>

                    <div className={styles.memberActions}>
                        {!isCurrentUser && <button type="button" onClick={onMessage}><MessageCircleMore /> Message</button>}
                        <button type="button" onClick={copyUsername}><Clipboard /> {copied ? "Copied" : "Copy username"}</button>
                    </div>

                    <div className={styles.memberRoleSelect}>
                        <span><ShieldCheck /> Community roles</span>
                        <div className={styles.memberRolePicker} ref={rolePickerRef}>
                            <button type="button" className={styles.memberRoleTrigger} onClick={() => setRolePickerOpen((open) => !open)} aria-expanded={rolePickerOpen} aria-haspopup="dialog">
                                <span className={styles.roleColourStack}>
                                    {memberRoles.slice(0, 3).map((item) => <i key={item.id} style={{ backgroundColor: item.color }} />)}
                                    {memberRoles.length > 3 && <b>+{memberRoles.length - 3}</b>}
                                </span>
                                <span><strong>{memberRoles.length === 0 ? "No role assigned" : memberRoles.length === 1 ? memberRoles[0].name : `${memberRoles.length} roles assigned`}</strong><small>{memberRoles.length > 1 ? memberRoles.map((item) => item.name).join(", ") : "Choose one or several roles"}</small></span>
                                <ChevronDown />
                            </button>

                            <div className={`${styles.memberRoleDropdown} ${rolePickerOpen ? styles.memberRoleDropdownOpen : ""}`} role="dialog" aria-label="Assign community roles" aria-hidden={!rolePickerOpen} inert={!rolePickerOpen}>
                                    <label><Search /><input value={roleQuery} onChange={(event) => setRoleQuery(event.target.value)} placeholder="Search roles" /></label>
                                    <div className={styles.memberRoleDropdownList}>
                                        {filteredRoles.length > 0 ? filteredRoles.map((item) => {
                                            const selected = member.roleIds.includes(item.id);
                                            return (
                                                <button key={item.id} type="button" className={selected ? styles.selectedMemberRole : ""} onClick={() => onToggleRole(item.id)} disabled={item.id === "owner"} aria-pressed={selected}>
                                                    <i style={{ backgroundColor: item.color }} />
                                                    <span><strong>{item.name}</strong><small>{item.permissions.length} permissions{item.id === "owner" ? " · Protected" : ""}</small></span>
                                                    <b>{selected && <Check />}</b>
                                                </button>
                                            );
                                        }) : <p>No role found.</p>}
                                    </div>
                                    <footer><span>{memberRoles.length} assigned</span><small><Check /> Saved automatically</small></footer>
                            </div>
                        </div>
                        <small>Several roles can be combined inside this community.</small>
                    </div>

                    <label className={styles.memberNote}>
                        <span><StickyNote /> Private note</span>
                        <textarea value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="Add something useful to remember about this person…" maxLength={240} />
                        <small>Only visible to you · {note.length}/240</small>
                    </label>

                    {!isCurrentUser && (
                        confirmingRemoval ? (
                            <div className={styles.removeMemberConfirm}>
                                <div><Trash2 /><span><strong>Remove {displayName}?</strong><small>They will lose access to this community.</small></span></div>
                                <div><button type="button" onClick={() => setConfirmingRemoval(false)}>Cancel</button><button type="button" onClick={onRemove}>Remove member</button></div>
                            </div>
                        ) : (
                            <button type="button" className={styles.removeMemberButton} onClick={() => setConfirmingRemoval(true)}><Trash2 /> Remove from community</button>
                        )
                    )}
                </div>
            </section>
        </div>
    );
}
