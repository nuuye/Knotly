import { Plus } from "lucide-react";
import { useId } from "react";
import type { FaqItemProps } from "../../types/faq";
import styles from "../../routes/faq.module.scss";

/** Shows one accessible question with a smoothly expanding answer. */
export function FaqItem({ entry, isOpen, onToggle }: FaqItemProps) {
    const answerId = useId();
    const questionId = `${answerId}-question`;

    return (
        <article className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}>
            <button
                id={questionId}
                type="button"
                className={styles.question}
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={answerId}
            >
                <span>{entry.question}</span>
                <i><Plus className={styles.plusIcon} aria-hidden="true" /></i>
            </button>
            <div
                id={answerId}
                className={styles.answer}
                role="region"
                aria-labelledby={questionId}
                aria-hidden={!isOpen}
            >
                <div><p>{entry.answer}</p></div>
            </div>
        </article>
    );
}
