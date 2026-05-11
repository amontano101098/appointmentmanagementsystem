import PublicCalendar from "../components/PublicCalendar";

export default function Calendar() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Calendar
                </h1>
                <PublicCalendar />
            </div>
        </div>
    );
}