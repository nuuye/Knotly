import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from 'path'

// Load generated routes before React and map "@" to the source folder.
export default defineConfig({
    plugins: [tanstackRouter(), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
