import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export const Route = createFileRoute("/")({
    component: LandingPage,
});

function LandingPage() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleGuestLogin = async () => {
        if (!username) return;

        // TODO: Call API /api/auth/guest here
        console.log("Entering as:", username);

        // Navigate to the chat page
        navigate({ to: "/chat" });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="text-center space-y-6 p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white">
                <h1 className="text-5xl font-bold text-knotly-primary tracking-tight">Knotly.</h1>
                <p className="text-gray-500">Chill chat for cool people.</p>

                <div className="flex flex-col gap-4 w-72 mx-auto">
                    <Input
                        placeholder="Choose a funky username..."
                        className="text-center bg-white border-knotly-secondary focus-visible:ring-knotly-primary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button
                        onClick={handleGuestLogin}
                        className="bg-knotly-primary hover:bg-purple-500 text-white font-bold py-2 rounded-full transition-all hover:scale-105"
                    >
                        Join as Guest
                    </Button>

                    <div className="text-xs text-gray-400 mt-2">
                        Or <span className="underline cursor-pointer hover:text-knotly-primary">Login</span> to recover
                        your account
                    </div>
                </div>
            </div>
        </div>
    );
}
