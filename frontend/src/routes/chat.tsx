import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
    component: () => <div className="p-10 text-2xl">🚧 Chat Interface Loading...</div>,
});
