import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage({
    goToRegister,
    onLoginSuccess,
}: {
    goToRegister: () => void;
    onLoginSuccess: (token: string) => void;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [dark, setDark] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // 🌗 Load theme
    useEffect(() => {
        const saved = localStorage.getItem("theme");

        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        } else if (saved === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            const systemDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            if (systemDark) {
                document.documentElement.classList.add("dark");
                setDark(true);
            }
        }
    }, []);

    const toggleDark = () => {
        const html = document.documentElement;

        if (dark) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }

        setDark(!dark);
    };

    const handleLogin = async () => {
        setLoading(true);

        try {
            const res = await fetch("http://localhost:9000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ Save token (VERY IMPORTANT)
                localStorage.setItem("token", data.token);

                // ✅ Optional: save user
                localStorage.setItem("user", JSON.stringify(data.user));

                // ✅ Redirect (basic)
                onLoginSuccess(data.token);
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (error) {
            alert("Server error. Check API.");
        }

        setLoading(false);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-all duration-500">
            {/* 🌙 Toggle */}
            <button
                onClick={toggleDark}
                className="absolute top-5 right-5 text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:scale-105 transition"
            >
                {dark ? "🌙" : "☀️"}
            </button>

            {/* 🧊 Card */}
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-500">
                {/* Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Please enter your details
                    </p>
                </div>

                <div className="space-y-6">
                    {/* 📧 Email (Floating Label) */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-4 w-5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer w-full pl-10 pr-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none transition"
                        />
                        <label
                            className="absolute left-10 top-2 text-xs text-gray-400 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
              peer-focus:top-2 peer-focus:text-xs"
                        >
                            Email
                        </label>
                    </div>

                    {/* 🔒 Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 w-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full pl-10 pr-10 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none transition"
                        />
                        <label
                            className="absolute left-10 top-2 text-xs text-gray-400 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
              peer-focus:top-2 peer-focus:text-xs"
                        >
                            Password
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* 🚀 Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <span
                        onClick={goToRegister}
                        className="text-gray-800 dark:text-white font-medium cursor-pointer hover:underline"
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}
