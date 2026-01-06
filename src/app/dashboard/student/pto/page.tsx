'use client';

import { Users, FileText, Star } from 'lucide-react';

export default function StudentPTOPage() {
    const meetings = [
        {
            id: 1,
            date: '2025-10-15',
            teacher: 'Mrs. Sharma (Class Teacher)',
            points: ['Consistent performance in Math', 'Needs to improve handwriting', 'Participates well in class activities'],
            behavior: 'Excellent',
            suggestions: 'Practice cursive writing daily for 15 mins.'
        },
        {
            id: 2,
            date: '2025-08-10',
            teacher: 'Mr. Gupta (Science)',
            points: ['Good understanding of concepts', 'Homework submissions are regular'],
            behavior: 'Good',
            suggestions: 'Encourage to read more scientific articles.'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">PTO Meetings</h1>
                <p className="text-muted-foreground">Records of Parent-Teacher meetings and feedback</p>
            </div>

            <div className="grid gap-6">
                {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{meeting.teacher}</h3>
                                    <p className="text-sm text-muted-foreground">{meeting.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full w-fit">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium">Behavior: {meeting.behavior}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Discussion Points
                                </h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-1">
                                    {meeting.points.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-2 bg-secondary/30 p-4 rounded-lg">
                                <h4 className="text-sm font-semibold text-primary">Teacher's Suggestion</h4>
                                <p className="text-sm text-muted-foreground italic">"{meeting.suggestions}"</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
