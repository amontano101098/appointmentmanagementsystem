import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
    return (
        <div className="bg-[#1e293b] rounded-xl shadow-sm p-6 border border-[#334155] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#94a3b8] mb-1">{title}</p>
                    <p className="text-3xl font-bold text-[#f8fafc]">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}