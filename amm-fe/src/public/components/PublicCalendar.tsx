import { useState, useEffect } from "react";
import type { Appointment, Booking, DayInfo } from "../types";
import { fetchAppointments, fetchBookings } from "../api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function PublicCalendar() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments()
            .then(setAppointments)
            .catch(() => console.log("Error fetching appointments"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchBookings()
            .then(setBookings)
            .catch(() => console.log("Error fetching bookings"));
    }, []);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getAppointmentsForDate = (dateStr: string) => {
        return appointments.filter((a) => a.date === dateStr && a.status === "Approved");
    };

    const hasApprovedBooking = (dateStr: string) => {
        return bookings.some((b) => b.status === "Approved" && b.check_in <= dateStr && b.check_out >= dateStr);
    };

    const handlePrevYear = () => setCurrentYear(prev => prev - 1);
    const handleNextYear = () => setCurrentYear(prev => prev + 1);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#f8fafc]">Appointment Calendar</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevYear}
                        className="p-2 hover:bg-[#0f172a] rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-[#94a3b8]" />
                    </button>
                    <span className="text-lg font-semibold min-w-[120px] text-center text-[#f8fafc]">{currentYear}</span>
                    <button
                        onClick={handleNextYear}
                        className="p-2 hover:bg-[#0f172a] rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-[#94a3b8]" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {monthNames.map((monthName, monthIndex) => {
                    const daysInMonth = getDaysInMonth(currentYear, monthIndex);
                    const firstDay = getFirstDayOfMonth(currentYear, monthIndex);
                    const days = [];

                    for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${monthIndex}-${i}`} className="p-2"></div>);
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                        const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const dayAppointments = getAppointmentsForDate(dateStr);
                        const hasBookingOnDay = hasApprovedBooking(dateStr);
                        const hasAppointments = dayAppointments.length > 0 || hasBookingOnDay;

                        days.push(
                            <button
                                key={day}
                                onClick={() => setSelectedDay({
                                    date: dateStr,
                                    day,
                                    hasAppointments,
                                    appointments: dayAppointments
                                })}
                                className={`p-2 rounded-lg text-center text-sm transition-all
                                    ${hasAppointments 
                                        ? "bg-green-900/30 text-green-300 font-medium hover:bg-green-900/50" 
                                        : "bg-[#0f172a] text-[#94a3b8] hover:bg-[#1e293b]"
                                    }
                                    ${selectedDay?.date === dateStr ? "ring-2 ring-[#d4af37]" : ""}
                                `}
                            >
                                {day}
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
                <div className="mt-6 p-4 bg-[#0f172a] rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-[#f8fafc]">
                            {selectedDay.date} {selectedDay.hasAppointments && `(${selectedDay.appointments.length} appointments)`}
                        </h3>
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="text-[#94a3b8] hover:text-[#d4af37]"
                        >
                            ✕
                        </button>
                    </div>
                    {!selectedDay.hasAppointments ? (
                        <p className="text-[#94a3b8]">No appointments on this date</p>
                    ) : (
                        <div className="space-y-2">
                            {selectedDay.appointments.map((a) => (
                                <div key={a.id} className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                                    <p className="font-medium text-[#f8fafc]">{a.name}</p>
                                    <p className="text-sm text-[#94a3b8]">{a.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}