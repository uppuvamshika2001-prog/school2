'use client';

import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export default function TeacherAttendancePage() {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Mock attendance data
    const attendanceData = [
        { date: new Date(today.getFullYear(), today.getMonth(), 1), status: 'PRESENT', checkIn: '08:30 AM', checkOut: '04:30 PM' },
        { date: new Date(today.getFullYear(), today.getMonth(), 2), status: 'PRESENT', checkIn: '08:25 AM', checkOut: '04:35 PM' },
        { date: new Date(today.getFullYear(), today.getMonth(), 3), status: 'LATE', checkIn: '09:15 AM', checkOut: '04:30 PM' },
        { date: new Date(today.getFullYear(), today.getMonth(), 4), status: 'ABSENT', checkIn: '-', checkOut: '-' },
        { date: new Date(today.getFullYear(), today.getMonth(), 5), status: 'PRESENT', checkIn: '08:30 AM', checkOut: '04:30 PM' },
    ];

    const getStatus = (date: Date) => {
        if (isWeekend(date)) return 'WEEKEND';
        const record = attendanceData.find(d => isSameDay(d.date, date));
        return record ? record.status : 'PRESENT'; // Default to present for demo
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'ABSENT': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'LATE': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'WEEKEND': return 'bg-muted text-muted-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
                <p className="text-muted-foreground">View your attendance history and monthly summary</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Summary Cards */}
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Present Days</p>
                            <h3 className="text-2xl font-bold">22</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Absent Days</p>
                            <h3 className="text-2xl font-bold">1</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Late Arrivals</p>
                            <h3 className="text-2xl font-bold">2</h3>
                        </div>
                    </div>
                </div>

                {/* Detailed List */}
                <div className="md:col-span-3 bg-card rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="font-semibold">December 2025</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left">Date</th>
                                    <th className="px-6 py-4 text-left">Day</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Check In</th>
                                    <th className="px-6 py-4 text-left">Check Out</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {days.map((day) => {
                                    if (day > today) return null;
                                    const status = getStatus(day);
                                    return (
                                        <tr key={day.toISOString()} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{format(day, 'dd MMM yyyy')}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{format(day, 'EEEE')}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', getStatusColor(status))}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">08:30 AM</td>
                                            <td className="px-6 py-4">04:30 PM</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
