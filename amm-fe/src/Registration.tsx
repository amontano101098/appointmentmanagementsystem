import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
export default function RegisterPage({
    goToLogin,
    onRegisterSuccess,
}: {
    goToLogin: () => void;
    onRegisterSuccess: (token: string) => void;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleRegister = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:9000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Account created!");
                onRegisterSuccess(data.token);
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (err) {
            alert("Server error");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-all duration-500">
            {/* Card */}
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Sign up to get started
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Name */}
                    <div className="relative">
                        <User className="absolute left-3 top-4 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none"
                        />
                        <label className="absolute left-10 top-2 text-xs text-gray-400">
                            Name
                        </label>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-4 w-5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none"
                        />
                        <label className="absolute left-10 top-2 text-xs text-gray-400">
                            Email
                        </label>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 w-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none"
                        />
                        <label className="absolute left-10 top-2 text-xs text-gray-400">
                            Password
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-4 text-gray-400"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={goToLogin}
                        className="text-gray-800 dark:text-white font-medium cursor-pointer hover:underline"
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}
