import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, TextField, Typography, Paper, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Import the SCSS file directly
import "./index.scss";

export const Route = createFileRoute("/")({
    component: LandingPage,
});

function LandingPage() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleGuestLogin = () => {
        if (!username) return;
        console.log("Entering as:", username);
        navigate({ to: "/chat" });
    };

    return (
        <div className="aurora-container">
            <div className="aurora-background" />
            <div className="aurora-content">
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: 400,
                        width: "90%",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(255, 255, 255, 0.8)",
                        borderRadius: "24px",
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: "800", color: "#8b5cf6", mb: 0, letterSpacing: "-0.02em" }}
                    >
                        Knotly.
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, color: "#6b7280", fontWeight: 500 }}>
                        Chill chat for cool people.
                    </Typography>

                    <Stack spacing={3} width="100%">
                        <TextField
                            label="Choose a pseudo"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "rgba(255,255,255,0.8)",
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            endIcon={<ArrowForwardIcon />}
                            onClick={handleGuestLogin}
                            disabled={!username}
                            sx={{
                                // Custom gradient button to match theme
                                background: "linear-gradient(135deg, #A78BFA 0%, #8b5cf6 100%)",
                                boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #9061F9 0%, #7c3aed 100%)",
                                },
                            }}
                        >
                            Join as Guest
                        </Button>

                        <Typography variant="caption" align="center" color="textSecondary">
                            Or <span style={{ color: "#8b5cf6", cursor: "pointer", fontWeight: "bold" }}>Login</span> to
                            recover account
                        </Typography>
                    </Stack>
                </Paper>
            </div>
        </div>
    );
}
