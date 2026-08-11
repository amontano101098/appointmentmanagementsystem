import { Calendar, Home, List, BedDouble, CalendarDays } from "lucide-react";

interface HeaderProps {
    onNavigate?: (page: string) => void;
    currentPage?: string;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
    const isActive = (page: string) => currentPage === page;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-blue-600">
                            Appointment System
                        </h1>
                        <nav className="hidden md:flex gap-6">
                            <button
                                onClick={() => onNavigate?.("home")}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    isActive("home")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </button>
                            <button
                                onClick={() => onNavigate?.("book")}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    isActive("book")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <BedDouble className="w-4 h-4" />
                                Book Now
                            </button>
                            <button
                                onClick={() => onNavigate?.("appointments")}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    isActive("appointments")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <List className="w-4 h-4" />
                                Appointments
                            </button>
                            <button
                                onClick={() => onNavigate?.("calendar")}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    isActive("calendar")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Calendar className="w-4 h-4" />
                                Calendar
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
<button
                                onClick={() => onNavigate?.("adminCalendar")}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    isActive("adminCalendar")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <CalendarDays className="w-4 h-4" />
                                Admin Calendar
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Admin Login
                            </button>
                    </div>
                </div>
            </div>
        </header>
    );
}