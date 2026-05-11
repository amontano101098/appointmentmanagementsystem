import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./Registration";
import Dashboard from "./Dashboard";
import PublicWebsite from "./public/PublicWebsite";

export default function App() {
    const [page, setPage] = useState<"login" | "register" | "public" | "home" | "appointments" | "calendar">("login");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }

        const hash = window.location.hash.slice(1);
        if (hash === "public" || hash === "home" || hash === "appointments" || hash === "calendar") {
            setPage(hash);
        }
    }, []);

    if (page === "public" || page === "home" || page === "appointments" || page === "calendar") {
        return <PublicWebsite />;
    }

    if (token) {
        return <Dashboard />;
    }

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