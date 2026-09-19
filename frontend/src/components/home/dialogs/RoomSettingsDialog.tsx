import { Check, Hash, Headphones, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { RoomSettingsDialogProps } from "../../../types/home";
import { toSlug } from "../../../utils/text";
import styles from "../../../routes/home.module.scss";

/** Renames a room or moves it to another category without changing its type. */
export function RoomSettingsDialog({
    categories,
    communityName,
    currentCategoryLabel,
    name,
    roomKind,
    targetCategoryId,
    canDelete,
    setName,
    setTargetCategoryId,
    onClose,
    onDelete,
    onSubmit,
}: RoomSettingsDialogProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const targetCategory = categories.find((category) => category.id === targetCategoryId);

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <form className={`${styles.newMessageModal} ${styles.managementModal} ${styles.channelModal}`} onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>{communityName}</span><h2>Edit room</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>
                <div className={styles.managementBody}>
                    <label className={styles.formField}>
                        <span>Room name</span>
                        <div className={styles.roomNameInput}>{roomKind === "text" ? <Hash /> : <Headphones />}<input value={name} onChange={(event) => setName(event.target.value)} autoFocus maxLength={36} /></div>
                    </label>
                    <label className={styles.formField}>
                        <span>Move to category</span>
                        <select value={targetCategoryId} onChange={(event) => setTargetCategoryId(event.target.value)}>
                            {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                        </select>
                    </label>
                    <div className={styles.roomTypeNote}>
                        {roomKind === "text" ? <Hash /> : <Headphones />}
                        <p><strong>{roomKind === "text" ? "Text room" : "Voice room"}</strong><span>You can rename it or move it without changing its type.</span></p>
                    </div>
                    <div className={styles.roomDeleteArea}>
                        <div><strong>Delete this room</strong><span>{canDelete ? "Messages and room history will be removed from this demo." : "Keep at least one text room in the community."}</span></div>
                        {confirmingDelete ? (
                            <div className={styles.inlineDeleteConfirm}>
                                <button type="button" onClick={() => setConfirmingDelete(false)}>Cancel</button>
                                <button type="button" onClick={onDelete}><Trash2 /> Delete</button>
                            </div>
                        ) : (
                            <button type="button" disabled={!canDelete} onClick={() => setConfirmingDelete(true)}><Trash2 /> Delete room</button>
                        )}
                    </div>
                </div>
                <footer><span>{currentCategoryLabel} → {targetCategory?.label}</span><button type="submit" disabled={!toSlug(name)}>Save room <Check /></button></footer>
            </form>
        </div>
    );
}
