import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Box } from "@mui/material";

export const Route = createRootRoute({
    component: () => (
        // Uses the default background color from theme
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <Outlet />
        </Box>
    ),
});
