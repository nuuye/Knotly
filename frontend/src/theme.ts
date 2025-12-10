import { createTheme } from "@mui/material/styles";

// Definition of the Knotly Pastel Palette
const theme = createTheme({
    palette: {
        primary: {
            main: "#A78BFA", // Soft Purple
            contrastText: "#fff",
        },
        secondary: {
            main: "#FBCFE8", // Pastel Pink
        },
        background: {
            default: "#FDFCFE", // Very light lilac white
            paper: "#FFFFFF",
        },
        text: {
            primary: "#4B5563", // Soft Grey (never pure black)
            secondary: "#9CA3AF",
        },
        success: {
            main: "#99F6E4", // Mint Green
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            color: "#A78BFA",
        },
        button: {
            textTransform: "none", // Disable uppercase on buttons for a "chill" look
            fontWeight: 600,
            borderRadius: "20px",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "50px", // Fully rounded buttons
                    padding: "10px 24px",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: "16px", // Rounded cards
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)", // Soft shadow
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                },
            },
        },
    },
});

export default theme;
