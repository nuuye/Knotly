import type { LucideIcon } from "lucide-react";

export interface ExploreCommunity {
    id: string;
    name: string;
    description: string;
    members: number;
    online: number;
    category: string;
    categoryLabel: string;
    icon: LucideIcon;
    tone: string;
    rooms: string[];
}

export interface ExploreCategory {
    id: string;
    name: string;
    icon: LucideIcon;
}
