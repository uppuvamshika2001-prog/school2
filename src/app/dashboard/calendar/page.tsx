'use client';

// Academic Calendar View
// ======================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Clock,
    MapPin,
    Users,
    X,
    GraduationCap,
    PartyPopper,
    FileText,
    Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalendarStore } from '@/stores/calendar.store';
import { CalendarEvent, EventType } from '@/types/calendar.types';
import { toast } from 'sonner';
import { useIsSuperAdmin } from '@/stores/auth.store';

// Event type configuration
const eventTypeConfig: Record<EventType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    holiday: {
        label: 'Holiday',
        color: 'text-red-600',
        bg: 'bg-red-500',
        icon: <PartyPopper className="w-4 h-4" />
    },
    exam: {
        label: 'Examination',
        color: 'text-purple-600',
        bg: 'bg-purple-500',
        icon: <FileText className="w-4 h-4" />
    },
    academic: {
        label: 'Academic',
        color: 'text-blue-600',
        bg: 'bg-blue-500',
        icon: <GraduationCap className="w-4 h-4" />
    },
    event: {
        label: 'Event',
        color: 'text-green-600',
        bg: 'bg-green-500',
        icon: <CalendarIcon className="w-4 h-4" />
    },
    meeting: {
        label: 'Meeting',
        color: 'text-orange-600',
        bg: 'bg-orange-500',
        icon: <Briefcase className="w-4 h-4" />
    },
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatTime(time?: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

export default function CalendarPage() {
    const {
        events,
        summary,
        currentMonth,
        currentYear,
        selectedDate,
        dateEvents,
        isLoading,
        fetchEvents,
        fetchSummary,
        setMonth,
        setSelectedDate
    } = useCalendarStore();

    const isSuperAdmin = useIsSuperAdmin();
    const [typeFilter, setTypeFilter] = useState<EventType | ''>('');

    useEffect(() => {
        fetchEvents();
        fetchSummary();
    }, [fetchEvents, fetchSummary]);

    // Calendar generation
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days: (number | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const getEventsForDay = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => {
            const eventStart = new Date(e.startDate);
            const eventEnd = new Date(e.endDate);
            const currentDate = new Date(dateStr);
            return currentDate >= eventStart && currentDate <= eventEnd;
        }).filter(e => !typeFilter || e.type === typeFilter);
    };

    const handlePrevMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        setMonth(newMonth, newYear);
    };

    const handleNextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        setMonth(newMonth, newYear);
    };

    const handleDateClick = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
    };

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    const calendarDays = generateCalendarDays();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Calendar</h1>
                    <p className="text-muted-foreground mt-1 font-medium">
                        View and manage school events, holidays, and examinations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setMonth(today.getMonth(), today.getFullYear())}>
                        Today
                    </Button>
                    {!isSuperAdmin && (
                        <Button className="gap-2" asChild>
                            <Link href="/dashboard/calendar/create">
                                <Plus className="w-4 h-4" />
                                Add Event
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Total Events</p>
                        <p className="text-2xl font-black mt-1">{summary?.totalEvents || 0}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Upcoming</p>
                        <p className="text-2xl font-black mt-1 text-blue-600">{summary?.upcomingEvents || 0}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Holidays This Month</p>
                        <p className="text-2xl font-black mt-1 text-red-600">{summary?.holidaysThisMonth || 0}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Exams This Month</p>
                        <p className="text-2xl font-black mt-1 text-purple-600">{summary?.examsThisMonth || 0}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/20 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <h2 className="text-xl font-bold">
                                    {MONTHS[currentMonth]} {currentYear}
                                </h2>
                                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as EventType | '')}
                                className="h-9 px-3 text-sm border rounded-lg bg-background font-medium"
                            >
                                <option value="">All Events</option>
                                <option value="holiday">Holidays</option>
                                <option value="exam">Examinations</option>
                                <option value="academic">Academic</option>
                                <option value="event">Events</option>
                                <option value="meeting">Meetings</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map(day => (
                                <div key={day} className="text-center text-xs font-bold uppercase text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const dayEvents = getEventsForDay(day);
                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = selectedDate === dateStr;

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`aspect-square p-1 rounded-lg border-2 transition-all hover:border-primary/50 relative
                                            ${isToday(day) ? 'bg-primary/10 border-primary' : 'border-transparent hover:bg-muted/50'}
                                            ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                    >
                                        <span className={`text-sm font-bold ${isToday(day) ? 'text-primary' : ''}`}>
                                            {day}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 justify-center">
                                                {dayEvents.slice(0, 3).map((event, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1.5 h-1.5 rounded-full ${eventTypeConfig[event.type].bg}`}
                                                    />
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <span className="text-[8px] font-bold text-muted-foreground">+{dayEvents.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                            {Object.entries(eventTypeConfig).map(([type, config]) => (
                                <div key={type} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${config.bg}`} />
                                    <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Events Sidebar */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/20 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    {selectedDate
                                        ? new Date(selectedDate).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })
                                        : 'Upcoming Events'}
                                </CardTitle>
                                <CardDescription>
                                    {selectedDate ? `${dateEvents.length} event(s)` : 'Select a date to view events'}
                                </CardDescription>
                            </div>
                            {selectedDate && (
                                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            </div>
                        ) : (selectedDate ? dateEvents : events.slice(0, 5)).length === 0 ? (
                            <div className="p-8 text-center">
                                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/30" />
                                <p className="mt-4 font-bold">No events</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedDate ? 'No events on this date' : 'No upcoming events'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {(selectedDate ? dateEvents : events.slice(0, 5)).map(event => (
                                    <Link
                                        key={event.id}
                                        href={`/dashboard/calendar/${event.id}`}
                                        className="block p-4 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${eventTypeConfig[event.type].bg}/10 ${eventTypeConfig[event.type].color}`}>
                                                {eventTypeConfig[event.type].icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className={`${eventTypeConfig[event.type].bg} text-white text-[10px]`}>
                                                        {eventTypeConfig[event.type].label}
                                                    </Badge>
                                                </div>
                                                <p className="font-bold text-sm truncate">{event.title}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {event.isAllDay
                                                            ? 'All Day'
                                                            : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
