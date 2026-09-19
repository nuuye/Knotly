import { Search, X } from "lucide-react";
import { useRef } from "react";
import { useDismissableLayer } from "../../hooks/useDismissableLayer";
import type { MessageSearchProps } from "../../types/home";
import styles from "../../routes/home.module.scss";

/** Highlights the first matching part without changing the original message. */
function HighlightedText({ query, text }: { query: string; text: string }) {
    const matchIndex = text.toLowerCase().indexOf(query.trim().toLowerCase());
    if (matchIndex < 0 || !query.trim()) return text;
    const matchEnd = matchIndex + query.trim().length;
    return <>{text.slice(0, matchIndex)}<mark>{text.slice(matchIndex, matchEnd)}</mark>{text.slice(matchEnd)}</>;
}

/** Searches only the private conversation or community room currently open. */
export function MessageSearch({ contextLabel, isOpen, query, results, setIsOpen, setQuery, onSelect }: MessageSearchProps) {
    const searchRef = useRef<HTMLDivElement>(null);
    useDismissableLayer(isOpen, searchRef, setIsOpen);

    return (
        <div className={styles.messageSearchWrap} ref={searchRef}>
            <button type="button" className={isOpen ? styles.activeChatAction : ""} onClick={() => setIsOpen((open) => !open)} aria-label="Search messages" aria-expanded={isOpen}><Search /></button>
            {isOpen && (
                <div className={styles.messageSearchPopover}>
                    <header><span>Search in <strong>{contextLabel}</strong></span><button type="button" onClick={() => setIsOpen(false)} aria-label="Close search"><X /></button></header>
                    <label><Search /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Words in a message" autoFocus /><button type="button" onClick={() => setQuery("")} aria-label="Clear search" disabled={!query}><X /></button></label>
                    <div className={styles.messageSearchResults}>
                        {!query.trim() ? (
                            <div className={styles.messageSearchEmpty}><Search /><strong>Find a message</strong><span>Search the conversation currently open.</span></div>
                        ) : results.length > 0 ? results.map((result) => (
                            <button key={`${result.scope}-${result.id}`} type="button" onClick={() => onSelect(result)}>
                                <span><strong>{result.author}</strong><time>{result.time}</time></span>
                                <p><HighlightedText query={query} text={result.text} /></p>
                            </button>
                        )) : (
                            <div className={styles.messageSearchEmpty}><Search /><strong>No matching message</strong><span>Try a different word or phrase.</span></div>
                        )}
                    </div>
                    {query.trim() && <footer>{results.length} {results.length === 1 ? "result" : "results"}</footer>}
                </div>
            )}
        </div>
    );
}
