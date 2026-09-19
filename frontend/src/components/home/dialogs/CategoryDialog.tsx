import { FolderPlus, Hash, Headphones, Plus, X } from "lucide-react";
import type { CategoryDialogProps } from "../../../types/home";
import { toSlug } from "../../../utils/text";
import styles from "../../../routes/home.module.scss";

/** Creates an empty category that can later receive text and voice rooms. */
export function CategoryDialog({ communityName, name, setName, onClose, onSubmit }: CategoryDialogProps) {
    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <form className={`${styles.newMessageModal} ${styles.managementModal} ${styles.channelModal}`} onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>{communityName}</span><h2>New category</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>
                <div className={styles.managementBody}>
                    <label className={styles.formField}>
                        <span>Category name</span>
                        <div className={styles.roomNameInput}><FolderPlus /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Games, projects, after hours…" autoFocus maxLength={30} /></div>
                    </label>
                    <div className={styles.categoryPreview}>
                        <div><span>{name.trim() || "New category"}</span><Plus /></div>
                        <p><Hash /> text-room</p>
                        <p><Headphones /> voice-room</p>
                    </div>
                </div>
                <footer><span>Text and voice rooms can live together.</span><button type="submit" disabled={!toSlug(name)}>Create category <FolderPlus /></button></footer>
            </form>
        </div>
    );
}
