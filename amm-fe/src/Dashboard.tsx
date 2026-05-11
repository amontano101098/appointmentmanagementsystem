import { useState, useEffect } from "react";
import { Bell, LogOut, ExternalLink } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
    const [user, setUser] = useState<{ name?: string } | null>(null);
    const [dark, setDark] = useState(false);
    const [appointments, setAppointments] = useState<
        {
            id: number;
            name: string;
            email: string;
            date: string;
            time: string;
            status: string;
        }[]
    >([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const itemsPerPage = 5;

    const exportToExcel = () => {
        const dataToExport = filteredAppointments.map((a) => ({
            Name: a.name,
            Email: a.email,
            Date: a.date,
            Time: a.time,
            Status: a.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(file, "appointments.xlsx");
    };
    const startIndex = (currentPage - 1) * itemsPerPage;

    const filteredAppointments = appointments.filter((a) => {
        const matchSearch =
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase());

        const matchStatus = statusFilter === "All" || a.status === statusFilter;

        const matchDate = !selectedDate || a.date === selectedDate;

        return matchSearch && matchStatus && matchDate;
    });
    const paginatedAppointments = filteredAppointments.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

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

    const openPublicWebsite = () => {
        window.open("/#public", "_blank");
    };

    const fetchAppointments = async () => {
        try {
            const res = await fetch("http://localhost:9000/api/appointments");
            const data = await res.json();
            setAppointments(data);
        } catch (err) {
            console.log("Fetch error", err);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchAppointments();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    function Card({ title, value }: { title: string; value: number }) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-xl font-bold">{value}</h2>
            </div>
        );
    }

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const appointmentsForDate = appointments.filter(
        (a) => a.date === selectedDate,
    );

    const updateStatus = async (id: number, status: string) => {
        try {
            await fetch(`http://localhost:9000/api/appointments/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            fetchAppointments();
        } catch (err) {
            console.log("Update error", err);
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

                        <button
                            onClick={openPublicWebsite}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            title="View Public Website"
                        >
                            <ExternalLink className="w-4" />
                            <span>View Website</span>
                        </button>
                    </div>
                </div>
                {/* Main */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-4">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            {/* 🔍 Search Input */}
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {/* Icon */}
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    🔍
                                </span>
                            </div>

                            {/* 🎯 Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* ❌ Clear Button */}
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("All");
                                    setSelectedDate(null);
                                }}
                                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                        <h3 className="font-semibold mb-4">Appointments</h3>
                        <button
                            onClick={exportToExcel}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Export Excel
                        </button>
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
                                {paginatedAppointments.map((a) => (
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

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                Prev
                            </button>

                            <span className="text-sm">
                                Page {currentPage} of{" "}
                                {Math.ceil(
                                    filteredAppointments.length / itemsPerPage,
                                )}
                            </span>

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        prev <
                                        Math.ceil(
                                            filteredAppointments.length /
                                                itemsPerPage,
                                        )
                                            ? prev + 1
                                            : prev,
                                    )
                                }
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                Next
                            </button>
                        </div>
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
                    <ul className="space-y-3 text-sm">
                        {appointments.filter((a) => a.status === "Pending")
                            .length > 0 && (
                            <li className="bg-yellow-100 p-3 rounded">
                                ⚠️{" "}
                                {
                                    appointments.filter(
                                        (a) => a.status === "Pending",
                                    ).length
                                }{" "}
                                pending requests
                            </li>
                        )}

                        {appointments.length > 0 && (
                            <li className="bg-green-100 p-3 rounded">
                                🎉 Total {appointments.length} bookings received
                            </li>
                        )}
                    </ul>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card title="Total" value={appointments.length} />
                        <Card
                            title="Pending"
                            value={
                                appointments.filter(
                                    (a) => a.status === "Pending",
                                ).length
                            }
                        />
                        <Card
                            title="Approved"
                            value={
                                appointments.filter(
                                    (a) => a.status === "Approved",
                                ).length
                            }
                        />
                        <Card
                            title="Cancelled"
                            value={
                                appointments.filter(
                                    (a) => a.status === "Cancelled",
                                ).length
                            }
                        />
                    </div>
                    {/* Calendar */}
                    <div className="col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{currentYear} Calendar</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentYear(prev => prev - 1)}
                                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                >
                                    Previous Year
                                </button>
                                <button
                                    onClick={() => setCurrentYear(prev => prev + 1)}
                                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                >
                                    Next Year
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {monthNames.map((monthName, monthIndex) => {
                                const daysInMonth = getDaysInMonth(currentYear, monthIndex);
                                const firstDay = getFirstDayOfMonth(currentYear, monthIndex);
                                const days = [];

                                for (let i = 0; i < firstDay; i++) {
                                    days.push(<div key={`empty-${i}`} className="p-2"></div>);
                                }

                                for (let day = 1; day <= daysInMonth; day++) {
                                    const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                    const hasAppointment = appointments.some((a) => a.date === dateStr);

                                    days.push(
                                        <div
                                            key={day}
                                            onClick={() => {
                                                setSelectedDate(dateStr);
                                                setShowModal(true);
                                            }}
                                            className={`p-2 rounded cursor-pointer text-center
                                                ${hasAppointment ? "bg-green-400 text-white" : "bg-gray-100 dark:bg-gray-700"}
                                                ${selectedDate === dateStr ? "ring-2 ring-blue-500" : ""}
                                            `}
                                        >
                                            {day}
                                        </div>
                                    );
                                }

                                return (
                                    <div key={monthIndex} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                                        <h4 className="font-semibold mb-2 text-center">{monthName}</h4>
                                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                            {["S","M","T","W","T","F","S"].map((d, i) => (
                                                <div key={i} className="font-semibold text-gray-500">{d}</div>
                                            ))}
                                            {days}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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

                        {appointmentsForDate.length === 0 ? (
                            <p>No appointments</p>
                        ) : (
                            appointmentsForDate.map((a) => (
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
