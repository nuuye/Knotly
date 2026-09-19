export type NetworkVariant = "login" | "signup";

export interface NetworkPoint {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

export interface NetworkEdge {
    from: number;
    to: number;
    opacity: number;
    width?: number;
}

export interface ConnectionNetworkProps {
    className?: string;
    variant: NetworkVariant;
}

export interface NetworkLayout {
    points: NetworkPoint[];
    edges: NetworkEdge[];
}
