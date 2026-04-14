import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./Registration";
import Dashboard from "./Dashboard";

export default function App() {
    const [page, setPage] = useState<"login" | "register">("login");
    const [token, setToken] = useState<string | null>(null);

    // Check if user is logged in
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // If logged in → go dashboard
    if (token) {
        return <Dashboard />;
    }

    // If not logged in → show auth pages
    return page === "login" ? (
        <LoginPage
            goToRegister={() => setPage("register")}
            onLoginSuccess={(token: string) => {
                localStorage.setItem("token", token);
                setToken(token);
            }}
        />
    ) : (
        <RegisterPage
            goToLogin={() => setPage("login")}
            onRegisterSuccess={(token: string) => {
                localStorage.setItem("token", token);
                setToken(token);
            }}
        />
    );
}
