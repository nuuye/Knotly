import { Check, Hash, Headphones, X } from "lucide-react";
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
    setName,
    setTargetCategoryId,
    onClose,
    onSubmit,
}: RoomSettingsDialogProps) {
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
                </div>
                <footer><span>{currentCategoryLabel} → {targetCategory?.label}</span><button type="submit" disabled={!toSlug(name)}>Save room <Check /></button></footer>
            </form>
        </div>
    );
}
