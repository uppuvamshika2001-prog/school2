'use client';

import { useState, useMemo } from 'react';
import {
    Users,
    Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mock data for classes
const classes = [
    { id: '10-A', name: 'Class 10-A' },
    { id: '9-B', name: 'Class 9-B' },
    { id: '8-A', name: 'Class 8-A' },
];

// Mock data for students
const mockStudents = [
    { id: 1, name: 'Aarav Sharma', rollNo: '101' },
    { id: 2, name: 'Aditi Patel', rollNo: '102' },
    { id: 3, name: 'Arjun Singh', rollNo: '103' },
    { id: 4, name: 'Diya Gupta', rollNo: '104' },
    { id: 5, name: 'Ishaan Kumar', rollNo: '105' },
    { id: 6, name: 'Kavya Reddy', rollNo: '106' },
    { id: 7, name: 'Mira Nair', rollNo: '107' },
    { id: 8, name: 'Rohan Verma', rollNo: '108' },
    { id: 9, name: 'Sarthak Roy', rollNo: '109' },
    { id: 10, name: 'Vihaan Malhotra', rollNo: '110' },
    { id: 11, name: 'Zara Khan', rollNo: '111' },
    { id: 12, name: 'Ananya Das', rollNo: '112' },
];

const COLORS = {
    P: '#22c55e',   // green-500
    A: '#ef4444',   // red-500
};

export default function LiveAttendancePage() {
    const [selectedClass, setSelectedClass] = useState(classes[0].id);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    // Only P or A
    const [attendance, setAttendance] = useState<Record<number, 'P' | 'A'>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize attendance (default P for all)
    if (Object.keys(attendance).length === 0 && mockStudents.length > 0) {
        const initialLocal: Record<number, 'P' | 'A'> = {};
        mockStudents.forEach(s => {
            initialLocal[s.id] = 'P';
        });
        setAttendance(initialLocal);
    }

    const handleStatusChange = (studentId: number, status: 'P' | 'A') => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Attendance submitted successfully', {
            description: `Marked for ${classes.find(c => c.id === selectedClass)?.name} on ${date}`
        });
        setIsSubmitting(false);
    };

    const stats = useMemo(() => {
        const counts = { P: 0, A: 0 };
        Object.values(attendance).forEach(val => {
            if (counts[val] !== undefined) counts[val]++;
        });
        return counts;
    }, [attendance]);

    const chartData = [
        { name: 'Present', value: stats.P, color: COLORS.P },
        { name: 'Absent', value: stats.A, color: COLORS.A },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border shadow-sm sticky top-0 z-20">
                <div>
                    <h1 className="text-xl font-bold">Live Attendance</h1>
                    <p className="text-sm text-muted-foreground">{new Date(date).toDateString()}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="flex-1 sm:flex-none bg-background border rounded-lg px-3 py-2 text-sm"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="bg-background border rounded-lg px-3 py-2 text-sm"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats & Chart */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Attendance Summary
                        </h2>

                        {/* Total Students Display (Prominent) */}
                        <div className="mb-6 p-4 rounded-xl bg-primary/10 border-2 border-primary/20 text-center">
                            <span className="block text-sm font-medium text-muted-foreground mb-1">Total Students</span>
                            <span className="block text-4xl font-bold text-primary">{mockStudents.length}</span>
                        </div>

                        {/* Pie Chart */}
                        <div className="h-64 w-full mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Detailed Counts */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Present</div>
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.P}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                                <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Absent</div>
                                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.A}</div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="mt-6 w-full bg-primary text-primary-foreground h-12 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? 'Saving...' : <><Save className="w-5 h-5" /> Save Attendance</>}
                        </button>
                    </div>
                </div>

                {/* Right Column: Student List */}
                <div className="lg:col-span-2 space-y-3">
                    {mockStudents.map((student) => {
                        const status = attendance[student.id];
                        return (
                            <div
                                key={student.id}
                                className="bg-card p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${status === 'P' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}>
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{student.name}</h3>
                                        <p className="text-xs text-muted-foreground">Roll No: {student.rollNo}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    {(['P', 'A'] as const).map((s) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => handleStatusChange(student.id, s)}
                                            className={`w-12 h-10 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center
                        ${status === s
                                                    ? s === 'P' ? 'bg-green-500 text-white ring-2 ring-green-600 ring-offset-2' :
                                                        'bg-red-500 text-white ring-2 ring-red-600 ring-offset-2'
                                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:scale-105'
                                                }
                      `}
                                            title={s === 'P' ? 'Present' : 'Absent'}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
