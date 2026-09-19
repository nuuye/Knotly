import { Pencil, Reply, SmilePlus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDismissableLayer } from "../../hooks/useDismissableLayer";
import type { MessageActionsProps } from "../../types/home";
import styles from "../../routes/home.module.scss";

const QUICK_REACTIONS = ["❤️", "👍", "😂", "🔥", "👏", "✨"];

/** Keeps message actions compact until the message is hovered or focused. */
export function MessageActions({ canInteract = true, canManage, onDelete, onEdit, onReact, onReply }: MessageActionsProps) {
    const [reactionOpen, setReactionOpen] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);

    useDismissableLayer(reactionOpen, actionsRef, setReactionOpen);
    useDismissableLayer(confirmingDelete, actionsRef, setConfirmingDelete);

    return (
        <div className={styles.messageActions} ref={actionsRef}>
            {canInteract && <button type="button" onClick={() => { setReactionOpen(false); setConfirmingDelete(false); onReply(); }} aria-label="Reply to message"><Reply /></button>}
            {canInteract && <button type="button" className={reactionOpen ? styles.activeMessageAction : ""} onClick={() => { setReactionOpen((open) => !open); setConfirmingDelete(false); }} aria-label="React to message" aria-expanded={reactionOpen}><SmilePlus /></button>}
            {canInteract && reactionOpen && (
                <div className={styles.quickReactionPicker}>
                    {QUICK_REACTIONS.map((emoji) => <button key={emoji} type="button" onClick={() => { onReact(emoji); setReactionOpen(false); }} aria-label={`React with ${emoji}`}>{emoji}</button>)}
                </div>
            )}
            {canManage && <button type="button" onClick={() => { setReactionOpen(false); setConfirmingDelete(false); onEdit(); }} aria-label="Edit message"><Pencil /></button>}
            {canManage && (
                <div>
                    <button type="button" className={confirmingDelete ? styles.dangerMessageAction : ""} onClick={() => { setConfirmingDelete((open) => !open); setReactionOpen(false); }} aria-label="Delete message" aria-expanded={confirmingDelete}><Trash2 /></button>
                    {confirmingDelete && (
                        <div className={styles.messageDeleteConfirm}><span>Delete this message?</span><button type="button" onClick={() => setConfirmingDelete(false)} aria-label="Cancel deletion"><X /></button><button type="button" onClick={onDelete}>Delete</button></div>
                    )}
                </div>
            )}
        </div>
    );
}
