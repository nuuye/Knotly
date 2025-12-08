import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools' // Optional

export const Route = createRootRoute({
    component: () => (
        <div className="bg-knotly-bg min-h-screen text-knotly-dark font-sans">
            {/* Outlet renders the child routes */}
            <Outlet />
            {/* <TanStackRouterDevtools /> */}
        </div>
    ),
});
