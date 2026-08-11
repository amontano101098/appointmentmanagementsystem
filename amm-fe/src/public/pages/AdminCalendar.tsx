import { useState, useEffect } from "react";
import type { Booking } from "../types";
import { fetchBookings, updateBooking, deleteBooking } from "../api";
import { ChevronLeft, ChevronRight, Trash2, Check, X } from "lucide-react";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function AdminCalendar() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("All");

    useEffect(() => {
        fetchBookings()
            .then(setBookings)
            .catch(() => console.log("Error fetching bookings"))
            .finally(() => setLoading(false));
    }, []);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getBookingsForDate = (dateStr: string) => {
        return bookings.filter((b) => {
            const matchDate = b.check_in <= dateStr && b.check_out >= dateStr;
            const matchStatus = filterStatus === "All" || b.status === filterStatus;
            return matchDate && matchStatus;
        });
    };

    const handlePrevYear = () => setCurrentYear(prev => prev - 1);
    const handleNextYear = () => setCurrentYear(prev => prev + 1);

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await updateBooking(id, { status });
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status } : b))
            );
        } catch (err) {
            console.log("Update error", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteBooking(id);
            setBookings((prev) => prev.filter((b) => b.id !== id));
            if (selectedDay) {
                const remaining = bookings.filter(
                    (b) => b.id !== id && b.check_in <= selectedDay && b.check_out >= selectedDay
                );
                if (remaining.length === 0) {
                    setSelectedDay(null);
                }
            }
        } catch (err) {
            console.log("Delete error", err);
        }
    };

    const getBookingStatusColor = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-green-900/30 text-green-300 border border-green-700";
            case "Pending":
                return "bg-yellow-900/30 text-yellow-300 border border-yellow-700";
            case "Cancelled":
                return "bg-red-900/30 text-red-300 border border-red-700";
            default:
                return "bg-gray-700 text-gray-300 border border-gray-600";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#d4af37]">Admin Calendar</h1>
                        <p className="text-[#94a3b8] mt-1">Manage room bookings</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-[#334155] rounded-lg bg-[#1e293b] text-[#f8fafc] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevYear}
                                className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#94a3b8]" />
                            </button>
                            <span className="text-lg font-semibold min-w-[120px] text-center text-[#f8fafc]">{currentYear}</span>
                            <button
                                onClick={handleNextYear}
                                className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-[#94a3b8]" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {monthNames.map((monthName, monthIndex) => {
                        const daysInMonth = getDaysInMonth(currentYear, monthIndex);
                        const firstDay = getFirstDayOfMonth(currentYear, monthIndex);
                        const days = [];

                        for (let i = 0; i < firstDay; i++) {
                            days.push(<div key={`empty-${monthIndex}-${i}`} className="p-2"></div>);
                        }

                        for (let day = 1; day <= daysInMonth; day++) {
                            const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const dayBookings = getBookingsForDate(dateStr);
                            const hasBookings = dayBookings.length > 0;

                            days.push(
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(selectedDay === dateStr ? null : dateStr)}
                                    className={`p-2 rounded-lg text-center text-sm transition-all
                                        ${hasBookings
                                            ? "bg-[#d4af37]/20 text-[#d4af37] font-medium hover:bg-[#d4af37]/30"
                                            : "bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]"
                                        }
                                        ${selectedDay === dateStr ? "ring-2 ring-[#d4af37]" : ""}
                                    `}
                                >
                                    {day}
                                    {hasBookings && (
                                        <span className="block text-xs mt-0.5">
                                            {dayBookings.length}
                                        </span>
                                    )}
                                </button>
                            );
                        }

                        return (
                            <div key={monthIndex} className="border border-[#334155] rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-center text-[#f8fafc]">{monthName}</h4>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="font-medium text-[#64748b]">{d}</div>
                                    ))}
                                    {days}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedDay && (
                    <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-[#334155]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-[#f8fafc]">
                                Bookings for {selectedDay}
                            </h3>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="text-[#94a3b8] hover:text-[#d4af37]"
                            >
                                ✕
                            </button>
                        </div>

                        {getBookingsForDate(selectedDay).length === 0 ? (
                            <p className="text-[#94a3b8]">No bookings on this date</p>
                        ) : (
                            <div className="space-y-4">
                                {getBookingsForDate(selectedDay).map((b) => (
                                    <div
                                        key={b.id}
                                        className="bg-[#0f172a] p-4 rounded-lg border border-[#334155] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-medium text-[#f8fafc]">{b.name}</h4>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getBookingStatusColor(b.status)}`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-[#94a3b8]">
                                                <span>📧 {b.email}</span>
                                                <span>🏨 {b.room}</span>
                                                <span>📅 {b.check_in} → {b.check_out}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {b.status === "Pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(b.id, "Approved")}
                                                        className="px-3 py-1.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(b.id, "Cancelled")}
                                                        className="px-3 py-1.5 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 text-sm"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {b.status !== "Pending" && (
                                                <button
                                                    onClick={() => handleStatusChange(b.id, "Pending")}
                                                    className="px-3 py-1.5 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(b.id)}
                                                className="px-3 py-1.5 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900 transition-colors flex items-center gap-1 text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}