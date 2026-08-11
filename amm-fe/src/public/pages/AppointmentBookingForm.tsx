import { useState, useEffect } from "react";
import { createBooking } from "../api";

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Executive"];

type BookingRecord = { room: string; check_in: string; check_out: string; status: string };

export default function AppointmentBookingForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        check_in: "",
        check_out: "",
        room: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [approvedBookings, setApprovedBookings] = useState<BookingRecord[]>([]);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        fetch("/api/bookings")
            .then(res => res.json())
            .then((data: BookingRecord[]) =>
                setApprovedBookings(data.filter(b => b.status === "Approved"))
            )
            .catch(() => {});
    }, []);

    const isRoomUnavailable = (room: string) => {
        if (!formData.check_in || !formData.check_out) return false;
        return approvedBookings.some(
            b => b.room === room &&
                b.check_in <= formData.check_out &&
                b.check_out >= formData.check_in
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (formData.check_in < today) {
            setError("Check-in date cannot be in the past.");
            return;
        }

        if (isRoomUnavailable(formData.room)) {
            setError("This room is already booked for the selected dates. Please choose different dates or another room.");
            return;
        }

        setLoading(true);
        try {
            await createBooking(formData);
            setSuccess(true);
            setFormData({ name: "", email: "", check_in: "", check_out: "", room: "" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const availableCount = ROOM_TYPES.filter(r => !isRoomUnavailable(r)).length;

    return (
        <div className="min-h-screen bg-[#0f172a] py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#1e293b] rounded-xl shadow-md p-8 border border-[#334155]">
                    <h2 className="text-3xl font-bold text-[#d4af37] mb-2">Book Now</h2>
                    <p className="text-[#94a3b8] mb-2">Fill in your details to reserve a room.</p>

                    {/* Room availability indicator */}
                    {formData.check_in && formData.check_out && (
                        <div className={`mb-6 px-4 py-2 rounded-lg text-sm font-medium border ${
                            availableCount === 0
                                ? "bg-red-900/30 border-red-700 text-red-300"
                                : "bg-green-900/30 border-green-700 text-green-300"
                        }`}>
                            {availableCount === 0
                                ? "No rooms available for these dates."
                                : `${availableCount} of ${ROOM_TYPES.length} room types available for your selected dates.`}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg">
                            Booking submitted successfully! We will contact you shortly.
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#f8fafc] mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#1e293b] text-[#f8fafc] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#f8fafc] mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#1e293b] text-[#f8fafc] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="check_in" className="block text-sm font-medium text-[#f8fafc] mb-1">
                                    Check-in Date
                                </label>
                                <input
                                    type="date"
                                    id="check_in"
                                    name="check_in"
                                    value={formData.check_in}
                                    onChange={handleChange}
                                    required
                                    min={today}
                                    className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#1e293b] text-[#f8fafc] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="check_out" className="block text-sm font-medium text-[#f8fafc] mb-1">
                                    Check-out Date
                                </label>
                                <input
                                    type="date"
                                    id="check_out"
                                    name="check_out"
                                    value={formData.check_out}
                                    onChange={handleChange}
                                    required
                                    min={formData.check_in || today}
                                    className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#1e293b] text-[#f8fafc] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="room" className="block text-sm font-medium text-[#f8fafc] mb-1">
                                Room Type
                            </label>
                            <select
                                id="room"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-[#334155] rounded-lg bg-[#1e293b] text-[#f8fafc] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none transition-all"
                            >
                                <option value="">Select a room type</option>
                                {ROOM_TYPES.map(room => (
                                    <option
                                        key={room}
                                        value={room}
                                        disabled={isRoomUnavailable(room)}
                                    >
                                        {room}{isRoomUnavailable(room) ? " — Not Available" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (formData.check_in !== "" && formData.check_out !== "" && availableCount === 0)}
                            className="w-full py-3 px-4 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#c4a02e] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Submitting..." : "Confirm Booking"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
