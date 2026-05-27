import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AppointmentBookingForm from "./pages/AppointmentBookingForm";

type Page = "home" | "book";

export default function PublicWebsite() {
    const [currentPage, setCurrentPage] = useState<Page>("home");

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash === "book" || hash === "appointments") {
            setCurrentPage("book");
        } else {
            setCurrentPage("home");
        }

        const handleHashChange = () => {
            const newHash = window.location.hash.slice(1);
            if (newHash === "book" || newHash === "appointments") {
                setCurrentPage("book");
            } else {
                setCurrentPage("home");
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        if (page === "book") {
            window.location.hash = "book";
        } else {
            window.location.hash = "";
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case "book":
                return <AppointmentBookingForm />;
            default:
                return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header currentPage={currentPage} onNavigate={handleNavigate} />
            <main className="flex-1">{renderPage()}</main>
            <Footer />
        </div>
    );
}
