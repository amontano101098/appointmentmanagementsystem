import { useState, useEffect } from "react";
import type { Appointment } from "../types";
import { fetchUpcomingAppointments } from "../api";
import { Calendar, Clock, User } from "lucide-react";

export default function UpcomingAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpcomingAppointments(5)
            .then(setAppointments)
            .catch(() => console.log("Error fetching appointments"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-6">
            <h3 className="text-lg font-semibold text-[#f8fafc] mb-4">Upcoming Appointments</h3>
            
            {appointments.length === 0 ? (
                <p className="text-[#94a3b8]">No upcoming appointments</p>
            ) : (
                <div className="space-y-3">
                    {appointments.map((apt) => (
                        <div
                            key={apt.id}
                            className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                                    <User className="w-5 h-5 text-[#d4af37]" />
                                </div>
                                <div>
                                    <p className="font-medium text-[#f8fafc]">{apt.name}</p>
                                    <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {apt.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {apt.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-900/30 text-green-300 border border-green-700 text-sm rounded-full">
                                Approved
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}