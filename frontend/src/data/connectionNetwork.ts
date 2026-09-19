import type { NetworkLayout, NetworkVariant } from "../types/connectionNetwork";

const LOGIN_LAYOUT: NetworkLayout = {
    points: [
        { x: 0.64, y: 0.05, radius: 5, opacity: 0.72 },
        { x: 0.79, y: 0.19, radius: 11, opacity: 0.28 },
        { x: 0.97, y: 0.1, radius: 6, opacity: 0.82 },
        { x: 0.89, y: 0.34, radius: 5, opacity: 0.46 },
        { x: 0.025, y: 0.25, radius: 7, opacity: 0.24 },
        { x: 0.18, y: 0.41, radius: 4, opacity: 0.58 },
        { x: 0.09, y: 0.62, radius: 6, opacity: 0.34 },
        { x: 0.03, y: 0.88, radius: 7, opacity: 0.56 },
        { x: 0.22, y: 0.96, radius: 13, opacity: 0.25 },
        { x: 0.39, y: 0.79, radius: 5, opacity: 0.74 },
        { x: 0.56, y: 0.94, radius: 5, opacity: 0.66 },
        { x: 0.73, y: 0.7, radius: 9, opacity: 0.4 },
        { x: 0.98, y: 0.85, radius: 5, opacity: 0.64 },
        { x: 0.89, y: 0.55, radius: 7, opacity: 0.28 },
    ],
    edges: [
        { from: 0, to: 1, opacity: 0.38 }, { from: 1, to: 2, opacity: 0.55, width: 1.4 },
        { from: 1, to: 3, opacity: 0.24 },
        { from: 4, to: 5, opacity: 0.3 }, { from: 5, to: 6, opacity: 0.44, width: 1.4 },
        { from: 7, to: 8, opacity: 0.48 }, { from: 8, to: 9, opacity: 0.3 },
        { from: 10, to: 11, opacity: 0.28 }, { from: 11, to: 12, opacity: 0.5, width: 1.5 },
        { from: 11, to: 13, opacity: 0.36 },
    ],
};

const SIGNUP_LAYOUT: NetworkLayout = {
    points: [
        { x: 0.71, y: 0.03, radius: 5, opacity: 0.7 },
        { x: 0.83, y: 0.15, radius: 10, opacity: 0.3 },
        { x: 0.98, y: 0.05, radius: 6, opacity: 0.82 },
        { x: 0.92, y: 0.29, radius: 4, opacity: 0.48 },
        { x: 0.03, y: 0.11, radius: 7, opacity: 0.25 },
        { x: 0.17, y: 0.25, radius: 5, opacity: 0.62 },
        { x: 0.04, y: 0.43, radius: 6, opacity: 0.38 },
        { x: 0.04, y: 0.68, radius: 8, opacity: 0.38 },
        { x: 0.19, y: 0.94, radius: 12, opacity: 0.26 },
        { x: 0.39, y: 0.84, radius: 5, opacity: 0.72 },
        { x: 0.63, y: 0.75, radius: 7, opacity: 0.32 },
        { x: 0.87, y: 0.57, radius: 9, opacity: 0.4 },
        { x: 0.98, y: 0.79, radius: 6, opacity: 0.64 },
        { x: 0.76, y: 0.97, radius: 5, opacity: 0.3 },
    ],
    edges: [
        { from: 0, to: 1, opacity: 0.46 }, { from: 1, to: 2, opacity: 0.56, width: 1.5 },
        { from: 1, to: 3, opacity: 0.34 },
        { from: 4, to: 5, opacity: 0.24 }, { from: 5, to: 6, opacity: 0.46 },
        { from: 7, to: 8, opacity: 0.5, width: 1.5 }, { from: 8, to: 9, opacity: 0.36 },
        { from: 10, to: 11, opacity: 0.26 }, { from: 11, to: 12, opacity: 0.48 },
        { from: 10, to: 13, opacity: 0.4 },
    ],
};

export const CONNECTION_LAYOUTS: Record<NetworkVariant, NetworkLayout> = {
    login: LOGIN_LAYOUT,
    signup: SIGNUP_LAYOUT,
};
