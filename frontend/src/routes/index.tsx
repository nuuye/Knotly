import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, TextField, Typography, Paper, Stack, Box, Avatar, Chip, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MicIcon from "@mui/icons-material/Mic";
import HeadsetIcon from "@mui/icons-material/Headset";
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

            {/* Navbar Section */}
            <nav className="navbar">
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight: "900",
                        color: "#4c1d95",
                        letterSpacing: "-0.03em",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <AutoAwesomeIcon sx={{ color: "#7c3aed" }} />
                    Knotly.
                </Typography>

                <Button
                    variant="text"
                    sx={{
                        color: "#5b21b6",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { backgroundColor: "rgba(124, 58, 237, 0.1)" },
                    }}
                >
                    Login
                </Button>
            </nav>

            {/* Main Hero Section */}
            <main className="hero-content">
                {/* LEFT COLUMN: Text and Action */}
                <Box sx={{ flex: 1, maxWidth: { md: "580px" }, zIndex: 2 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: "900",
                            fontSize: { xs: "3rem", md: "4.5rem" },
                            lineHeight: 1,
                            color: "#2e1065",
                            mb: 3,
                            letterSpacing: "-0.03em",
                            textTransform: "uppercase",
                            fontFamily: "inherit",
                            textShadow: "0px 2px 0px rgba(255,255,255,0.4)",
                        }}
                    >
                        IMAGINE A PLACE TO <span style={{ color: "#7c3aed" }}>CHILL.</span>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: "1.25rem",
                            color: "#4c1d95",
                            mb: 5,
                            maxWidth: "480px",
                            fontWeight: 500,
                            lineHeight: 1.6,
                        }}
                    >
                        Your corner of the internet to talk, play, and hang out with communities that share your vibe.
                    </Typography>

                    {/* Action Area: Glassmorphism Input */}
                    <Paper
                        elevation={4}
                        sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "450px",
                            borderRadius: "50px",
                            border: "1px solid rgba(255, 255, 255, 0.6)",
                            // High transparency to show the aurora background through
                            background: "rgba(255, 255, 255, 0.6)",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 8px 32px 0 rgba(100, 50, 200, 0.1)",
                        }}
                    >
                        <TextField
                            placeholder="Pick a cool username..."
                            variant="standard"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                sx: { px: 2, fontSize: "1.1rem", fontWeight: 600, color: "#2e1065" },
                            }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGuestLogin}
                            disabled={!username}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                borderRadius: "40px",
                                px: 4,
                                py: 1.5,
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 700,
                                background: "#7c3aed",
                                boxShadow: "none",
                                "&:hover": {
                                    background: "#6d28d9",
                                },
                            }}
                        >
                            Join
                        </Button>
                    </Paper>
                </Box>

                {/* RIGHT COLUMN: Visual (Mock Chat Interface) */}
                <Box
                    className="floating-mockup"
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {/* The "App Preview" Card - More Transparent Now */}
                    <Paper
                        elevation={8}
                        sx={{
                            width: "100%",
                            maxWidth: 380,
                            height: 480,
                            borderRadius: "24px",
                            // More transparent glass effect
                            background: "rgba(255, 255, 255, 0.55)",
                            backdropFilter: "blur(24px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.8)",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 1,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* Fake App Header */}
                        <Box
                            sx={{
                                p: 2,
                                borderBottom: "1px solid rgba(255,255,255,0.3)",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                bgcolor: "rgba(255,255,255,0.2)",
                            }}
                        >
                            <Avatar sx={{ bgcolor: "#7c3aed", width: 40, height: 40, fontWeight: "bold" }}>K</Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={800} color="#2e1065">
                                    # music-lounge
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#5b21b6", fontWeight: 600 }}>
                                    ● Online
                                </Typography>
                            </Box>
                        </Box>

                        {/* Chat Area */}
                        <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
                            {/* Message 1 */}
                            <Stack direction="row" spacing={1.5}>
                                <Avatar src="/broken.jpg" sx={{ width: 36, height: 36, bgcolor: "#f472b6" }} />
                                <Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#be185d" }}>
                                            Mia
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Today at 2:30 PM
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: "#374151", mt: 0.5 }}>
                                        This gradient background is so cozy! 🌸
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Message 2 */}
                            <Stack direction="row" spacing={1.5}>
                                <Avatar sx={{ bgcolor: "#3b82f6", width: 36, height: 36 }}>J</Avatar>
                                <Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#2563eb" }}>
                                            Jake
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Today at 2:32 PM
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: "#374151", mt: 0.5 }}>
                                        Agreed. Perfect vibe for lofi beats.
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Badge */}
                            <Box sx={{ alignSelf: "center", my: 1 }}>
                                <Chip
                                    label="New messages"
                                    size="small"
                                    sx={{
                                        bgcolor: "#e0e7ff",
                                        color: "#4338ca",
                                        fontWeight: 700,
                                        border: "1px solid #c7d2fe",
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* User Control Bar */}
                        <Box
                            sx={{
                                p: 1.5,
                                bgcolor: "rgba(255,255,255,0.4)",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "#10b981", fontSize: "0.8rem" }}>Me</Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" fontWeight={700} display="block" color="#2e1065">
                                    Guest
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    #1234
                                </Typography>
                            </Box>
                            <IconButton size="small">
                                <MicIcon fontSize="small" sx={{ color: "#4b5563" }} />
                            </IconButton>
                            <IconButton size="small">
                                <HeadsetIcon fontSize="small" sx={{ color: "#4b5563" }} />
                            </IconButton>
                        </Box>
                    </Paper>
                </Box>
            </main>
        </div>
    );
}
