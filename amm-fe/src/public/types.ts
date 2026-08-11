export interface Appointment {
    id: number;
    name: string;
    email: string;
    date: string;
    time: string;
    status: string;
}

export interface Booking {
    id: number;
    name: string;
    email: string;
    check_in: string;
    check_out: string;
    room: string;
    status: string;
}

export interface AppointmentStats {
    total: number;
    pending: number;
    approved: number;
    cancelled: number;
}

export interface DayInfo {
    date: string;
    day: number;
    hasAppointments: boolean;
    appointments: Appointment[];
}