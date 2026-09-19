import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Box } from "@mui/material";
import { NotFoundPage } from "../components/notFound/notFound";

export const Route = createRootRoute({
    notFoundComponent: NotFoundPage,
    component: () => (
        // Uses the default background color from theme
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <Outlet />
        </Box>
    ),
});
