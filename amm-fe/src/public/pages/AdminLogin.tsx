import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/login", {
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
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                onLoginSuccess();
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch {
            setError("Server error. Check API.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-all duration-500">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-500">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Admin Login
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-4 w-5 text-gray-400 z-10" />
                        <input
                            type="email"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer w-full pl-10 pr-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none transition"
                        />
                        <label className="absolute left-10 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                            Email
                        </label>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-4 w-5 text-gray-400 z-10" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full pl-10 pr-10 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none transition"
                        />
                        <label className="absolute left-10 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                            Password
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 z-10"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
}