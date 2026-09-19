import type { LucideIcon } from "lucide-react";

export type FaqCategoryId = "getting-started" | "conversations" | "communities" | "account";

export interface FaqEntry {
    category: FaqCategoryId;
    question: string;
    answer: string;
}

export interface FaqCategory {
    id: FaqCategoryId;
    label: string;
    description: string;
    icon: LucideIcon;
}

export interface FaqItemProps {
    entry: FaqEntry;
    isOpen: boolean;
    onToggle: () => void;
}
