'use client';

import { useState, useMemo } from 'react';
import {
    Search, Calendar as CalendarIcon, Users, CheckCircle, XCircle,
    Clock, Download, Filter, X, Phone, Mail, MapPin,
    TrendingUp, BarChart3, ChevronRight, LayoutDashboard,
    PieChart, UserPlus, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Enhanced dummy attendance data with contact information
const dummyAttendanceData = [
    // January 2nd (Current)
    {
        id: '1',
        class: '10-A',
        teacher: 'Mrs. Sarah Johnson',
        date: '2026-01-02',
        totalStudents: 35,
        present: 32,
        absent: 3,
        late: 0,
        percentage: 91.4,
        students: [
            { id: 'S1', name: 'Arjun Sharma', rollNo: '01', status: 'Present', time: '08:45 AM', phone: '+91 98765 43210', email: 'arjun@example.com', parentName: 'Mr. Raj Sharma', address: '123 MG Road, Bangalore' },
            { id: 'S2', name: 'Priya Patel', rollNo: '02', status: 'Present', time: '08:42 AM', phone: '+91 98765 43211', email: 'priya@example.com', parentName: 'Mrs. Sita Patel', address: '456 Park Street, Mumbai' },
            { id: 'S3', name: 'Rahul Kumar', rollNo: '03', status: 'Absent', time: '-', phone: '+91 98765 43212', email: 'rahul@example.com', parentName: 'Mr. Anil Kumar', address: '789 Lake View, Delhi' },
            { id: 'S4', name: 'Sneha Singh', rollNo: '04', status: 'Present', time: '08:50 AM', phone: '+91 98765 43213', email: 'sneha@example.com', parentName: 'Mrs. Pooja Singh', address: '321 Garden Colony, Pune' },
            { id: 'S5', name: 'Amit Verma', rollNo: '05', status: 'Present', time: '08:38 AM', phone: '+91 98765 43214', email: 'amit@example.com', parentName: 'Mr. Suresh Verma', address: '654 Hill Station, Chennai' },
        ]
    },
    {
        id: '2',
        class: '10-B',
        teacher: 'Mr. Robert Wilson',
        date: '2026-01-02',
        totalStudents: 33,
        present: 31,
        absent: 2,
        late: 0,
        percentage: 93.9,
        students: [
            { id: 'S6', name: 'Neha Gupta', rollNo: '01', status: 'Present', time: '08:40 AM', phone: '+91 98765 43215', email: 'neha@example.com', parentName: 'Mr. Dinesh Gupta', address: '987 Residency Road, Hyderabad' },
            { id: 'S7', name: 'Vikram Reddy', rollNo: '02', status: 'Present', time: '08:43 AM', phone: '+91 98765 43216', email: 'vikram@example.com', parentName: 'Mrs. Lakshmi Reddy', address: '159 Temple Street, Kolkata' },
            { id: 'S8', name: 'Anjali Mehta', rollNo: '03', status: 'Absent', time: '-', phone: '+91 98765 43217', email: 'anjali@example.com', parentName: 'Mr. Ramesh Mehta', address: '753 Market Area, Ahmedabad' },
            { id: 'S9', name: 'Rohan Das', rollNo: '04', status: 'Present', time: '08:47 AM', phone: '+91 98765 43218', email: 'rohan@example.com', parentName: 'Mrs. Rita Das', address: '246 Beach Road, Goa' },
            { id: 'S10', name: 'Kavya Iyer', rollNo: '05', status: 'Present', time: '08:35 AM', phone: '+91 98765 43219', email: 'kavya@example.com', parentName: 'Mr. Subramaniam Iyer', address: '135 Heritage Lane, Mysore' },
        ]
    },
    {
        id: '3',
        class: '9-A',
        teacher: 'Ms. Emily Davis',
        date: '2026-01-02',
        totalStudents: 32,
        present: 30,
        absent: 1,
        late: 1,
        percentage: 93.8,
        students: [
            { id: 'S11', name: 'Aditya Sharma', rollNo: '01', status: 'Present', time: '08:44 AM', phone: '+91 98765 43220', email: 'aditya@example.com', parentName: 'Mr. Vikas Sharma', address: '864 Tech Park, Bangalore' },
            { id: 'S12', name: 'Divya Singh', rollNo: '02', status: 'Present', time: '08:39 AM', phone: '+91 98765 43221', email: 'divya@example.com', parentName: 'Mrs. Anita Singh', address: '975 Civil Lines, Lucknow' },
            { id: 'S13', name: 'Karan Patel', rollNo: '03', status: 'Late', time: '09:15 AM', phone: '+91 98765 43222', email: 'karan@example.com', parentName: 'Mr. Mahesh Patel', address: '246 Commercial Hub, Surat' },
            { id: 'S14', name: 'Meera Reddy', rollNo: '04', status: 'Present', time: '08:41 AM', phone: '+91 98765 43223', email: 'meera@example.com', parentName: 'Mrs. Sarita Reddy', address: '531 Green Park, Vizag' },
            { id: 'S15', name: 'Sanjay Kumar', rollNo: '05', status: 'Absent', time: '-', phone: '+91 98765 43224', email: 'sanjay@example.com', parentName: 'Mr. Rajesh Kumar', address: '789 Industrial Area, Jaipur' },
        ]
    },

    // January 3rd (New Data)
    {
        id: '4',
        class: '10-A',
        teacher: 'Mrs. Sarah Johnson',
        date: '2026-01-03',
        totalStudents: 35,
        present: 34,
        absent: 1,
        late: 0,
        percentage: 97.1,
        students: [
            { id: 'S1', name: 'Arjun Sharma', rollNo: '01', status: 'Present', time: '08:45 AM', phone: '+91 98765 43210', email: 'arjun@example.com', parentName: 'Mr. Raj Sharma', address: '123 MG Road, Bangalore' },
            { id: 'S3', name: 'Rahul Kumar', rollNo: '03', status: 'Absent', time: '-', phone: '+91 98765 43212', email: 'rahul@example.com', parentName: 'Mr. Anil Kumar', address: '789 Lake View, Delhi' },
        ]
    },
    {
        id: '5',
        class: '10-B',
        teacher: 'Mr. Robert Wilson',
        date: '2026-01-03',
        totalStudents: 33,
        present: 30,
        absent: 0,
        late: 3,
        percentage: 100,
        students: [
            { id: 'S6', name: 'Neha Gupta', rollNo: '01', status: 'Late', time: '09:10 AM', phone: '+91 98765 43215', email: 'neha@example.com', parentName: 'Mr. Dinesh Gupta', address: '987 Residency Road, Hyderabad' },
            { id: 'S10', name: 'Kavya Iyer', rollNo: '05', status: 'Late', time: '09:05 AM', phone: '+91 98765 43219', email: 'kavya@example.com', parentName: 'Mr. Subramaniam Iyer', address: '135 Heritage Lane, Mysore' },
        ]
    },
    {
        id: '6',
        class: '9-A',
        teacher: 'Ms. Emily Davis',
        date: '2026-01-03',
        totalStudents: 32,
        present: 25,
        absent: 5,
        late: 2,
        percentage: 84.4,
        students: [
            { id: 'S11', name: 'Aditya Sharma', rollNo: '01', status: 'Absent', time: '-', phone: '+91 98765 43220', email: 'aditya@example.com', parentName: 'Mr. Vikas Sharma', address: '864 Tech Park, Bangalore' },
            { id: 'S13', name: 'Karan Patel', rollNo: '03', status: 'Late', time: '09:20 AM', phone: '+91 98765 43222', email: 'karan@example.com', parentName: 'Mr. Mahesh Patel', address: '246 Commercial Hub, Surat' },
            { id: 'S15', name: 'Sanjay Kumar', rollNo: '05', status: 'Absent', time: '-', phone: '+91 98765 43224', email: 'sanjay@example.com', parentName: 'Mr. Rajesh Kumar', address: '789 Industrial Area, Jaipur' },
        ]
    },

    // January 1st (New Data)
    {
        id: '7',
        class: '10-A',
        teacher: 'Mrs. Sarah Johnson',
        date: '2026-01-01',
        totalStudents: 35,
        present: 20,
        absent: 15,
        late: 0,
        percentage: 57.1,
        students: [
            { id: 'S1', name: 'Arjun Sharma', rollNo: '01', status: 'Absent', time: '-', phone: '+91 98765 43210', email: 'arjun@example.com', parentName: 'Mr. Raj Sharma', address: '123 MG Road, Bangalore' },
            { id: 'S3', name: 'Rahul Kumar', rollNo: '03', status: 'Absent', time: '-', phone: '+91 98765 43212', email: 'rahul@example.com', parentName: 'Mr. Anil Kumar', address: '789 Lake View, Delhi' },
        ]
    },
];

export default function AttendancePage() {
    const [selectedDate, setSelectedDate] = useState('2026-01-02');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [showPresentModal, setShowPresentModal] = useState(false);
    const [showAbsentModal, setShowAbsentModal] = useState(false);
    const [showLateModal, setShowLateModal] = useState(false);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);

    // Date object for Calendar component
    const dateObj = useMemo(() => {
        try {
            return parseISO(selectedDate);
        } catch (e) {
            return new Date();
        }
    }, [selectedDate]);

    // Filter data by selected date first
    const dateFilteredData = useMemo(() =>
        dummyAttendanceData.filter(record => record.date === selectedDate),
        [selectedDate]);

    // Then filter by search query
    const filteredData = useMemo(() =>
        dateFilteredData.filter(record =>
            record.class.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [dateFilteredData, searchQuery]);

    // Calculate stats based ONL on the selected date's data
    const totalStudents = dateFilteredData.reduce((sum, record) => sum + record.totalStudents, 0);
    const totalPresent = dateFilteredData.reduce((sum, record) => sum + record.present, 0);
    const totalAbsent = dateFilteredData.reduce((sum, record) => sum + record.absent, 0);
    const totalLate = dateFilteredData.reduce((sum, record) => sum + record.late, 0);
    const overallPercentage = totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : "0.0";

    // Get all present students for selected date
    const presentStudents = useMemo(() =>
        dateFilteredData.flatMap(record =>
            record.students
                .filter(s => s.status === 'Present')
                .map(s => ({ ...s, class: record.class, teacher: record.teacher }))
        ),
        [dateFilteredData]);

    // Get all absent students for selected date
    const absentStudents = useMemo(() =>
        dateFilteredData.flatMap(record =>
            record.students
                .filter(s => s.status === 'Absent')
                .map(s => ({ ...s, class: record.class, teacher: record.teacher }))
        ),
        [dateFilteredData]);

    // Get all late students for selected date
    const lateStudents = useMemo(() =>
        dateFilteredData.flatMap(record =>
            record.students
                .filter(s => s.status === 'Late')
                .map(s => ({ ...s, class: record.class, teacher: record.teacher }))
        ),
        [dateFilteredData]);

    const handleExport = () => {
        // Generate CSV using dateFilteredData
        const csvData = [
            ['Date', 'Class', 'Total Students', 'Present', 'Absent', 'Late', 'Attendance %'],
            ...dateFilteredData.map(r => [
                r.date,
                r.class,
                r.totalStudents,
                r.present,
                r.absent,
                r.late,
                r.percentage
            ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${selectedDate}.csv`;
        a.click();

        toast.success(`Attendance data for ${selectedDate} exported successfully!`);
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Attendance Management</h1>
                    <p className="text-muted-foreground mt-1">Track and manage student attendance records</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Date Selector */}
            <div className="bg-card rounded-xl border p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(dateObj, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateObj}
                                    onSelect={(date) => date && setSelectedDate(format(date, "yyyy-MM-dd"))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex-1" />
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by class..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Overall Stats - Now Clickable */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Students</p>
                            <p className="text-2xl font-bold mt-1">{totalStudents}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setShowPresentModal(true)}
                    className="bg-card rounded-xl border p-4 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Present</p>
                            <p className="text-2xl font-bold mt-1 text-green-600">{totalPresent}</p>
                            <p className="text-xs text-muted-foreground mt-1 text-green-600/60 font-medium">Click for details</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Absent Card - Clickable */}
                <div
                    onClick={() => setShowAbsentModal(true)}
                    className="bg-card rounded-xl border p-4 cursor-pointer hover:shadow-lg hover:border-red-300 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Absent</p>
                            <p className="text-2xl font-bold mt-1 text-red-600">{totalAbsent}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click for details</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Late Card - Clickable */}
                <div
                    onClick={() => setShowLateModal(true)}
                    className="bg-card rounded-xl border p-4 cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Late</p>
                            <p className="text-2xl font-bold mt-1 text-orange-600">{totalLate}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click for details</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Attendance % Card - Clickable */}
                <div
                    onClick={() => setShowAnalysisModal(true)}
                    className="bg-card rounded-xl border p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Attendance %</p>
                            <p className="text-2xl font-bold mt-1 text-blue-600">{overallPercentage}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Click for analysis</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Class-wise Attendance */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Class-wise Attendance</h2>

                <div className="grid grid-cols-1 gap-4">
                    {filteredData.map((record) => (
                        <div key={record.id} className="bg-card rounded-xl border overflow-hidden">
                            {/* Class Header */}
                            <div
                                className="p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 cursor-pointer hover:from-primary/20 hover:to-blue-500/20 transition-colors"
                                onClick={() => setSelectedClass(selectedClass === record.class ? null : record.class)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                            {record.class}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Class {record.class}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {record.totalStudents} students • {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{record.present}</p>
                                            <p className="text-xs text-muted-foreground">Present</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-red-600">{record.absent}</p>
                                            <p className="text-xs text-muted-foreground">Absent</p>
                                        </div>
                                        {record.late > 0 && (
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-orange-600">{record.late}</p>
                                                <p className="text-xs text-muted-foreground">Late</p>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{record.percentage}%</p>
                                            <p className="text-xs text-muted-foreground">Attendance</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Student List (Expandable) */}
                            {selectedClass === record.class && (
                                <div className="p-4 border-t">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left px-4 py-3 text-sm font-semibold">Roll No.</th>
                                                    <th className="text-left px-4 py-3 text-sm font-semibold">Student Name</th>
                                                    <th className="text-left px-4 py-3 text-sm font-semibold">Status</th>
                                                    <th className="text-left px-4 py-3 text-sm font-semibold">Time</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {record.students.map((student) => (
                                                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-sm font-medium">{student.rollNo}</td>
                                                        <td className="px-4 py-3 font-medium">{student.name}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${student.status === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                student.status === 'Absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                                }`}>
                                                                {student.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-muted-foreground">{student.time}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {filteredData.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground">No attendance records found</p>
                </div>
            )}

            {/* Present Students Modal */}
            {showPresentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b flex items-center justify-between bg-green-50/50 dark:bg-green-900/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Present Students</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {presentStudents.length} students present on {format(dateObj, "PPP")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPresentModal(false)}
                                className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-green-700 dark:text-green-400" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-muted/5">
                            {presentStudents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {presentStudents.map((student) => (
                                        <div key={student.id} className="bg-card border border-green-100 dark:border-green-900/30 rounded-xl p-5 hover:shadow-md transition-all group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">{student.name}</h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            Roll No: {student.rollNo} • Class {student.class}
                                                        </p>
                                                        <p className="text-[11px] text-primary font-medium mt-0.5">Teacher: {student.teacher}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                                                    {student.time}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30">
                                                    <Users className="w-4 h-4 text-green-600" />
                                                    <span className="truncate">{student.parentName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30">
                                                    <Phone className="w-4 h-4 text-green-600" />
                                                    <a href={`tel:${student.phone}`} className="hover:text-primary truncate">{student.phone}</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <p className="text-xl font-semibold text-muted-foreground">No records found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Absent Students Modal */}
            {showAbsentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b flex items-center justify-between bg-red-50/50 dark:bg-red-900/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">Absent Students</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {absentStudents.length} students absent on {format(dateObj, "PPP")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAbsentModal(false)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-red-700 dark:text-red-400" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-muted/5">
                            {absentStudents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {absentStudents.map((student) => (
                                        <div key={student.id} className="bg-card border border-red-100 dark:border-red-900/30 rounded-xl p-5 hover:shadow-md transition-all group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 text-xl rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-700 dark:text-red-400 font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg group-hover:text-red-600 transition-colors">{student.name}</h3>
                                                        <p className="text-sm text-muted-foreground">Roll No: {student.rollNo} • Class {student.class}</p>
                                                        <p className="text-[11px] text-primary font-medium mt-0.5">Teacher: {student.teacher}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-none">
                                                    Absent
                                                </Badge>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30">
                                                        <Users className="w-4 h-4 text-red-600" />
                                                        <span className="truncate">{student.parentName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30">
                                                        <Phone className="w-4 h-4 text-red-600" />
                                                        <a href={`tel:${student.phone}`} className="hover:text-primary truncate">{student.phone}</a>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30 text-sm">
                                                    <MapPin className="w-4 h-4 mt-0.5 text-red-600" />
                                                    <span className="line-clamp-1">{student.address}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t flex gap-2">
                                                <Button size="sm" variant="outline" className="w-full gap-2 text-xs">
                                                    <Mail className="w-3 h-3" /> Email
                                                </Button>
                                                <Button size="sm" variant="outline" className="w-full gap-2 text-xs">
                                                    <Phone className="w-3 h-3" /> Call Parent
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <p className="text-xl font-semibold">Perfect Attendance!</p>
                                    <p className="text-muted-foreground">No students are absent today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showLateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b flex items-center justify-between bg-orange-50/50 dark:bg-orange-900/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                    <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-400">Late Arrivals</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {lateStudents.length} students arrived late on {format(dateObj, "PPP")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLateModal(false)}
                                className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-orange-700 dark:text-orange-400" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-muted/5">
                            {lateStudents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {lateStudents.map((student) => (
                                        <div key={student.id} className="bg-card border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 hover:shadow-md transition-all group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 text-xl rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-700 dark:text-orange-400 font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">{student.name}</h3>
                                                        <p className="text-sm text-muted-foreground">Roll No: {student.rollNo} • Class {student.class}</p>
                                                        <p className="text-[11px] text-primary font-medium mt-0.5">Teacher: {student.teacher}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                                                    {student.time}
                                                </Badge>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30">
                                                        <Users className="w-4 h-4 text-orange-600" />
                                                        <span className="truncate">{student.parentName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30">
                                                        <Phone className="w-4 h-4 text-orange-600" />
                                                        <a href={`tel:${student.phone}`} className="hover:text-primary truncate">{student.phone}</a>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30 text-sm">
                                                    <MapPin className="w-4 h-4 mt-0.5 text-orange-600" />
                                                    <span className="line-clamp-1">{student.address}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t flex gap-2">
                                                <Button size="sm" variant="outline" className="w-full gap-2 text-xs">
                                                    <Mail className="w-3 h-3" /> Email
                                                </Button>
                                                <Button size="sm" variant="outline" className="w-full gap-2 text-xs">
                                                    <Phone className="w-3 h-3" /> Call Parent
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <p className="text-xl font-semibold">On Time!</p>
                                    <p className="text-muted-foreground">All students arrived on time today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Analysis Modal */}
            {showAnalysisModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                    <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Attendance Analysis</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Showing report for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAnalysisModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all group"
                            >
                                <X className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)] bg-slate-50/50 dark:bg-slate-950/50">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-hover hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-1 rounded-md">Growth</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Attendance Rate</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">{overallPercentage}%</p>
                                    </div>
                                    <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${overallPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-hover hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Present</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <p className="text-4xl font-extrabold text-emerald-600">{totalPresent}</p>
                                        <p className="text-sm font-medium text-slate-400">/ {totalStudents}</p>
                                    </div>
                                    <p className="text-xs text-emerald-600 mt-2 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md inline-block">
                                        {((totalPresent / totalStudents) * 100).toFixed(1)}% success
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-hover hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600">
                                            <XCircle className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Absent</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <p className="text-4xl font-extrabold text-rose-600">{totalAbsent}</p>
                                        <p className="text-sm font-medium text-slate-400">students</p>
                                    </div>
                                    <p className="text-xs text-rose-600 mt-2 font-medium bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md inline-block">
                                        {((totalAbsent / totalStudents) * 100).toFixed(1)}% gap
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-hover hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Late Arrivals</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <p className="text-4xl font-extrabold text-amber-600">{totalLate}</p>
                                        <p className="text-sm font-medium text-slate-400">check-ins</p>
                                    </div>
                                    <p className="text-xs text-amber-600 mt-2 font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md inline-block">
                                        {totalLate > 0 ? `${((totalLate / totalStudents) * 100).toFixed(1)}% delayed` : 'Perfect timing'}
                                    </p>
                                </div>
                            </div>

                            {/* Chart & Insights Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Pie Chart Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Distribution Overview</h3>
                                        <BarChart3 className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                                        <div className="relative">
                                            <svg viewBox="0 0 200 200" className="w-56 h-56 transform -rotate-90">
                                                {(() => {
                                                    const presentPercent = totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;
                                                    const absentPercent = totalStudents > 0 ? (totalAbsent / totalStudents) * 100 : 0;
                                                    const latePercent = totalStudents > 0 ? (totalLate / totalStudents) * 100 : 0;

                                                    const toRad = (deg: number) => (deg * Math.PI) / 180;
                                                    const radius = 85;
                                                    const cx = 100;
                                                    const cy = 100;

                                                    let startAngle = 0;

                                                    const createPath = (percent: number, color: string, name: string) => {
                                                        if (percent <= 0) return null;
                                                        const angle = (percent / 100) * 360;
                                                        const endAngle = startAngle + angle;

                                                        const x1 = cx + radius * Math.cos(toRad(startAngle));
                                                        const y1 = cy + radius * Math.sin(toRad(startAngle));
                                                        const x2 = cx + radius * Math.cos(toRad(endAngle));
                                                        const y2 = cy + radius * Math.sin(toRad(endAngle));

                                                        const largeArcFlag = angle > 180 ? 1 : 0;
                                                        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                                                        const path = (
                                                            <path
                                                                key={name}
                                                                d={pathData}
                                                                fill={color}
                                                                className="transition-all duration-300 hover:opacity-80 cursor-help"
                                                            >
                                                                <title>{name}: {percent.toFixed(1)}%</title>
                                                            </path>
                                                        );
                                                        startAngle = endAngle;
                                                        return path;
                                                    };

                                                    return (
                                                        <>
                                                            {createPath(presentPercent, '#10b981', 'Present')}
                                                            {createPath(absentPercent, '#f43f5e', 'Absent')}
                                                            {createPath(latePercent, '#f59e0b', 'Late')}
                                                            <circle cx={cx} cy={cy} r="60" fill="white" className="dark:fill-slate-900" />
                                                        </>
                                                    );
                                                })()}
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <span className="text-3xl font-black text-slate-900 dark:text-slate-50">{overallPercentage}%</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Score</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 w-full max-w-[150px]">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Present</span>
                                                </div>
                                                <p className="text-lg font-bold text-slate-900 dark:text-slate-50">{totalPresent}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-sm bg-rose-500" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Absent</span>
                                                </div>
                                                <p className="text-lg font-bold text-slate-900 dark:text-slate-50">{totalAbsent}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-sm bg-amber-500" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Late</span>
                                                </div>
                                                <p className="text-lg font-bold text-slate-900 dark:text-slate-50">{totalLate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Insights Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-indigo-600" />
                                        Advanced Insights
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Top Class', val: dateFilteredData.length > 0 ? dateFilteredData.reduce((max, r) => r.percentage > max.percentage ? r : max).class : 'N/A', sub: 'Consistently high', color: 'bg-emerald-50 text-emerald-600' },
                                            { label: 'Follow-ups', val: absentStudents.length, sub: 'Immediate action', color: 'bg-rose-50 text-rose-600' },
                                            { label: 'Risk Group', val: totalLate, sub: 'Needs monitoring', color: 'bg-amber-50 text-amber-600' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">{item.val}</p>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${item.color}`}>
                                                    {item.sub}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 rounded-xl bg-indigo-600 text-white flex items-center justify-between shadow-lg shadow-indigo-200 dark:shadow-none">
                                        <div>
                                            <p className="text-[10px] font-bold opacity-80 uppercase tracking-[2px]">Primary Goal</p>
                                            <p className="text-sm font-bold mt-1">Achieve 98% Campus Presence</p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 opacity-20" />
                                    </div>
                                </div>
                            </div>

                            {/* Class-wise Breakdown Table */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Class-wise Breakdown</h3>
                                    <span className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">Total {dateFilteredData.length} Classes</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Class</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Total</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Present</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Absent</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Late</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {dateFilteredData.map((record) => (
                                                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4 pt-5 pb-5">
                                                        <span className="flex items-center gap-3 font-bold text-slate-900 dark:text-slate-100">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-xs">
                                                                {record.class.split('-')[0]}
                                                            </div>
                                                            Class {record.class}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400">{record.totalStudents}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30">
                                                            {record.present}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30">
                                                            {record.absent}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${record.late > 0 ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30' : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
                                                            {record.late}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col items-end gap-1.5">
                                                            <span className={`text-xs font-black ${record.percentage >= 95 ? 'text-emerald-600' : record.percentage >= 90 ? 'text-indigo-600' : 'text-amber-600'}`}>
                                                                {record.percentage}%
                                                            </span>
                                                            <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${record.percentage >= 95 ? 'bg-emerald-500' : record.percentage >= 90 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                                                                    style={{ width: `${record.percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
