import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Link } from "@inertiajs/react";

interface Booking {
    id: number;
    name: string;
    email: string;
    check_in: string;
    check_out: string;
    room: string;
    status: string;
}

export default function Calendar() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/bookings")
            .then((res) => res.json())
            .then((data) => {
                setBookings(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleStatusChange = async (id: number, status: string) => {
        await fetch(`/api/bookings/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/bookings/${id}`, { method: "DELETE" });
        setBookings((prev) => prev.filter((b) => b.id !== id));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Booking Calendar
                    </h2>
                    <Link
                        href="/admin/dashboard"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        No bookings found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Check-in
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Check-out
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {bookings.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                            {b.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {b.email}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {b.room}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {b.check_in}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {b.check_out}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            {b.status === "Pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                b.id,
                                                                "Approved"
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                b.id,
                                                                "Cancelled"
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {b.status !== "Pending" && (
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            b.id,
                                                            "Pending"
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDelete(b.id)
                                                }
                                                className="px-3 py-1 bg-red-900/50 text-red-300 rounded text-xs hover:bg-red-900 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}