import type { Appointment, AppointmentStats, Booking } from "./types";

const API_BASE = "/api";

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

export async function fetchBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
}

export async function createBooking(data: { name: string; email: string; check_in: string; check_out: string; room: string }) {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to create booking");
    }
    return res.json();
}

export async function updateBooking(id: number, data: { status: string }) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update booking");
    return res.json();
}

export async function deleteBooking(id: number) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete booking");
    return res.json();
}