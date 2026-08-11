import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./Registration";
import Dashboard from "./Dashboard";
import PublicWebsite from "./public/PublicWebsite";

export default function App() {
    const [page, setPage] = useState<"login" | "register" | "public" | "home" | "appointments" | "calendar" | "rooms" | "about" | "contact" | "adminLogin" | "adminCalendar">("login");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }

        const hash = window.location.hash.slice(1);
        if (hash === "public" || hash === "home" || hash === "appointments" || hash === "calendar" || hash === "rooms" || hash === "about" || hash === "contact" || hash === "adminLogin" || hash === "adminCalendar") {
            setPage(hash);
        }
    }, []);

    if (page === "public" || page === "home" || page === "appointments" || page === "calendar" || page === "rooms" || page === "about" || page === "contact" || page === "adminLogin" || page === "adminCalendar") {
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