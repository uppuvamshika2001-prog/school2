'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

// Mock timetable data
const MOCK_SCHEDULE = [
    { day: 'MONDAY', time: '09:00', subject: 'Math', class: '10-A', room: '101' },
    { day: 'MONDAY', time: '11:00', subject: 'Math', class: '9-B', room: '202' },
    { day: 'TUESDAY', time: '10:00', subject: 'Physics', class: '10-A', room: 'Lab 1' },
    { day: 'WEDNESDAY', time: '09:00', subject: 'Math', class: '10-A', room: '101' },
    { day: 'THURSDAY', time: '14:00', subject: 'Adv Math', class: '12-A', room: '305' },
    { day: 'FRIDAY', time: '10:00', subject: 'Physics', class: '10-B', room: 'Lab 1' },
];

export default function TimetablePage() {
    const getEntry = (day: string, time: string) => {
        return MOCK_SCHEDULE.find(s => s.day === day && s.time === time);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Master Timetable</h1>
                <p className="text-muted-foreground">Weekly schedule overview</p>
            </div>

            <Card className="overflow-x-auto">
                <CardHeader>
                    <CardTitle>Weekly Grid</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="min-w-[800px]">
                        {/* Header Row */}
                        <div className="grid grid-cols-6 border-b">
                            <div className="p-4 font-bold text-muted-foreground bg-muted/50 border-r">Time</div>
                            {DAYS.map(day => (
                                <div key={day} className="p-4 font-bold text-center bg-muted/50 border-r last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time Rows */}
                        {TIMES.map(time => (
                            <div key={time} className="grid grid-cols-6 border-b last:border-b-0 min-h-[100px]">
                                <div className="p-4 font-medium text-sm text-muted-foreground border-r bg-muted/20 flex items-center justify-center">
                                    {time}
                                </div>
                                {DAYS.map(day => {
                                    const entry = getEntry(day, time);
                                    return (
                                        <div key={`${day}-${time}`} className="p-2 border-r last:border-r-0 relative group transition-colors hover:bg-muted/30">
                                            {entry ? (
                                                <div className="h-full w-full bg-primary/10 border border-primary/20 rounded p-2 flex flex-col justify-between hover:shadow-sm">
                                                    <div>
                                                        <p className="font-bold text-sm text-primary">{entry.subject}</p>
                                                        <p className="text-xs text-muted-foreground">Class {entry.class}</p>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground bg-white/50 w-fit px-1 rounded">
                                                        RM {entry.room}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
