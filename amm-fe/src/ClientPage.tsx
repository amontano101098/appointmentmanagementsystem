import { useState, useEffect } from "react";
import { Bell, LogOut } from "lucide-react";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [dark, setDark] = useState(false);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const filteredAppointments = selectedDate
        ? appointments.filter((a) => a.date === selectedDate)
        : appointments;

    useEffect(() => {
        fetch("http://localhost:9000/api/appointments")
            .then((res) => res.json())
            .then((data) => setAppointments(data))
            .catch(() => console.log("Error fetching appointments"));
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !dark;
        setDark(newTheme);

        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(
                `http://localhost:9000/api/appointments/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                },
            );

            const updated = await res.json();

            setAppointments((prev) =>
                prev.map((a) => (a.id === id ? updated : a)),
            );
        } catch (err) {
            console.log("Error updating status");
        }
    };

    return (
        <>
            {/* MAIN UI */}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-800 shadow-sm">
                    <h1 className="text-xl font-semibold">Dashboard</h1>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                        >
                            {dark ? "Light" : "Dark"}
                        </button>

                        <button className="relative">
                            <Bell className="w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
                                3
                            </span>
                        </button>

                        <button onClick={handleLogout}>
                            <LogOut className="w-5" />
                        </button>
                    </div>
                </div>

                {/* Main */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Table */}
                    <div className="col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                        <h3 className="font-semibold mb-4">Appointments</h3>

                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAppointments.map((a) => (
                                    <tr key={a.id} className="border-b">
                                        <td>{a.name}</td>
                                        <td>{a.date}</td>
                                        <td>{a.status}</td>

                                        <td className="flex gap-2 py-2">
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        a.id,
                                                        "Approved",
                                                    )
                                                }
                                                className="px-2 py-1 bg-green-500 text-white rounded"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        a.id,
                                                        "Cancelled",
                                                    )
                                                }
                                                className="px-2 py-1 bg-red-500 text-white rounded"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Welcome */}
                    <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-2">
                            Welcome {user?.name} 👋
                        </h2>
                        <p className="text-gray-500">
                            Here’s what’s happening today.
                        </p>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Bell size={18} /> Notifications
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                                🔔 New appointment booked
                            </li>
                        </ul>
                    </div>

                    {/* Calendar */}
                    <div className="col-span-3 grid grid-cols-7 gap-2 text-center text-sm">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="font-semibold text-gray-500"
                                >
                                    {day}
                                </div>
                            ),
                        )}

                        {Array.from({ length: 30 }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `2026-04-${String(day).padStart(2, "0")}`;

                            const hasAppointment = appointments.some(
                                (a) => a.date === dateStr,
                            );

                            return (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedDate(dateStr);
                                        setShowModal(true);
                                    }}
                                    className={`p-3 rounded cursor-pointer
                  ${hasAppointment ? "bg-green-400 text-white" : "bg-gray-100 dark:bg-gray-700"}
                  ${selectedDate === dateStr ? "ring-2 ring-blue-500" : ""}
                  `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="font-semibold mb-4">
                            Appointments on {selectedDate}
                        </h2>

                        {filteredAppointments.length === 0 ? (
                            <p>No appointments</p>
                        ) : (
                            filteredAppointments.map((a) => (
                                <div
                                    key={a.id}
                                    className="p-3 bg-gray-100 rounded mb-2"
                                >
                                    <p>{a.name}</p>
                                    <p>{a.time}</p>
                                    <p>{a.status}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
