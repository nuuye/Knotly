import { FolderX, Trash2, X } from "lucide-react";
import type { DeleteCategoryDialogProps } from "../../../types/home";
import styles from "../../../routes/home.module.scss";

/** Confirms a category deletion and explains which rooms will be removed with it. */
export function DeleteCategoryDialog({ canDelete, category, communityName, onClose, onConfirm }: DeleteCategoryDialogProps) {
    const roomCount = category.textRooms.length + category.voiceRooms.length;

    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <section className={`${styles.newMessageModal} ${styles.removeFriendModal}`} role="dialog" aria-modal="true" aria-labelledby="delete-category-title" onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>{communityName}</span><h2 id="delete-category-title">Delete category?</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>
                <div className={styles.deleteCategoryBody}>
                    <i><FolderX /></i>
                    <div>
                        <strong>{category.label}</strong>
                        <span>{roomCount} {roomCount === 1 ? "room" : "rooms"} will be deleted with this category.</span>
                        {!canDelete && <p>The community must keep at least one category.</p>}
                    </div>
                </div>
                <footer>
                    <button type="button" className={styles.secondaryModalButton} onClick={onClose}>Cancel</button>
                    <button type="button" className={styles.dangerModalButton} disabled={!canDelete} onClick={onConfirm}><Trash2 /> Delete category</button>
                </footer>
            </section>
        </div>
    );
}
