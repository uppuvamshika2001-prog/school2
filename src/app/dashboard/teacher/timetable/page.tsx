'use client';

import { Clock, BookOpen, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockTeacherTimetable = {
    Monday: [
        { time: '09:00 - 10:00', class: '10-A', subject: 'Maths', room: '201' },
        { time: '10:00 - 11:00', class: '10-B', subject: 'Science', room: '202' },
        { time: '11:00 - 11:15', class: 'Break', subject: '-', room: '-' },
        { time: '11:15 - 12:15', class: '9-A', subject: 'Telugu', room: '101' },
    ],
    Tuesday: [
        { time: '09:00 - 10:00', class: '9-B', subject: 'Hindi', room: '102' },
        { time: '10:00 - 11:00', class: 'Free', subject: '-', room: '-' },
        { time: '11:00 - 11:15', class: 'Break', subject: '-', room: '-' },
        { time: '11:15 - 12:15', class: '10-A', subject: 'English', room: '201' },
    ],
    Wednesday: [
        { time: '09:00 - 10:00', class: '10-B', subject: 'Social', room: '202' },
        { time: '10:00 - 11:00', class: '9-A', subject: 'Maths', room: '101' },
        { time: '11:00 - 11:15', class: 'Break', subject: '-', room: '-' },
        { time: '11:15 - 12:15', class: 'Free', subject: '-', room: '-' },
    ],
    Thursday: [
        { time: '09:00 - 10:00', class: '10-A', subject: 'Science', room: '201' },
        { time: '10:00 - 11:00', class: 'Free', subject: '-', room: '-' },
        { time: '11:00 - 11:15', class: 'Break', subject: '-', room: '-' },
        { time: '11:15 - 12:15', class: '9-B', subject: 'Telugu', room: '102' },
    ],
    Friday: [
        { time: '09:00 - 10:00', class: '9-A', subject: 'Hindi', room: '101' },
        { time: '10:00 - 11:00', class: '10-B', subject: 'English', room: '202' },
        { time: '11:00 - 11:15', class: 'Break', subject: '-', room: '-' },
        { time: '11:15 - 12:15', class: 'Free', subject: '-', room: '-' },
    ],
    Saturday: [
        { time: '09:00 - 10:00', class: '10-A', subject: 'Social', room: '201' },
        { time: '10:00 - 11:00', class: 'Free', subject: '-', room: '-' },
        { time: '11:00 - 11:15', class: 'Break', subject: '-', room: '-' },
        { time: '11:15 - 12:15', class: 'Extra', subject: 'Activity', room: 'Field' },
    ]
};

export default function TeacherTimetablePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Timetable</h1>
                <p className="text-muted-foreground mt-1">Weekly teaching schedule</p>
            </div>

            <div className="bg-card rounded-xl border shadow-lg overflow-hidden pb-4">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="px-6 py-5 text-left font-bold text-primary border-r sticky left-0 bg-muted/50 z-10 min-w-[120px]">
                                    Day / Time
                                </th>
                                {['09:00 - 10:00', '10:00 - 11:00', '11:00 - 11:15', '11:15 - 12:15'].map((time) => (
                                    <th key={time} className="px-6 py-5 text-center font-semibold text-muted-foreground min-w-[160px]">
                                        <div className="flex flex-col items-center gap-1">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>{time}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {Object.entries(mockTeacherTimetable).map(([day, slots]) => (
                                <tr key={day} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-8 font-black text-primary border-r bg-muted/10 sticky left-0 z-10">
                                        {day}
                                    </td>
                                    {['09:00 - 10:00', '10:00 - 11:00', '11:00 - 11:15', '11:15 - 12:15'].map((timeSlot) => {
                                        const slot = slots.find(s => s.time === timeSlot);
                                        if (!slot) return <td key={timeSlot} className="p-2 bg-muted/5"></td>;

                                        const isBreak = slot.class === 'Break';
                                        const isFree = slot.class === 'Free';

                                        return (
                                            <td key={timeSlot} className="p-2 align-top h-32">
                                                <div className={cn(
                                                    "h-full p-4 rounded-xl border-2 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md",
                                                    isBreak ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20" :
                                                        isFree ? "bg-gray-50 border-gray-200 text-gray-500 italic dark:bg-gray-900/20" :
                                                            "bg-primary/5 border-primary/20 text-primary-foreground group"
                                                )}>
                                                    <div>
                                                        <div className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest mb-1 opacity-60",
                                                            !isBreak && !isFree && "text-primary dark:text-primary-foreground"
                                                        )}>
                                                            {isBreak ? 'Interval' : isFree ? 'No Class' : `Class ${slot.class}`}
                                                        </div>
                                                        <div className={cn(
                                                            "font-bold text-base leading-tight",
                                                            !isBreak && !isFree && "text-foreground"
                                                        )}>
                                                            {isBreak ? 'Break Time' : isFree ? 'Free Period' : slot.subject}
                                                        </div>
                                                    </div>

                                                    {!isBreak && !isFree && (
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground mt-2 border-t pt-2 border-primary/10">
                                                            <MapPin className="w-3 h-3" />
                                                            ROOM {slot.room}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
