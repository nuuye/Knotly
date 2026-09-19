import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";

/** Closes a small overlay when the user clicks outside it or presses Escape. */
export function useDismissableLayer<T extends HTMLElement>(
    isOpen: boolean,
    elementRef: RefObject<T | null>,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
) {
    useEffect(() => {
        if (!isOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!elementRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [elementRef, isOpen, setIsOpen]);
}
