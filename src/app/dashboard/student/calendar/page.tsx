'use client';

import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    addDays,
    isToday
} from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Clock,
    Calendar as CalendarIcon,
    Trophy,
    BookOpen,
    PartyPopper,
    Info,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademicEvent {
    date: Date;
    title: string;
    type: 'Holiday' | 'Exam' | 'Event' | 'Academic';
    description?: string;
    time: string;
}

const ACADEMIC_EVENTS: AcademicEvent[] = [
    // Holidays
    { date: new Date(2025, 0, 1), title: 'New Year\'s Day', type: 'Holiday', time: 'All Day', description: 'National Holiday' },
    { date: new Date(2025, 0, 14), title: 'Makar Sankranti', type: 'Holiday', time: 'All Day', description: 'Harvest Festival' },
    { date: new Date(2025, 0, 26), title: 'Republic Day', type: 'Holiday', time: 'All Day', description: 'National Holiday' },
    { date: new Date(2025, 2, 14), title: 'Holi', type: 'Holiday', time: 'All Day' },
    { date: new Date(2025, 4, 1), title: 'Labour Day', type: 'Holiday', time: 'All Day' },
    { date: new Date(2025, 7, 15), title: 'Independence Day', type: 'Holiday', time: 'All Day' },
    { date: new Date(2025, 9, 2), title: 'Gandhi Jayanti', type: 'Holiday', time: 'All Day' },
    { date: new Date(2025, 9, 20), title: 'Diwali Break', type: 'Holiday', time: 'All Day', description: 'Autumn Vacations' },
    { date: new Date(2025, 9, 21), title: 'Diwali Break', type: 'Holiday', time: 'All Day' },
    { date: new Date(2025, 11, 25), title: 'Christmas', type: 'Holiday', time: 'All Day' },

    // Exams
    { date: new Date(2025, 1, 15), title: 'FA-1 Exams', type: 'Exam', time: '09:00 AM - 12:00 PM', description: 'Unit Test Series 1' },
    { date: new Date(2025, 4, 10), title: 'SA-1 Exams', type: 'Exam', time: '08:30 AM - 11:30 AM', description: 'Half Yearly Examinations' },
    { date: new Date(2025, 7, 20), title: 'FA-2 Exams', type: 'Exam', time: '09:00 AM - 12:00 PM' },
    { date: new Date(2025, 10, 5), title: 'SA-2 Exams', type: 'Exam', time: '08:30 AM - 11:30 AM', description: 'Final Examinations' },

    // Fixed Events
    { date: new Date(2025, 0, 15), title: 'Annual Sports Day', type: 'Event', time: '08:00 AM - 04:00 PM', description: 'School Athletic Meet' },
    { date: new Date(2025, 1, 28), title: 'Science Fair', type: 'Event', time: '10:00 AM - 03:00 PM', description: 'Project Exhibition' },
    { date: new Date(2025, 7, 5), title: 'Founder\'s Day', type: 'Event', time: '09:00 AM - 01:00 PM' },
    { date: new Date(2025, 8, 5), title: 'Teacher\'s Day', type: 'Event', time: '09:00 AM - 12:00 PM', description: 'Special Assembly' },
    { date: new Date(2025, 10, 14), title: 'Children\'s Day', type: 'Event', time: '09:00 AM - 02:00 PM', description: 'Fun Fair' },
    { date: new Date(2025, 11, 20), title: 'Annual Day', type: 'Event', time: '05:00 PM - 09:00 PM', description: 'Cultural Performances' },
];

export default function StudentCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // Set to Jan 2025 for better demo

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = [];
    let day = startDate;

    while (day <= endDate) {
        calendarDays.push(day);
        day = addDays(day, 1);
    }

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getEventsForDay = (date: Date) => {
        return ACADEMIC_EVENTS.filter(e => isSameDay(e.date, date));
    };

    const upcomingEvents = ACADEMIC_EVENTS
        .filter(e => e.date >= new Date(2025, 0, 1)) // Future events relative to school year
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 10);

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                        Academic Calendar
                    </h1>
                    <p className="text-muted-foreground mt-2 flex items-center gap-2 font-medium">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        Session 2025-26 | Events, Holidays & Exams
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-background border px-4 py-2 rounded-2xl shadow-sm">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-black min-w-[160px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Calendar View */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-card rounded-3xl border shadow-xl overflow-hidden bg-white dark:bg-zinc-950">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 border-b bg-muted/30">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                <div key={d} className="py-4 text-center font-black text-xs uppercase tracking-widest text-muted-foreground">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 border-l border-t relative">
                            {calendarDays.map((date, idx) => {
                                const dayEvents = getEventsForDay(date);
                                const isCurrentMonth = isSameMonth(date, monthStart);

                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "min-h-[140px] border-r border-b p-3 transition-all relative group",
                                            !isCurrentMonth ? "bg-muted/10 opacity-40" : "bg-background",
                                            isToday(date) && "bg-primary/5 ring-1 ring-inset ring-primary/20"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "text-sm font-black w-8 h-8 flex items-center justify-center rounded-xl",
                                                isToday(date) ? "bg-primary text-white shadow-lg" : "text-foreground group-hover:text-primary transition-colors"
                                            )}>
                                                {format(date, 'd')}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <div className="flex gap-1">
                                                    {dayEvents.map((e, i) => (
                                                        <div
                                                            key={i}
                                                            className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                e.type === 'Holiday' ? "bg-red-500" :
                                                                    e.type === 'Exam' ? "bg-orange-500" :
                                                                        "bg-indigo-500"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1 overflow-hidden">
                                            {dayEvents.map((event, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "text-[10px] leading-tight p-1.5 rounded-lg font-bold truncate border shadow-sm",
                                                        event.type === 'Holiday' ? "bg-red-50 border-red-100 text-red-700" :
                                                            event.type === 'Exam' ? "bg-orange-50 border-orange-100 text-orange-700" :
                                                                "bg-indigo-50 border-indigo-100 text-indigo-700"
                                                    )}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-6 p-6 bg-muted/20 border-2 border-dashed rounded-3xl items-center">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Legend:</h4>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-xs font-black uppercase">Public Holidays</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-xs font-black uppercase">Exams / Assessments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500" />
                            <span className="text-xs font-black uppercase">School Events</span>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Upcoming List */}
                <div className="space-y-6">
                    <div className="bg-card rounded-3xl border shadow-xl p-8 sticky top-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-orange-500" />
                                Key Highlights
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {upcomingEvents.map((event, i) => (
                                <div key={i} className="group relative flex gap-5 items-start pl-6 before:absolute before:left-0 before:top-2 before:w-1 before:h-[calc(100%-16px)] before:bg-muted hover:before:bg-primary before:transition-all before:rounded-full">
                                    <div className="flex flex-col items-center bg-muted/50 dark:bg-muted/10 p-2 rounded-2xl min-w-[56px] group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <span className="text-[10px] font-black uppercase opacity-70 leading-none mb-1">
                                            {format(event.date, 'MMM')}
                                        </span>
                                        <span className="text-lg font-black leading-none">
                                            {format(event.date, 'dd')}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {event.time === 'All Day' ? 'Fullday' : event.time}
                                            </span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-md",
                                                event.type === 'Holiday' ? "bg-red-100 text-red-600" :
                                                    event.type === 'Exam' ? "bg-orange-100 text-orange-600" : "bg-indigo-100 text-indigo-600"
                                            )}>
                                                {event.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Action Button */}
                        <button className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                            <BookOpen className="w-4 h-4" />
                            Download Full Almanac
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Important Note */}
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
                        <div className="flex items-center gap-2 mb-2 text-orange-700 dark:text-orange-400">
                            <AlertCircle className="w-5 h-5 font-bold" />
                            <h5 className="font-black text-xs uppercase tracking-widest">Proctor's Note</h5>
                        </div>
                        <p className="text-xs text-orange-800/80 dark:text-orange-200/80 font-medium leading-relaxed italic">
                            Exam dates are subject to change. Please keep checking the official circulars for the latest updates on time-tables.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
