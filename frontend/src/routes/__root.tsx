import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Box } from "@mui/material";
import { NotFoundPage } from "../components/notFound/notFound";

export const Route = createRootRoute({
    notFoundComponent: NotFoundPage,
    component: () => (
        // Keep a full-height background around every child route.
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <Outlet />
        </Box>
    ),
});
