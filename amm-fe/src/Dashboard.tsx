import { useState, useEffect, useRef } from "react";
import {
    Bell, LogOut, ExternalLink, Check, X, Trash2,
    LayoutDashboard, CalendarDays, BedDouble,
    Building2, Search, ChevronLeft, ChevronRight,
    Sun, Moon, RotateCcw,
} from "lucide-react";

type Tab = "overview" | "bookings" | "calendar";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --gs-ground:  #0d1526;
  --gs-card:    #121e33;
  --gs-border:  #1d2d47;
  --gs-text:    #ddd6c8;
  --gs-muted:   #6b7fa3;
  --gs-accent:  #c9a84c;
  --gs-adim:    rgba(201,168,76,0.10);
  --gs-sidebar: #0b1220;
}

.gs { font-family:'Inter',system-ui,sans-serif; background:var(--gs-ground); color:var(--gs-text); height:100vh; overflow:hidden; display:flex; }

/* ── Sidebar ── */
.gs-side { width:220px; flex-shrink:0; background:var(--gs-sidebar); border-right:1px solid var(--gs-border); display:flex; flex-direction:column; height:100vh; }
.gs-brand { padding:18px 14px; border-bottom:1px solid var(--gs-border); display:flex; align-items:center; gap:10px; }
.gs-brand-icon { width:34px; height:34px; background:var(--gs-accent); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.gs-brand-name { font-family:'Cormorant Garamond',Georgia,serif; font-size:16px; font-weight:600; color:var(--gs-text); line-height:1.2; letter-spacing:.02em; }
.gs-brand-sub  { font-size:10px; color:var(--gs-muted); letter-spacing:.08em; text-transform:uppercase; }

.gs-nav { flex:1; padding:10px 8px; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
.gs-nav::-webkit-scrollbar { width:3px; }
.gs-nav::-webkit-scrollbar-thumb { background:rgba(201,168,76,.15); border-radius:2px; }

.gs-ni { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:8px; font-size:13px; color:var(--gs-muted); cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:all .15s; font-family:'Inter',system-ui,sans-serif; }
.gs-ni:hover { background:rgba(255,255,255,.04); color:var(--gs-text); }
.gs-ni.active { background:var(--gs-adim); color:var(--gs-accent); font-weight:500; }
.gs-ni .chip { margin-left:auto; background:#b91c1c; color:#fff; font-size:10px; padding:1px 6px; border-radius:10px; font-weight:600; }
.gs-ni.danger { color:#f87171; }
.gs-ni.danger:hover { background:rgba(248,113,113,.08); }

.gs-side-foot { padding:10px 8px; border-top:1px solid var(--gs-border); display:flex; flex-direction:column; gap:2px; }

/* ── Main ── */
.gs-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }

.gs-topbar { height:58px; border-bottom:1px solid var(--gs-border); background:var(--gs-sidebar); display:flex; align-items:center; justify-content:space-between; padding:0 24px; flex-shrink:0; }
.gs-topbar-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:20px; font-weight:600; color:var(--gs-text); letter-spacing:.02em; }
.gs-topbar-date  { font-size:11px; color:var(--gs-muted); margin-top:1px; }

.gs-topbar-right { display:flex; align-items:center; gap:8px; }
.gs-bell { position:relative; padding:7px; border-radius:8px; background:rgba(255,255,255,.04); border:1px solid var(--gs-border); cursor:pointer; color:var(--gs-muted); display:flex; align-items:center; transition:all .15s; }
.gs-bell:hover { color:var(--gs-text); border-color:rgba(201,168,76,.3); }
.gs-bell-dot { position:absolute; top:5px; right:5px; width:7px; height:7px; background:var(--gs-accent); border-radius:50%; border:1.5px solid var(--gs-sidebar); }

.gs-user-pill { display:flex; align-items:center; gap:8px; padding:5px 12px 5px 5px; border-radius:8px; background:rgba(255,255,255,.04); border:1px solid var(--gs-border); }
.gs-user-av { width:28px; height:28px; border-radius:50%; background:var(--gs-accent); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#0d1526; flex-shrink:0; }
.gs-user-name { font-size:12px; font-weight:500; color:var(--gs-text); }

/* ── Content ── */
.gs-content { flex:1; overflow-y:auto; padding:24px; }
.gs-content::-webkit-scrollbar { width:4px; }
.gs-content::-webkit-scrollbar-thumb { background:rgba(201,168,76,.15); border-radius:2px; }

/* ── Welcome ── */
.gs-welcome { background:linear-gradient(135deg,rgba(201,168,76,.08) 0%,rgba(201,168,76,.02) 100%); border:1px solid rgba(201,168,76,.14); border-radius:14px; padding:20px 24px; margin-bottom:20px; }
.gs-welcome-h { font-family:'Cormorant Garamond',Georgia,serif; font-size:22px; font-weight:600; color:var(--gs-text); margin-bottom:4px; }
.gs-welcome-p { font-size:13px; color:var(--gs-muted); }

/* ── Stat cards ── */
.gs-stats { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:24px; }
@media(max-width:1100px){ .gs-stats { grid-template-columns:repeat(3,1fr); } }
@media(max-width:700px) { .gs-stats { grid-template-columns:repeat(2,1fr); } }

.gs-card { background:var(--gs-card); border:1px solid var(--gs-border); border-radius:12px; padding:16px; position:relative; overflow:hidden; }
.gs-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.gs-card.c-gold::before   { background:var(--gs-accent); }
.gs-card.c-amber::before  { background:#f59e0b; }
.gs-card.c-green::before  { background:#10b981; }
.gs-card.c-red::before    { background:#f43f5e; }
.gs-card.c-blue::before   { background:#3b82f6; }

.gs-card-label { font-size:11px; color:var(--gs-muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; font-weight:500; }
.gs-card-value { font-family:'Cormorant Garamond',Georgia,serif; font-size:30px; font-weight:600; color:var(--gs-text); line-height:1; }

/* ── Section title ── */
.gs-sh { font-family:'Cormorant Garamond',Georgia,serif; font-size:17px; font-weight:600; color:var(--gs-text); margin-bottom:12px; letter-spacing:.01em; }

/* ── Alert row ── */
.gs-alert { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:10px; background:var(--gs-card); border:1px solid var(--gs-border); margin-bottom:8px; }

/* ── Avatar ── */
.gs-av { width:32px; height:32px; border-radius:50%; background:var(--gs-adim); border:1px solid rgba(201,168,76,.2); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:var(--gs-accent); flex-shrink:0; font-family:'Inter',system-ui,sans-serif; }
.gs-av.sm { width:26px; height:26px; font-size:10px; }

/* ── Table wrap ── */
.gs-tw { background:var(--gs-card); border:1px solid var(--gs-border); border-radius:14px; overflow:hidden; }

.gs-th-row { padding:14px 20px; border-bottom:1px solid var(--gs-border); display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.gs-th-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:17px; font-weight:600; color:var(--gs-text); }
.gs-th-right { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }

.gs-si { position:relative; }
.gs-si input { padding:7px 12px 7px 34px; background:rgba(255,255,255,.04); border:1px solid var(--gs-border); border-radius:8px; color:var(--gs-text); font-size:13px; outline:none; font-family:'Inter',system-ui,sans-serif; transition:border-color .15s; min-width:180px; }
.gs-si input:focus { border-color:var(--gs-accent); }
.gs-si input::placeholder { color:var(--gs-muted); }
.gs-si-ico { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--gs-muted); pointer-events:none; }

.gs-sel { padding:7px 10px; background:rgba(255,255,255,.04); border:1px solid var(--gs-border); border-radius:8px; color:var(--gs-text); font-size:13px; outline:none; cursor:pointer; font-family:'Inter',system-ui,sans-serif; }
.gs-sel option { background:#0d1526; }

table.gs-t { width:100%; border-collapse:collapse; font-size:13px; }
.gs-t thead tr { background:rgba(0,0,0,.15); }
.gs-t th { padding:10px 16px; text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:.07em; color:var(--gs-muted); font-weight:600; border-bottom:1px solid var(--gs-border); white-space:nowrap; }
.gs-t td { padding:13px 16px; border-bottom:1px solid rgba(29,45,71,.5); color:var(--gs-text); vertical-align:middle; }
.gs-t tbody tr:last-child td { border-bottom:none; }
.gs-t tbody tr:hover td { background:rgba(255,255,255,.015); }

.gs-name { font-weight:500; color:var(--gs-text); }
.gs-sub  { font-size:11px; color:var(--gs-muted); margin-top:1px; }

/* ── Badges ── */
.gs-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:11px; font-weight:500; white-space:nowrap; }
.gs-badge.approved { background:rgba(16,185,129,.1); color:#34d399; border:1px solid rgba(16,185,129,.2); }
.gs-badge.pending  { background:rgba(245,158,11,.1); color:#fbbf24; border:1px solid rgba(245,158,11,.2); }
.gs-badge.cancelled{ background:rgba(239,68,68,.1);  color:#f87171; border:1px solid rgba(239,68,68,.2); }
.gs-badge.appt     { background:rgba(16,185,129,.08); color:#6ee7b7; border:1px solid rgba(16,185,129,.15); font-size:10px; }
.gs-badge.bkg      { background:rgba(59,130,246,.08); color:#93c5fd; border:1px solid rgba(59,130,246,.15); font-size:10px; }

/* ── Action buttons ── */
.gs-btn { display:inline-flex; align-items:center; gap:5px; padding:5px 10px; border-radius:6px; font-size:12px; font-weight:500; border:1px solid; cursor:pointer; transition:all .15s; font-family:'Inter',system-ui,sans-serif; white-space:nowrap; }
.gs-btn.ap  { background:rgba(16,185,129,.1);  color:#34d399; border-color:rgba(16,185,129,.2); }
.gs-btn.ap:hover  { background:rgba(16,185,129,.2); }
.gs-btn.cn  { background:rgba(239,68,68,.09);  color:#f87171; border-color:rgba(239,68,68,.2); }
.gs-btn.cn:hover  { background:rgba(239,68,68,.18); }
.gs-btn.rs  { background:rgba(245,158,11,.09); color:#fbbf24; border-color:rgba(245,158,11,.2); }
.gs-btn.rs:hover  { background:rgba(245,158,11,.18); }
.gs-btn.dl  { background:rgba(148,163,184,.06); color:var(--gs-muted); border-color:rgba(148,163,184,.12); }
.gs-btn.dl:hover  { background:rgba(239,68,68,.09); color:#f87171; border-color:rgba(239,68,68,.2); }
.gs-icon-btn { padding:6px; border-radius:6px; border:1px solid var(--gs-border); background:rgba(255,255,255,.03); color:var(--gs-muted); cursor:pointer; display:inline-flex; align-items:center; transition:all .15s; }
.gs-icon-btn:hover { color:var(--gs-text); background:rgba(255,255,255,.07); }

/* ── Pagination ── */
.gs-pg { display:flex; align-items:center; justify-content:space-between; padding:12px 20px; border-top:1px solid var(--gs-border); }
.gs-pg span { font-size:12px; color:var(--gs-muted); }
.gs-pg-side { display:flex; gap:8px; align-items:center; }
.gs-pg-btn { display:inline-flex; align-items:center; gap:4px; padding:6px 12px; border-radius:6px; font-size:12px; color:var(--gs-muted); background:rgba(255,255,255,.04); border:1px solid var(--gs-border); cursor:pointer; font-family:'Inter',system-ui,sans-serif; transition:all .15s; }
.gs-pg-btn:hover:not(:disabled) { color:var(--gs-text); border-color:rgba(201,168,76,.3); }
.gs-pg-btn:disabled { opacity:.4; cursor:not-allowed; }

/* ── Calendar ── */
.gs-cal-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
@media(max-width:1100px){ .gs-cal-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:750px) { .gs-cal-grid { grid-template-columns:repeat(2,1fr); } }

.gs-cal-month { background:var(--gs-card); border:1px solid var(--gs-border); border-radius:12px; padding:14px; }
.gs-cal-mname { text-align:center; font-family:'Cormorant Garamond',Georgia,serif; font-size:13px; font-weight:600; color:var(--gs-text); margin-bottom:10px; letter-spacing:.04em; }
.gs-cal-days  { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; text-align:center; }
.gs-cal-dow   { font-size:9px; color:var(--gs-muted); font-weight:600; letter-spacing:.04em; padding:2px; text-transform:uppercase; }
.gs-cal-day   { padding:4px 2px; font-size:11px; border-radius:5px; cursor:pointer; color:var(--gs-muted); text-align:center; transition:all .12s; }
.gs-cal-day:hover          { background:rgba(255,255,255,.06); color:var(--gs-text); }
.gs-cal-day.ev             { background:var(--gs-accent); color:#0d1526; font-weight:700; }
.gs-cal-day.td-mark        { border:2px solid var(--gs-accent); color:var(--gs-accent); font-weight:600; }
.gs-cal-day.ev.td-mark     { border:2px solid rgba(0,0,0,0.35); color:#0d1526; }

/* ── Calendar header ── */
.gs-cal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.gs-cal-legend { display:flex; gap:12px; font-size:11px; color:var(--gs-muted); }
.gs-cal-legend span { display:flex; align-items:center; gap:5px; }
.gs-cal-legend .dot { width:10px; height:10px; border-radius:3px; display:inline-block; }

/* ── Empty ── */
.gs-empty { padding:48px 20px; text-align:center; color:var(--gs-muted); font-size:13px; }

/* ── Toast ── */
.gs-toast { background:var(--gs-card); border:1px solid rgba(201,168,76,.2); border-left:3px solid var(--gs-accent); border-radius:10px; padding:14px; display:flex; align-items:flex-start; gap:10px; box-shadow:0 8px 32px rgba(0,0,0,.4); animation:slideIn .3s ease-out; }

/* ── Modal ── */
.gs-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); display:flex; align-items:center; justify-content:center; z-index:50; backdrop-filter:blur(2px); }
.gs-modal   { background:var(--gs-card); border:1px solid var(--gs-border); border-radius:16px; padding:24px; width:100%; max-width:420px; max-height:80vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,.5); }
.gs-modal-h { font-family:'Cormorant Garamond',Georgia,serif; font-size:19px; font-weight:600; color:var(--gs-text); }
.gs-modal-sub { font-size:11px; color:var(--gs-muted); margin-top:2px; }

.gs-slot { padding:12px 14px; border-radius:10px; border:1px solid; margin-bottom:8px; }
.gs-slot.appt { background:rgba(16,185,129,.04); border-color:rgba(16,185,129,.14); }
.gs-slot.bkg  { background:rgba(59,130,246,.04);  border-color:rgba(59,130,246,.14); }

/* ── Notification dropdown ── */
.gs-notif-wrap { position:relative; }
.gs-notif-panel {
  position:absolute; top:calc(100% + 8px); right:0;
  width:320px; background:var(--gs-card);
  border:1px solid var(--gs-border); border-radius:14px;
  box-shadow:0 16px 48px rgba(0,0,0,.5);
  z-index:200; overflow:hidden;
  animation:slideIn .18s ease-out;
}
.gs-notif-head { padding:12px 16px; border-bottom:1px solid var(--gs-border); display:flex; align-items:center; justify-content:space-between; }
.gs-notif-title { font-size:13px; font-weight:600; color:var(--gs-text); }
.gs-notif-clear { font-size:11px; color:var(--gs-accent); background:none; border:none; cursor:pointer; font-family:'Inter',system-ui,sans-serif; }
.gs-notif-list  { max-height:320px; overflow-y:auto; }
.gs-notif-list::-webkit-scrollbar { width:3px; }
.gs-notif-list::-webkit-scrollbar-thumb { background:rgba(201,168,76,.15); border-radius:2px; }
.gs-notif-item { display:flex; align-items:flex-start; gap:10px; padding:12px 16px; cursor:pointer; border-bottom:1px solid rgba(29,45,71,.4); transition:background .12s; }
.gs-notif-item:last-child { border-bottom:none; }
.gs-notif-item:hover { background:rgba(255,255,255,.03); }
.gs-notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; }
.gs-notif-dot.bkg  { background:#fbbf24; }
.gs-notif-dot.appt { background:#34d399; }
.gs-notif-item-name { font-size:13px; font-weight:500; color:var(--gs-text); }
.gs-notif-item-sub  { font-size:11px; color:var(--gs-muted); margin-top:2px; }
.gs-notif-tag { font-size:10px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; margin-top:3px; }
.gs-notif-tag.bkg  { color:#fbbf24; }
.gs-notif-tag.appt { color:#34d399; }
.gs-notif-empty { padding:28px 16px; text-align:center; font-size:13px; color:var(--gs-muted); }

/* ── Light mode overrides ── */
.gs.light {
  --gs-ground:  #f4f2ee;
  --gs-card:    #ffffff;
  --gs-border:  #e2ddd6;
  --gs-text:    #1c1917;
  --gs-muted:   #78716c;
  --gs-accent:  #b8922e;
  --gs-adim:    rgba(184,146,46,0.10);
  --gs-sidebar: #ffffff;
}
.gs.light .gs-t thead tr         { background:rgba(0,0,0,.03); }
.gs.light .gs-t td               { border-bottom-color:rgba(226,221,214,.6); }
.gs.light .gs-t tbody tr:hover td{ background:rgba(0,0,0,.02); }
.gs.light .gs-si input           { background:rgba(0,0,0,.03); }
.gs.light .gs-sel                { background:rgba(0,0,0,.03); }
.gs.light .gs-sel option         { background:#ffffff; color:#1c1917; }
.gs.light .gs-cal-day:hover      { background:rgba(0,0,0,.05); }
.gs.light .gs-cal-day.ev         { color:#ffffff; }
.gs.light .gs-notif-panel        { box-shadow:0 16px 48px rgba(0,0,0,.12); }
.gs.light .gs-notif-item:hover   { background:rgba(0,0,0,.02); }
.gs.light .gs-ni:hover           { background:rgba(0,0,0,.04); }
.gs.light .gs-ni.active          { background:var(--gs-adim); }
.gs.light .gs-bell               { background:rgba(0,0,0,.04); }
.gs.light .gs-user-pill          { background:rgba(0,0,0,.04); }
.gs.light .gs-icon-btn           { background:rgba(0,0,0,.04); }
.gs.light .gs-pg-btn             { background:rgba(0,0,0,.04); }
.gs.light .gs-overlay            { background:rgba(0,0,0,.4); }
`;

function initials(name: string) {
    return name.trim().split(/\s+/).map(n => n[0] || "").join("").slice(0, 2).toUpperCase() || "?";
}

function badgeClass(status: string) {
    if (status === "Approved")  return "gs-badge approved";
    if (status === "Cancelled") return "gs-badge cancelled";
    return "gs-badge pending";
}

export default function Dashboard() {
    const [user,   setUser]   = useState<{ name?: string } | null>(null);
    const [dark,   setDark]   = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    const [appointments, setAppointments] = useState<{
        id: number; name: string; email: string;
        date: string; time: string; status: string;
    }[]>([]);

    const [bookings, setBookings] = useState<{
        id: number; name: string; email: string;
        check_in: string; check_out: string; room: string; status: string;
    }[]>([]);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal,    setShowModal]    = useState(false);

    const [bookingSearch,       setBookingSearch]       = useState("");
    const [bookingStatusFilter, setBookingStatusFilter] = useState("All");

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [toasts, setToasts] = useState<{ id: number; name: string; room: string; check_in: string }[]>([]);
    const [showNotif, setShowNotif] = useState(false);

    const prevBookingIds = useRef<Set<number>>(new Set());
    const isInitialLoad  = useRef(true);
    const notifRef       = useRef<HTMLDivElement>(null);
    const TOTAL_ROOM_TYPES = 4;

    /* ── Derived ── */
    // Use local date components to avoid UTC-offset "yesterday" bug
    const _now = new Date();
    const todayStr = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, "0")}-${String(_now.getDate()).padStart(2, "0")}`;

    const pendingAppts   = appointments.filter(a => a.status === "Pending");
    const pendingBkgs    = bookings.filter(b => b.status === "Pending");
    const pendingCount   = pendingAppts.length + pendingBkgs.length;

    const filteredBookings = bookings.filter(b => {
        const ms = b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                   b.email.toLowerCase().includes(bookingSearch.toLowerCase());
        const mst = bookingStatusFilter === "All" || b.status === bookingStatusFilter;
        return ms && mst;
    });

    const appointmentsForDate = appointments.filter(
        a => a.date === selectedDate && a.status === "Approved"
    );
    const bookingsForDate = bookings.filter(
        b => b.status === "Approved" && selectedDate !== null &&
             b.check_in <= selectedDate && b.check_out >= selectedDate
    );

    const bookedToday = new Set(
        bookings.filter(b => b.status === "Approved" && b.check_in <= todayStr && b.check_out >= todayStr)
                .map(b => b.room)
    );
    const availableRooms = TOTAL_ROOM_TYPES - bookedToday.size;

    /* ── Helpers ── */
    const greeting = () => {
        const h = new Date().getHours();
        return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    };
    const getDaysInMonth   = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const dismissToast = (id: number) => setToasts(p => p.filter(t => t.id !== id));

    /* ── Data ── */
    const fetchAppointments = async () => {
        try {
            const data = await (await fetch("/api/appointments")).json();
            setAppointments(data);
        } catch {}
    };

    const fetchBookings = async () => {
        try {
            const data: typeof bookings = await (await fetch("/api/bookings")).json();
            if (isInitialLoad.current) {
                data.forEach(b => prevBookingIds.current.add(b.id));
                isInitialLoad.current = false;
            } else {
                data.filter(b => !prevBookingIds.current.has(b.id)).forEach(b => {
                    prevBookingIds.current.add(b.id);
                    const t = { id: b.id, name: b.name, room: b.room, check_in: b.check_in };
                    setToasts(p => [...p, t]);
                    setTimeout(() => dismissToast(b.id), 6000);
                });
            }
            setBookings(data);
        } catch {}
    };

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotif(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        const theme = localStorage.getItem("theme");
        if (theme === "dark") { setDark(true); document.documentElement.classList.add("dark"); }

        fetchAppointments();
        fetchBookings();

        const iv = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchAppointments();
                fetchBookings();
            }
        }, 5000);
        return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Actions ── */
    const updateStatus = async (id: number, status: string) => {
        setAppointments(p => p.map(a => a.id === id ? { ...a, status } : a));
        try {
            await fetch(`/api/appointments/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        } finally { fetchAppointments(); }
    };
    const deleteAppointment = async (id: number) => {
        setAppointments(p => p.filter(a => a.id !== id));
        try { await fetch(`/api/appointments/${id}`, { method: "DELETE" }); } finally { fetchAppointments(); }
    };
    const updateBookingStatus = async (id: number, status: string) => {
        setBookings(p => p.map(b => b.id === id ? { ...b, status } : b));
        try {
            await fetch(`/api/bookings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        } finally { fetchBookings(); }
    };
    const deleteBooking = async (id: number) => {
        setBookings(p => p.filter(b => b.id !== id));
        try { await fetch(`/api/bookings/${id}`, { method: "DELETE" }); } finally { fetchBookings(); }
    };

    const toggleTheme = () => {
        const n = !dark; setDark(n);
        if (n) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
        else   { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }
    };
    const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.reload(); };
    const openWebsite  = () => window.open("/#public", "_blank");

    /* ── Nav config ── */
    const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "overview", label: "Overview",      icon: LayoutDashboard },
        { id: "bookings", label: "Room Bookings", icon: BedDouble },
        { id: "calendar", label: "Calendar",      icon: CalendarDays },
    ];

    const tabLabel = TABS.find(t => t.id === activeTab)?.label ?? "";
    const formattedDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <>
            <style>{STYLES}</style>

            <div className={`gs${dark ? "" : " light"}`}>
                {/* ─── SIDEBAR ─── */}
                <aside className="gs-side">
                    <div className="gs-brand">
                        <div className="gs-brand-icon">
                            <Building2 size={16} color="#0d1526" />
                        </div>
                        <div>
                            <div className="gs-brand-name">GoldenStay</div>
                            <div className="gs-brand-sub">Admin Panel</div>
                        </div>
                    </div>

                    <nav className="gs-nav">
                        {TABS.map(({ id, label, icon: Icon }) => {
                            const count = id === "bookings" ? pendingBkgs.length : 0;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`gs-ni${activeTab === id ? " active" : ""}`}
                                >
                                    <Icon size={15} />
                                    {label}
                                    {count > 0 && <span className="chip">{count}</span>}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="gs-side-foot">
                        <button className="gs-ni" onClick={openWebsite}>
                            <ExternalLink size={15} /> View Website
                        </button>
                        <button className="gs-ni" onClick={toggleTheme}>
                            {dark ? <Sun size={15} /> : <Moon size={15} />}
                            {dark ? "Light Mode" : "Dark Mode"}
                        </button>
                        <button className="gs-ni danger" onClick={handleLogout}>
                            <LogOut size={15} /> Sign Out
                        </button>
                    </div>
                </aside>

                {/* ─── MAIN ─── */}
                <div className="gs-main">
                    {/* Top bar */}
                    <div className="gs-topbar">
                        <div>
                            <div className="gs-topbar-title">{tabLabel}</div>
                            <div className="gs-topbar-date">{formattedDate}</div>
                        </div>
                        <div className="gs-topbar-right">
                            {/* Notification bell + dropdown */}
                            <div className="gs-notif-wrap" ref={notifRef}>
                                <button
                                    className="gs-bell"
                                    onClick={() => setShowNotif(v => !v)}
                                >
                                    <Bell size={16} />
                                    {pendingCount > 0 && <span className="gs-bell-dot" />}
                                </button>

                                {showNotif && (
                                    <div className="gs-notif-panel">
                                        <div className="gs-notif-head">
                                            <span className="gs-notif-title">
                                                Notifications
                                                {pendingCount > 0 && (
                                                    <span style={{ marginLeft: "6px", background: "#b91c1c", color: "#fff", fontSize: "10px", padding: "1px 6px", borderRadius: "10px", fontWeight: 600 }}>
                                                        {pendingCount}
                                                    </span>
                                                )}
                                            </span>
                                            <button
                                                className="gs-notif-clear"
                                                onClick={() => setShowNotif(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                        <div className="gs-notif-list">
                                            {pendingCount === 0 && (
                                                <div className="gs-notif-empty">No pending notifications</div>
                                            )}
                                            {pendingAppts.map(a => (
                                                <div
                                                    key={`na-${a.id}`}
                                                    className="gs-notif-item"
                                                    onClick={() => { setActiveTab("overview"); setShowNotif(false); }}
                                                >
                                                    <span className="gs-notif-dot appt" />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="gs-notif-item-name">{a.name}</div>
                                                        <div className="gs-notif-item-sub">{a.date} at {a.time}</div>
                                                        <div className="gs-notif-tag appt">Appointment · Pending</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {pendingBkgs.map(b => (
                                                <div
                                                    key={`nb-${b.id}`}
                                                    className="gs-notif-item"
                                                    onClick={() => { setActiveTab("bookings"); setShowNotif(false); }}
                                                >
                                                    <span className="gs-notif-dot bkg" />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="gs-notif-item-name">{b.name}</div>
                                                        <div className="gs-notif-item-sub">{b.room} · {b.check_in} → {b.check_out}</div>
                                                        <div className="gs-notif-tag bkg">Room Booking · Pending</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="gs-user-pill">
                                <div className="gs-user-av">
                                    {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                                </div>
                                <span className="gs-user-name">{user?.name ?? "Admin"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="gs-content">

                        {/* ═══ OVERVIEW ═══ */}
                        {activeTab === "overview" && (
                            <div>
                                <div className="gs-welcome">
                                    <div className="gs-welcome-h">{greeting()}, {user?.name ?? "Admin"}</div>
                                    <div className="gs-welcome-p">
                                        {pendingCount > 0
                                            ? `${pendingCount} item${pendingCount !== 1 ? "s" : ""} awaiting your action today.`
                                            : "Everything is up to date. No pending actions."}
                                    </div>
                                </div>

                                <div className="gs-stats">
                                    {[
                                        { label: "Total Records",    value: appointments.length + bookings.length,   cls: "c-gold"  },
                                        { label: "Pending Action",   value: pendingCount,                            cls: "c-amber" },
                                        { label: "Approved",         value: appointments.filter(a => a.status === "Approved").length + bookings.filter(b => b.status === "Approved").length, cls: "c-green" },
                                        { label: "Cancelled",        value: appointments.filter(a => a.status === "Cancelled").length + bookings.filter(b => b.status === "Cancelled").length, cls: "c-red" },
                                        { label: "Rooms Available",  value: availableRooms,                          cls: "c-blue"  },
                                    ].map(({ label, value, cls }) => (
                                        <div key={label} className={`gs-card ${cls}`}>
                                            <div className="gs-card-label">{label}</div>
                                            <div className="gs-card-value">{value}</div>
                                        </div>
                                    ))}
                                </div>

                                {pendingCount > 0 && (
                                    <div style={{ marginBottom: "24px" }}>
                                        <div className="gs-sh">Needs Your Attention</div>
                                        {pendingAppts.slice(0, 3).map(a => (
                                            <div key={a.id} className="gs-alert">
                                                <div className="gs-av">{initials(a.name)}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="gs-name">{a.name}</div>
                                                    <div className="gs-sub">Appointment · {a.date} at {a.time}</div>
                                                </div>
                                                <button className="gs-btn ap" onClick={() => updateStatus(a.id, "Approved")}><Check size={11} /> Approve</button>
                                                <button className="gs-btn cn" onClick={() => updateStatus(a.id, "Cancelled")}><X size={11} /> Decline</button>
                                            </div>
                                        ))}
                                        {pendingBkgs.slice(0, 3).map(b => (
                                            <div key={b.id} className="gs-alert">
                                                <div className="gs-av">{initials(b.name)}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="gs-name">{b.name}</div>
                                                    <div className="gs-sub">{b.room} · {b.check_in} → {b.check_out}</div>
                                                </div>
                                                <button className="gs-btn ap" onClick={() => updateBookingStatus(b.id, "Approved")}><Check size={11} /> Approve</button>
                                                <button className="gs-btn cn" onClick={() => updateBookingStatus(b.id, "Cancelled")}><X size={11} /> Decline</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {bookings.length > 0 && (
                                    <div>
                                        <div className="gs-sh">Recent Room Bookings</div>
                                        <div className="gs-tw">
                                            <table className="gs-t">
                                                <thead><tr>
                                                    <th>Guest</th><th>Room</th>
                                                    <th>Check-in</th><th>Check-out</th><th>Status</th>
                                                </tr></thead>
                                                <tbody>
                                                    {bookings.slice(0, 5).map(b => (
                                                        <tr key={b.id}>
                                                            <td>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                    <div className="gs-av">{initials(b.name)}</div>
                                                                    <div>
                                                                        <div className="gs-name">{b.name}</div>
                                                                        <div className="gs-sub">{b.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{ color: "var(--gs-muted)" }}>{b.room}</td>
                                                            <td style={{ color: "var(--gs-muted)" }}>{b.check_in}</td>
                                                            <td style={{ color: "var(--gs-muted)" }}>{b.check_out}</td>
                                                            <td><span className={badgeClass(b.status)}>{b.status}</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {appointments.length === 0 && bookings.length === 0 && (
                                    <div className="gs-empty" style={{ background: "var(--gs-card)", borderRadius: "14px", border: "1px solid var(--gs-border)" }}>
                                        No records yet. Bookings from the website will appear here.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ BOOKINGS ═══ */}
                        {activeTab === "bookings" && (
                            <div className="gs-tw">
                                <div className="gs-th-row">
                                    <div className="gs-th-title">Room Bookings</div>
                                    <div className="gs-th-right">
                                        <div className="gs-si">
                                            <Search size={13} className="gs-si-ico" />
                                            <input
                                                placeholder="Search guest…"
                                                value={bookingSearch}
                                                onChange={e => setBookingSearch(e.target.value)}
                                            />
                                        </div>
                                        <select className="gs-sel" value={bookingStatusFilter}
                                            onChange={e => setBookingStatusFilter(e.target.value)}>
                                            <option value="All">All statuses</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        {(bookingSearch || bookingStatusFilter !== "All") && (
                                            <button className="gs-icon-btn" onClick={() => { setBookingSearch(""); setBookingStatusFilter("All"); }}>
                                                <RotateCcw size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div style={{ overflowX: "auto" }}>
                                    <table className="gs-t">
                                        <thead><tr>
                                            <th>Guest</th><th>Room</th>
                                            <th>Check-in</th><th>Check-out</th><th>Status</th><th>Actions</th>
                                        </tr></thead>
                                        <tbody>
                                            {filteredBookings.length === 0
                                                ? <tr><td colSpan={6} className="gs-empty">No bookings found</td></tr>
                                                : filteredBookings.map(b => (
                                                    <tr key={b.id}>
                                                        <td>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                <div className="gs-av">{initials(b.name)}</div>
                                                                <div>
                                                                    <div className="gs-name">{b.name}</div>
                                                                    <div className="gs-sub">{b.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ color: "var(--gs-muted)" }}>{b.room}</td>
                                                        <td style={{ color: "var(--gs-muted)" }}>{b.check_in}</td>
                                                        <td style={{ color: "var(--gs-muted)" }}>{b.check_out}</td>
                                                        <td><span className={badgeClass(b.status)}>{b.status}</span></td>
                                                        <td>
                                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                                {b.status === "Pending" && (
                                                                    <>
                                                                        <button className="gs-btn ap" onClick={() => updateBookingStatus(b.id, "Approved")}><Check size={11} /> Approve</button>
                                                                        <button className="gs-btn cn" onClick={() => updateBookingStatus(b.id, "Cancelled")}><X size={11} /> Decline</button>
                                                                    </>
                                                                )}
                                                                {b.status !== "Pending" && (
                                                                    <button className="gs-btn rs" onClick={() => updateBookingStatus(b.id, "Pending")}><RotateCcw size={11} /> Reset</button>
                                                                )}
                                                                <button className="gs-btn dl" onClick={() => deleteBooking(b.id)}><Trash2 size={11} /> Delete</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ═══ CALENDAR ═══ */}
                        {activeTab === "calendar" && (
                            <div>
                                <div className="gs-cal-head">
                                    <div className="gs-sh" style={{ marginBottom: 0 }}>{currentYear}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div className="gs-cal-legend">
                                            <span><span className="dot" style={{ background: "var(--gs-accent)" }} /> Booked</span>
                                            <span><span className="dot" style={{ border: "1px solid var(--gs-accent)" }} /> Today</span>
                                        </div>
                                        <button className="gs-pg-btn" onClick={() => setCurrentYear(y => y - 1)}>
                                            <ChevronLeft size={13} /> {currentYear - 1}
                                        </button>
                                        <button className="gs-pg-btn" onClick={() => setCurrentYear(y => y + 1)}>
                                            {currentYear + 1} <ChevronRight size={13} />
                                        </button>
                                    </div>
                                </div>

                                <div className="gs-cal-grid">
                                    {MONTHS.map((monthName, mi) => {
                                        const days: React.ReactNode[] = [];
                                        const total = getDaysInMonth(currentYear, mi);
                                        const first = getFirstDayOfMonth(currentYear, mi);
                                        for (let i = 0; i < first; i++) days.push(<div key={`e${i}`} />);
                                        for (let d = 1; d <= total; d++) {
                                            const ds = `${currentYear}-${String(mi + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                                            const hasAppt = appointments.some(a => a.date === ds && a.status === "Approved");
                                            const hasBkg  = bookings.some(b => b.status === "Approved" && b.check_in <= ds && b.check_out >= ds);
                                            const hasEv   = hasAppt || hasBkg;
                                            const isToday = ds === todayStr;
                                            const dayCls = ["gs-cal-day", hasEv ? "ev" : "", isToday ? "td-mark" : ""].filter(Boolean).join(" ");
                                    days.push(
                                        <div
                                            key={d}
                                            onClick={() => { setSelectedDate(ds); setShowModal(true); }}
                                            className={dayCls}
                                        >
                                            {d}
                                        </div>
                                    );
                                        }
                                        return (
                                            <div key={mi} className="gs-cal-month">
                                                <div className="gs-cal-mname">{monthName}</div>
                                                <div className="gs-cal-days">
                                                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d, i) => (
                                                        <div key={i} className="gs-cal-dow">{d}</div>
                                                    ))}
                                                    {days}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── TOASTS ─── */}
            <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 100, display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
                {toasts.map(t => (
                    <div key={t.id} className="gs-toast">
                        <span style={{ fontSize: "18px" }}>🛎️</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--gs-text)", marginBottom: "2px" }}>New Booking</div>
                            <div style={{ fontSize: "12px", color: "var(--gs-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name} · {t.room}</div>
                            <div style={{ fontSize: "11px", color: "var(--gs-accent)", marginTop: "2px" }}>Check-in: {t.check_in}</div>
                        </div>
                        <button onClick={() => dismissToast(t.id)} style={{ color: "var(--gs-muted)", background: "none", border: "none", cursor: "pointer", padding: "2px", flexShrink: 0 }}>
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* ─── MODAL ─── */}
            {showModal && (
                <div className="gs-overlay" onClick={() => setShowModal(false)}>
                    <div className="gs-modal" onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                            <div>
                                <div className="gs-modal-h">
                                    {selectedDate
                                        ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                                        : ""}
                                </div>
                                <div className="gs-modal-sub">
                                    {appointmentsForDate.length + bookingsForDate.length} approved schedule{appointmentsForDate.length + bookingsForDate.length !== 1 ? "s" : ""} on this date
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ color: "var(--gs-muted)", background: "none", border: "none", cursor: "pointer", padding: "4px", marginTop: "-2px" }}>
                                <X size={18} />
                            </button>
                        </div>

                        {appointmentsForDate.length === 0 && bookingsForDate.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--gs-muted)", fontSize: "13px" }}>
                                No approved bookings on this date.
                            </div>
                        ) : (
                            <div>
                                {appointmentsForDate.map(a => (
                                    <div key={`apt-${a.id}`} className="gs-slot appt">
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                            <div className="gs-av sm">{initials(a.name)}</div>
                                            <span className="gs-name" style={{ fontSize: "13px" }}>{a.name}</span>
                                            <span className="gs-badge appt" style={{ marginLeft: "auto" }}>Appointment</span>
                                        </div>
                                        <div className="gs-sub">{a.email}</div>
                                        <div className="gs-sub" style={{ marginTop: "2px" }}>🕐 {a.time}</div>
                                    </div>
                                ))}
                                {bookingsForDate.map(b => (
                                    <div key={`bkg-${b.id}`} className="gs-slot bkg">
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                            <div className="gs-av sm">{initials(b.name)}</div>
                                            <span className="gs-name" style={{ fontSize: "13px" }}>{b.name}</span>
                                            <span className="gs-badge bkg" style={{ marginLeft: "auto" }}>Room Booking</span>
                                        </div>
                                        <div className="gs-sub">{b.email}</div>
                                        <div className="gs-sub" style={{ marginTop: "2px" }}>🏨 {b.room} · {b.check_in} → {b.check_out}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
