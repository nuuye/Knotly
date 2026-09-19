import { Check, ChevronRight, Globe2, LockKeyhole, Plus, ScrollText, ShieldCheck, X } from "lucide-react";
import type { CommunityDialogProps, CommunityTone } from "../../../types/home";
import { getInitials } from "../../../utils/text";
import styles from "../../../routes/home.module.scss";

const COMMUNITY_TONES: CommunityTone[] = ["coral", "amber", "rose", "brown", "sage", "plum", "ocean", "mint"];

/** Shares the same form between community creation and community settings. */
export function CommunityDialog({ canManageCommunity = false, canManageRoles = false, canViewModerationLog = false, communityName, draft, mode, username, onManageRoles, onOpenModerationLog, setDraft, onClose, onSubmit }: CommunityDialogProps) {
    const isCreating = mode === "create";
    const canEditCommunity = isCreating || canManageCommunity;
    const fallbackName = isCreating ? "Your community" : communityName ?? "Your community";
    const fallbackDescription = isCreating ? "A place with its own rhythm." : "Add a short community description.";

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <form className={`${styles.newMessageModal} ${styles.managementModal}`} onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>{isCreating ? "A fresh corner" : communityName}</span><h2>{isCreating ? "Create a community" : "Community settings"}</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>
                <div className={styles.managementBody}>
                    <div className={styles.communityIdentityPreview}>
                        <i className={`${styles.communityMark} ${styles[draft.tone]}`}>{getInitials(draft.name)}</i>
                        <div><strong>{draft.name.trim() || fallbackName}</strong><small>{draft.description.trim() || fallbackDescription}</small></div>
                    </div>
                    {!isCreating && (
                        <label className={styles.formField}>
                            <span>Your name in this community <small>Optional</small></span>
                            <input value={draft.localDisplayName} onChange={(event) => setDraft((current) => ({ ...current, localDisplayName: event.target.value }))} placeholder={`@${username ?? "username"}`} maxLength={32} />
                            <small>Only members of {communityName} will see this name. Leave it empty to use your username.</small>
                        </label>
                    )}
                    {canEditCommunity && (
                        <>
                            <label className={styles.formField}>
                                <span>Community name</span>
                                <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder={isCreating ? "Sunday table" : undefined} autoFocus maxLength={36} />
                            </label>
                            <label className={styles.formField}>
                                <span>{isCreating ? <>Short description <small>Optional</small></> : "Description"}</span>
                                <textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder={isCreating ? "What brings everyone together?" : undefined} maxLength={120} />
                            </label>
                            <div className={styles.formField}>
                                <span>Community colour</span>
                                <div className={styles.tonePicker}>
                                    {COMMUNITY_TONES.map((tone) => (
                                        <button key={tone} type="button" className={`${styles.toneOption} ${styles[tone]} ${draft.tone === tone ? styles.selectedTone : ""}`} onClick={() => setDraft((current) => ({ ...current, tone }))} aria-label={`Use ${tone}`}><i />{draft.tone === tone && <Check />}</button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formField}>
                                <span>{isCreating ? "Who can find it?" : "Visibility"}</span>
                                <div className={styles.visibilityPicker}>
                                    <button type="button" className={draft.visibility === "private" ? styles.selectedVisibility : ""} onClick={() => setDraft((current) => ({ ...current, visibility: "private" }))}><LockKeyhole /><span><strong>Private</strong><small>Invite only</small></span></button>
                                    <button type="button" className={draft.visibility === "public" ? styles.selectedVisibility : ""} onClick={() => setDraft((current) => ({ ...current, visibility: "public" }))}><Globe2 /><span><strong>Discoverable</strong><small>{isCreating ? "Anyone can find it" : "Visible in Explore"}</small></span></button>
                                </div>
                            </div>
                        </>
                    )}
                    {!isCreating && (
                        <>
                            {canManageRoles && <button type="button" className={styles.roleManagerRow} onClick={onManageRoles}>
                                <ShieldCheck />
                                <span><strong>Roles & permissions</strong><small>Control what members can do here.</small></span>
                                <ChevronRight />
                            </button>}
                            {canViewModerationLog && <button type="button" className={styles.roleManagerRow} onClick={onOpenModerationLog}>
                                <ScrollText />
                                <span><strong>Moderation log</strong><small>Review important actions in this community.</small></span>
                                <ChevronRight />
                            </button>}
                            {canManageCommunity && <button type="button" className={styles.switchRow} onClick={() => setDraft((current) => ({ ...current, allowInvites: !current.allowInvites }))}>
                                <span><strong>Member invitations</strong><small>Let members invite people they know.</small></span>
                                <i className={draft.allowInvites ? styles.switchActive : ""}><b /></i>
                            </button>}
                        </>
                    )}
                </div>
                <footer>
                    <span>{isCreating ? "You can change all of this later." : canManageCommunity ? "Changes apply immediately to this demo." : "Only your name in this community will change."}</span>
                    <button type="submit" disabled={canEditCommunity && !draft.name.trim()}>{isCreating ? <>Create community <Plus /></> : <>Save changes <Check /></>}</button>
                </footer>
            </form>
        </div>
    );
}
