import PublicCalendar from "../components/PublicCalendar";

export default function Calendar() {
    return (
        <div className="min-h-screen bg-[#0f172a] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-[#d4af37] mb-8">
                    Calendar
                </h1>
                <PublicCalendar />
            </div>
        </div>
    );
}