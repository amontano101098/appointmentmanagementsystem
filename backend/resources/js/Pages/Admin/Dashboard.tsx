import AdminLayout from "./AdminLayout";
import { Link } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Admin Dashboard
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Manage bookings and appointments from here.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href="/admin/calendar"
                        className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-6 hover:bg-[#d4af37]/20 transition-colors"
                    >
                        <h3 className="text-lg font-semibold text-[#d4af37] mb-2">
                            Booking Calendar
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            View and manage room bookings on a calendar
                        </p>
                    </Link>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                            Bookings
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                            View and manage all room bookings
                        </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                            Appointments
                        </h3>
                        <p className="text-green-600 dark:text-green-400 text-sm">
                            View and manage appointment requests
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}