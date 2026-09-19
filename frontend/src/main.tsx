import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import './styles/global.scss'

// The generated route tree contains every page known by TanStack Router.
const router = createRouter({ routeTree });

// This type link gives route helpers full knowledge of the application routes.
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Start React once the page root is available.
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
