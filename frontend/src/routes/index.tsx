import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, TextField, Typography, Paper, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const Route = createFileRoute("/")({
    component: LandingPage,
});

function LandingPage() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleGuestLogin = () => {
        if (!username) return;

        // TODO: Connect to Spring Boot API
        console.log("Entering as:", username);
        navigate({ to: "/chat" });
    };

    return (
        // We use the SCSS class for the gradient background
        <div className="landing-container">
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: 400,
                    width: "100%",
                    border: "1px solid rgba(255,255,255,0.5)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Glassmorphism-ish
                    backdropFilter: "blur(10px)",
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main", mb: 0 }}
                >
                    Knotly.
                </Typography>

                <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                    Chill chat for cool people.
                </Typography>

                <Stack spacing={3} width="100%">
                    <TextField
                        label="Choose a pseudo"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        // Customizing the input specifically here if needed
                        sx={{ backgroundColor: "white" }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleGuestLogin}
                        disabled={!username}
                    >
                        Join as Guest
                    </Button>

                    <Typography variant="caption" align="center" color="textSecondary">
                        Or <span style={{ color: "#A78BFA", cursor: "pointer", fontWeight: "bold" }}>Login</span> to
                        recover account
                    </Typography>
                </Stack>
            </Paper>
        </div>
    );
}
