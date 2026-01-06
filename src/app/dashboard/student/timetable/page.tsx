'use client';

import { mockTimeTable } from '@/data/student-mock';
import { Clock } from 'lucide-react';

export default function StudentTimetablePage() {
    const hours = ['09:00', '10:00', '11:00', '12:00', '01:00', '02:00', '03:00'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Class Timetable</h1>
                <p className="text-muted-foreground">Weekly schedule for Class 10-A</p>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary/5">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-primary">Day / Time</th>
                                {hours.map((time, i) => (
                                    <th key={i} className="px-6 py-4 text-center font-medium text-muted-foreground min-w-[120px]">
                                        <div className="flex flex-col items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{time}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {Object.entries(mockTimeTable).map(([day, subjects]) => (
                                <tr key={day} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">{day}</td>
                                    {subjects.map((subject, index) => (
                                        <td key={index} className="px-6 py-4 p-2">
                                            <div className={`
                                                flex flex-col items-center justify-center p-3 rounded-lg text-center h-full
                                                ${subject === 'Break' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    subject === 'Sports' || subject === 'Games' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                                                        subject === 'Library' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                                            'bg-secondary/50 hover:bg-secondary'
                                                }
                                            `}>
                                                <span className="font-semibold">{subject}</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
