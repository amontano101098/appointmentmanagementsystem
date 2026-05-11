import type { Appointment, AppointmentStats } from "./types";

const API_BASE = "http://localhost:9000/api";

export async function fetchAppointments(): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/appointments`);
    if (!res.ok) throw new Error("Failed to fetch appointments");
    return res.json();
}

export async function fetchAppointmentStats(): Promise<AppointmentStats> {
    const appointments = await fetchAppointments();
    return {
        total: appointments.length,
        pending: appointments.filter((a) => a.status === "Pending").length,
        approved: appointments.filter((a) => a.status === "Approved").length,
        cancelled: appointments.filter((a) => a.status === "Cancelled").length,
    };
}

export async function fetchAppointmentsByDate(date: string): Promise<Appointment[]> {
    const appointments = await fetchAppointments();
    return appointments.filter((a) => a.date === date);
}

export async function fetchUpcomingAppointments(limit: number = 5): Promise<Appointment[]> {
    const appointments = await fetchAppointments();
    const today = new Date().toISOString().split("T")[0];
    return appointments
        .filter((a) => a.status === "Approved" && a.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
        .slice(0, limit);
}

export async function createAppointment(data: { name: string; email: string; date: string; time: string; message?: string }) {
    const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create appointment");
    return res.json();
}