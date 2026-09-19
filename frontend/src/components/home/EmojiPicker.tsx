import type { EmojiPickerProps } from "../../types/home";
import styles from "../../routes/home.module.scss";

const TEXT_EMOJIS = ["😀", "😂", "🥹", "😍", "🤔", "😅", "🙌", "👏", "❤️", "🔥", "✨", "🎉", "👍", "👀", "😭", "😊", "🤝", "🌿", "☕", "🎧"];

/** Inserts a common emoji into the active message field. */
export function EmojiPicker({ onSelect }: EmojiPickerProps) {
    return (
        <div className={styles.emojiPicker} role="dialog" aria-label="Choose an emoji">
            <span>Emojis</span>
            <div>
                {TEXT_EMOJIS.map((emoji) => (
                    <button key={emoji} type="button" onClick={() => onSelect(emoji)} aria-label={`Add ${emoji}`}>{emoji}</button>
                ))}
            </div>
        </div>
    );
}
