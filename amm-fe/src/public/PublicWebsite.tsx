import { useState, useEffect } from "react";
import "../public/user-side.css";
import Navbar from "./components/user-side/Navbar";
import Hero from "./components/user-side/Hero";
import Rooms from "./components/user-side/Rooms";
import About from "./components/user-side/About";
import Contact from "./components/user-side/Contact";
import Footer from "./components/user-side/Footer";
import AppointmentBookingForm from "./pages/AppointmentBookingForm";
import Appointments from "./pages/Appointments";
import Calendar from "./pages/Calendar";
import AdminLogin from "./pages/AdminLogin";
import AdminCalendar from "./pages/AdminCalendar";

type Page = "home" | "book" | "appointments" | "calendar" | "rooms" | "about" | "contact" | "adminLogin" | "adminCalendar";

export default function PublicWebsite() {
    const [currentPage, setCurrentPage] = useState<Page>("home");

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash === "book") {
            setCurrentPage("book");
        } else if (hash === "appointments") {
            setCurrentPage("appointments");
        } else if (hash === "calendar") {
            setCurrentPage("calendar");
        } else if (hash === "rooms") {
            setCurrentPage("rooms");
        } else if (hash === "about") {
            setCurrentPage("about");
        } else if (hash === "contact") {
            setCurrentPage("contact");
        } else if (hash === "adminLogin") {
            setCurrentPage("adminLogin");
        } else if (hash === "adminCalendar") {
            setCurrentPage("adminCalendar");
        } else {
            setCurrentPage("home");
        }

        const handleHashChange = () => {
            const newHash = window.location.hash.slice(1);
            if (newHash === "book") {
                setCurrentPage("book");
            } else if (newHash === "appointments") {
                setCurrentPage("appointments");
            } else if (newHash === "calendar") {
                setCurrentPage("calendar");
            } else if (newHash === "rooms") {
                setCurrentPage("rooms");
            } else if (newHash === "about") {
                setCurrentPage("about");
            } else if (newHash === "contact") {
                setCurrentPage("contact");
            } else if (newHash === "adminLogin") {
                setCurrentPage("adminLogin");
            } else if (newHash === "adminCalendar") {
                setCurrentPage("adminCalendar");
            } else {
                setCurrentPage("home");
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const handleNavigate = (page: string) => {
        setCurrentPage(page as Page);
        if (page === "home") {
            window.location.hash = "";
        } else {
            window.location.hash = page;
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case "book":
                return <AppointmentBookingForm />;
            case "appointments":
                return <Appointments />;
            case "calendar":
                return <Calendar />;
            case "adminLogin":
                return <AdminLogin onLoginSuccess={() => window.location.reload()} />;
            case "adminCalendar":
                return <AdminCalendar />;
            case "rooms":
                return <Rooms />;
            case "about":
                return <About />;
            case "contact":
                return <Contact />;
            default:
                return (
                    <>
                        <Hero />
                        <Rooms />
                        <About />
                        <Contact />
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <main className="flex-1">{renderPage()}</main>
            <Footer />
        </div>
    );
}