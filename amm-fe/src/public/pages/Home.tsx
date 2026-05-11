import { useState, useEffect } from "react";
import type { AppointmentStats } from "../types";
import { fetchAppointmentStats } from "../api";
import StatsCard from "../components/StatsCard";
import PublicCalendar from "../components/PublicCalendar";
import UpcomingAppointments from "../components/UpcomingAppointments";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

interface HomeProps {
    onNavigate?: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
    const [stats, setStats] = useState<AppointmentStats>({
        total: 0,
        pending: 0,
        approved: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointmentStats()
            .then(setStats)
            .catch(() => console.log("Error fetching stats"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Welcome to Our Appointment System
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Schedule and manage your appointments with ease
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => onNavigate?.("appointments")}
                                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                            >
                                View Appointments
                            </button>
                            <button
                                onClick={() => onNavigate?.("calendar")}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
                            >
                                View Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Appointment Statistics
                    </h2>
                    {loading ? (
                        <div className="flex justify-center h-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Appointments"
                                value={stats.total}
                                icon={Calendar}
                                color="bg-blue-100 text-blue-600"
                            />
                            <StatsCard
                                title="Pending"
                                value={stats.pending}
                                icon={Clock}
                                color="bg-yellow-100 text-yellow-600"
                            />
                            <StatsCard
                                title="Approved"
                                value={stats.approved}
                                icon={CheckCircle}
                                color="bg-green-100 text-green-600"
                            />
                            <StatsCard
                                title="Cancelled"
                                value={stats.cancelled}
                                icon={XCircle}
                                color="bg-red-100 text-red-600"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Calendar & Upcoming Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Calendar Overview
                            </h2>
                            <PublicCalendar />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Upcoming Appointments
                            </h2>
                            <UpcomingAppointments />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}