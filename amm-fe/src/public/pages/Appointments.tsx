import { useState, useEffect } from "react";
import type { Appointment } from "../types";
import { fetchAppointments } from "../api";
import { Calendar, Clock, Search, User } from "lucide-react";

export default function Appointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAppointments()
            .then((data) => {
                const approved = data.filter((a) => a.status === "Approved");
                setAppointments(approved);
                setFilteredAppointments(approved);
            })
            .catch(() => console.log("Error fetching appointments"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const filtered = appointments.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredAppointments(filtered);
        setCurrentPage(1);
    }, [search, appointments]);

    const paginatedAppointments = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-[#0f172a]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#d4af37]">
                        Confirmed Appointments
                    </h1>
                    <p className="text-[#94a3b8] mt-1 text-sm">
                        Showing all approved and confirmed schedules
                    </p>
                </div>

                {/* Search */}
                <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-4 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#334155] rounded-lg bg-[#0f172a] text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-[#94a3b8]" />
                    </div>
                </div>

                {/* Appointments List */}
                <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0f172a] border-b border-[#334155]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#334155]">
                                {paginatedAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#94a3b8]">
                                            {search
                                                ? "No confirmed appointments match your search."
                                                : "No confirmed appointments yet. Check back after the admin approves your booking."}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedAppointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-[#0f172a] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#d4af37]/20 rounded-full">
                                                        <User className="w-4 h-4 text-[#d4af37]" />
                                                    </div>
                                                    <span className="font-medium text-[#f8fafc]">{apt.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#94a3b8]">
                                                {apt.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-[#94a3b8]">
                                                    <Calendar className="w-4 h-4" />
                                                    {apt.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-[#94a3b8]">
                                                    <Clock className="w-4 h-4" />
                                                    {apt.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 rounded-full text-sm bg-green-900/30 text-green-300 border border-green-700">
                                                    Confirmed
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-[#334155]">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-[#334155] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0f172a] text-[#f8fafc] transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-[#94a3b8]">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-[#334155] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0f172a] text-[#f8fafc] transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}