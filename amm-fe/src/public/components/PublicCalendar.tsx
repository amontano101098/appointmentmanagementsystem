import { useState, useEffect } from "react";
import type { Appointment, DayInfo } from "../types";
import { fetchAppointments } from "../api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function PublicCalendar() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments()
            .then(setAppointments)
            .catch(() => console.log("Error fetching appointments"))
            .finally(() => setLoading(false));
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

    const handlePrevYear = () => setCurrentYear(prev => prev - 1);
    const handleNextYear = () => setCurrentYear(prev => prev + 1);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Appointment Calendar</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevYear}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-semibold min-w-[120px] text-center">{currentYear}</span>
                    <button
                        onClick={handleNextYear}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
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
                        const hasAppointments = dayAppointments.length > 0;

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
                                        ? "bg-green-100 text-green-800 font-medium hover:bg-green-200" 
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    }
                                    ${selectedDay?.date === dateStr ? "ring-2 ring-blue-500" : ""}
                                `}
                            >
                                {day}
                            </button>
                        );
                    }

                    return (
                        <div key={monthIndex} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-center text-gray-800">{monthName}</h4>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                    <div key={i} className="font-medium text-gray-400">{d}</div>
                                ))}
                                {days}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-900">
                            {selectedDay.date} {selectedDay.hasAppointments && `(${selectedDay.appointments.length} appointments)`}
                        </h3>
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    {!selectedDay.hasAppointments ? (
                        <p className="text-gray-500">No appointments on this date</p>
                    ) : (
                        <div className="space-y-2">
                            {selectedDay.appointments.map((a) => (
                                <div key={a.id} className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="font-medium text-gray-900">{a.name}</p>
                                    <p className="text-sm text-gray-500">{a.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}