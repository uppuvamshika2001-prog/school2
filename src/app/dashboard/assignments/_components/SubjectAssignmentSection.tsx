'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';

// Dummy data for subject allocations by class
const classAllocations: Record<string, { subject: string; teacher: string; section: string }[]> = {
    '1': [
        { subject: 'English', teacher: 'Mary Wilson', section: 'A' },
        { subject: 'Mathematics', teacher: 'John Davis', section: 'A' },
        { subject: 'Environmental Science', teacher: 'Lisa Anderson', section: 'A' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'A' },
    ],
    '2': [
        { subject: 'English', teacher: 'Mary Wilson', section: 'A' },
        { subject: 'Mathematics', teacher: 'John Davis', section: 'A' },
        { subject: 'Environmental Science', teacher: 'Lisa Anderson', section: 'A' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'B' },
        { subject: 'Art', teacher: 'Rachel Green', section: 'B' },
    ],
    '3': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'John Davis', section: 'A' },
        { subject: 'Science', teacher: 'Lisa Anderson', section: 'B' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'A' },
        { subject: 'Social Studies', teacher: 'Michael Clark', section: 'B' },
    ],
    '4': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'Sarah Johnson', section: 'A' },
        { subject: 'Science', teacher: 'Robert Smith', section: 'B' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'A' },
        { subject: 'Social Studies', teacher: 'Michael Clark', section: 'B' },
        { subject: 'Computer Science', teacher: 'David Lee', section: 'A' },
    ],
    '5': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'Sarah Johnson', section: 'B' },
        { subject: 'Science', teacher: 'Robert Smith', section: 'A' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'B' },
        { subject: 'Social Studies', teacher: 'Michael Clark', section: 'A' },
        { subject: 'Computer Science', teacher: 'David Lee', section: 'B' },
    ],
    '6': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'Sarah Johnson', section: 'A' },
        { subject: 'Physics', teacher: 'Robert Smith', section: 'B' },
        { subject: 'Chemistry', teacher: 'Dr. Amanda White', section: 'A' },
        { subject: 'Biology', teacher: 'Lisa Anderson', section: 'B' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'A' },
        { subject: 'History', teacher: 'Michael Clark', section: 'B' },
    ],
    '7': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'Sarah Johnson', section: 'B' },
        { subject: 'Physics', teacher: 'Robert Smith', section: 'A' },
        { subject: 'Chemistry', teacher: 'Dr. Amanda White', section: 'B' },
        { subject: 'Biology', teacher: 'Lisa Anderson', section: 'A' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'B' },
        { subject: 'Geography', teacher: 'Michael Clark', section: 'A' },
        { subject: 'Computer Science', teacher: 'David Lee', section: 'B' },
    ],
    '8': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'Sarah Johnson', section: 'A' },
        { subject: 'Physics', teacher: 'Robert Smith', section: 'B' },
        { subject: 'Chemistry', teacher: 'Dr. Amanda White', section: 'A' },
        { subject: 'Biology', teacher: 'Lisa Anderson', section: 'B' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'A' },
        { subject: 'History', teacher: 'Michael Clark', section: 'B' },
        { subject: 'Computer Science', teacher: 'David Lee', section: 'A' },
    ],
    '9': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'Sarah Johnson', section: 'B' },
        { subject: 'Physics', teacher: 'Robert Smith', section: 'A' },
        { subject: 'Chemistry', teacher: 'Dr. Amanda White', section: 'B' },
        { subject: 'Biology', teacher: 'Lisa Anderson', section: 'A' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'B' },
        { subject: 'History', teacher: 'Michael Clark', section: 'A' },
        { subject: 'Geography', teacher: 'James Taylor', section: 'B' },
        { subject: 'Computer Science', teacher: 'David Lee', section: 'A' },
    ],
    '10': [
        { subject: 'English', teacher: 'Emily Brown', section: 'A' },
        { subject: 'Mathematics', teacher: 'Sarah Johnson', section: 'A' },
        { subject: 'Physics', teacher: 'Robert Smith', section: 'B' },
        { subject: 'Chemistry', teacher: 'Dr. Amanda White', section: 'A' },
        { subject: 'Biology', teacher: 'Lisa Anderson', section: 'B' },
        { subject: 'Hindi', teacher: 'Priya Sharma', section: 'A' },
        { subject: 'History', teacher: 'Michael Clark', section: 'B' },
        { subject: 'Geography', teacher: 'James Taylor', section: 'A' },
        { subject: 'Computer Science', teacher: 'David Lee', section: 'B' },
        { subject: 'Physical Education', teacher: 'Coach Williams', section: 'A' },
    ],
};

export default function SubjectAssignmentSection() {
    const [selectedClass, setSelectedClass] = useState('1');
    const currentAllocations = classAllocations[selectedClass] || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <CardTitle className="text-lg font-semibold">
                    Active Subject Allocations
                </CardTitle>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((classNum) => (
                            <SelectItem key={classNum} value={classNum.toString()}>
                                Class {classNum}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground w-16">#</th>
                                <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Subject</th>
                                <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground w-28">Section</th>
                                <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Teacher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAllocations.map((allocation, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-muted/20">
                                    <td className="h-14 px-4 text-sm text-muted-foreground">{idx + 1}</td>
                                    <td className="h-14 px-4 text-sm font-medium">{allocation.subject}</td>
                                    <td className="h-14 px-4 text-sm">{allocation.section}</td>
                                    <td className="h-14 px-4 text-sm">{allocation.teacher}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {currentAllocations.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No subject allocations found for this class.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
