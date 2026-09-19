import { Hash, Headphones, Plus, X } from "lucide-react";
import type { ChannelDialogProps } from "../../../types/home";
import { toSlug } from "../../../utils/text";
import styles from "../../../routes/home.module.scss";

/** Creates either a text room or a voice room inside a chosen category. */
export function ChannelDialog({
    categories,
    categoryId,
    communityName,
    name,
    roomKind,
    setCategoryId,
    setName,
    setRoomKind,
    onClose,
    onSubmit,
}: ChannelDialogProps) {
    return (
        <div className={styles.modalBackdrop} onMouseDown={onClose}>
            <form className={`${styles.newMessageModal} ${styles.managementModal} ${styles.channelModal}`} onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
                <header>
                    <div><span>{communityName}</span><h2>Add a room</h2></div>
                    <button type="button" onClick={onClose} aria-label="Close"><X /></button>
                </header>
                <div className={styles.messageModeTabs}>
                    <button type="button" className={roomKind === "text" ? styles.activeMode : ""} onClick={() => setRoomKind("text")}><Hash /> Text room</button>
                    <button type="button" className={roomKind === "voice" ? styles.activeMode : ""} onClick={() => setRoomKind("voice")}><Headphones /> Voice room</button>
                </div>
                <div className={styles.managementBody}>
                    <label className={styles.formField}>
                        <span>Room name</span>
                        <div className={styles.roomNameInput}>{roomKind === "text" ? <Hash /> : <Headphones />}<input value={name} onChange={(event) => setName(event.target.value)} placeholder={roomKind === "text" ? "new-ideas" : "kitchen-table"} autoFocus maxLength={36} /></div>
                        {name.trim() && <small>It will appear as {toSlug(name) || "room-name"}.</small>}
                    </label>
                    <label className={styles.formField}>
                        <span>Category</span>
                        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                            {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                        </select>
                    </label>
                    <div className={styles.roomTypeNote}>
                        {roomKind === "text" ? <Hash /> : <Headphones />}
                        <p><strong>{roomKind === "text" ? "A place to keep a conversation." : "A place people can drop into."}</strong><span>{roomKind === "text" ? "Messages stay here for everyone to catch up." : "Members can see who is around before joining."}</span></p>
                    </div>
                </div>
                <footer><span>{roomKind === "text" ? "Text room" : "Voice room"} · {communityName}</span><button type="submit" disabled={!toSlug(name)}>Create room <Plus /></button></footer>
            </form>
        </div>
    );
}
