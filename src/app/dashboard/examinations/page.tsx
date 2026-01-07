'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, Award, TrendingUp, Download, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useIsSuperAdmin } from '@/stores/auth.store';
import { useExamStore } from '@/stores/exam.store';
import Link from 'next/link';

// Types
interface Exam {
    id: string;
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    status: 'Completed' | 'Upcoming' | 'Scheduled';
    classes: string[];
    totalSubjects: number;
    totalStudents: number;
    resultsPublished: boolean;
    averagePercentage: number;
    schedule: ExamScheduleItem[];
}

interface ExamScheduleItem {
    id: string;
    date: string;
    day: string;
    subject: string;
    time: string;
    duration: string;
    maxMarks: number;
    class: string;
}

interface WeeklyTest {
    id: string;
    week: string;
    subject: string;
    class: string;
    date: string;
    maxMarks: number;
    avgScore: number;
    highestScore: number;
    lowestScore: number;
    status: 'Completed' | 'Grading' | 'Upcoming' | 'Scheduled';
    totalStudents: number;
    schedule: TestScheduleItem[];
}

interface TestScheduleItem {
    id: string;
    date: string;
    subject: string;
    time: string;
    duration: string;
    maxMarks: number;
    class: string;
    syllabus: string;
}

// Dummy Data
const dummyExaminations: Exam[] = [
    {
        id: '1',
        name: 'Formative Assessment 1 (FA1)',
        type: 'FA1',
        startDate: '2025-07-15',
        endDate: '2025-07-20',
        status: 'Completed',
        classes: ['9-A', '9-B', '10-A', '10-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: true,
        averagePercentage: 78.5,
        schedule: [
            { id: '1-1', date: '2025-07-15', day: 'Monday', subject: 'Mathematics', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '1-2', date: '2025-07-16', day: 'Tuesday', subject: 'Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '1-3', date: '2025-07-17', day: 'Wednesday', subject: 'English', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '1-4', date: '2025-07-18', day: 'Thursday', subject: 'Social Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '1-5', date: '2025-07-19', day: 'Friday', subject: 'Hindi', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
        ]
    },
    {
        id: '2',
        name: 'Formative Assessment 2 (FA2)',
        type: 'FA2',
        startDate: '2025-09-10',
        endDate: '2025-09-15',
        status: 'Completed',
        classes: ['9-A', '9-B', '10-A', '10-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: true,
        averagePercentage: 75.2,
        schedule: [
            { id: '2-1', date: '2025-09-10', day: 'Monday', subject: 'Mathematics', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '2-2', date: '2025-09-11', day: 'Tuesday', subject: 'Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '2-3', date: '2025-09-12', day: 'Wednesday', subject: 'English', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
        ]
    },
    {
        id: '3',
        name: 'Summative Assessment 1 (SA1)',
        type: 'SA1',
        startDate: '2025-10-15',
        endDate: '2025-10-28',
        status: 'Completed',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: true,
        averagePercentage: 72.8,
        schedule: [
            { id: '3-1', date: '2025-10-15', day: 'Monday', subject: 'Mathematics', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '3-2', date: '2025-10-17', day: 'Wednesday', subject: 'Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '3-3', date: '2025-10-19', day: 'Friday', subject: 'English', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '3-4', date: '2025-10-21', day: 'Monday', subject: 'Social Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '3-5', date: '2025-10-23', day: 'Wednesday', subject: 'Hindi', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '3-6', date: '2025-10-25', day: 'Friday', subject: 'Computer Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
        ]
    },
    {
        id: '4',
        name: 'Formative Assessment 4 (FA4)',
        type: 'FA4',
        startDate: '2026-01-20',
        endDate: '2026-01-25',
        status: 'Scheduled',
        classes: ['9-A', '9-B', '10-A', '10-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: false,
        averagePercentage: 0,
        schedule: [
            { id: '4-1', date: '2026-01-20', day: 'Monday', subject: 'Mathematics', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '4-2', date: '2026-01-21', day: 'Tuesday', subject: 'Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
            { id: '4-3', date: '2026-01-22', day: 'Wednesday', subject: 'English', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
        ]
    },
    {
        id: '5',
        name: 'Summative Assessment 2 (SA2)',
        type: 'SA2',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        status: 'Upcoming',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: false,
        averagePercentage: 0,
        schedule: []
    },
];

const dummyWeeklyTests: WeeklyTest[] = [
    {
        id: '1',
        week: 'Week 1',
        subject: 'Mathematics',
        class: '10-A',
        date: '2026-01-06',
        maxMarks: 25,
        avgScore: 18.5,
        highestScore: 24,
        lowestScore: 8,
        status: 'Completed',
        totalStudents: 35,
        schedule: [
            { id: 'w1-1', date: '2026-01-06', subject: 'Mathematics', time: '10:00 AM - 10:45 AM', duration: '45 min', maxMarks: 25, class: '10-A', syllabus: 'Chapter 1-3: Algebra Basics' }
        ]
    },
    {
        id: '2',
        week: 'Week 1',
        subject: 'Science',
        class: '10-A',
        date: '2026-01-07',
        maxMarks: 25,
        avgScore: 19.2,
        highestScore: 25,
        lowestScore: 9,
        status: 'Completed',
        totalStudents: 35,
        schedule: [
            { id: 'w2-1', date: '2026-01-07', subject: 'Science', time: '10:00 AM - 10:45 AM', duration: '45 min', maxMarks: 25, class: '10-A', syllabus: 'Chapter 1-2: Chemical Reactions' }
        ]
    },
    {
        id: '3',
        week: 'Week 2',
        subject: 'English',
        class: '10-B',
        date: '2026-01-13',
        maxMarks: 25,
        avgScore: 17.8,
        highestScore: 23,
        lowestScore: 7,
        status: 'Completed',
        totalStudents: 33,
        schedule: [
            { id: 'w3-1', date: '2026-01-13', subject: 'English', time: '10:00 AM - 10:45 AM', duration: '45 min', maxMarks: 25, class: '10-B', syllabus: 'Grammar: Tenses and Voice' }
        ]
    },
    {
        id: '4',
        week: 'Week 2',
        subject: 'Mathematics',
        class: '10-A',
        date: '2026-01-14',
        maxMarks: 25,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        status: 'Scheduled',
        totalStudents: 35,
        schedule: [
            { id: 'w4-1', date: '2026-01-14', subject: 'Mathematics', time: '10:00 AM - 10:45 AM', duration: '45 min', maxMarks: 25, class: '10-A', syllabus: 'Chapter 4-5: Quadratic Equations' }
        ]
    },
    {
        id: '5',
        week: 'Week 3',
        subject: 'Science',
        class: '10-B',
        date: '2026-01-20',
        maxMarks: 25,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        status: 'Upcoming',
        totalStudents: 33,
        schedule: [
            { id: 'w5-1', date: '2026-01-20', subject: 'Science', time: '10:00 AM - 10:45 AM', duration: '45 min', maxMarks: 25, class: '10-B', syllabus: 'Chapter 3-4: Metals and Non-metals' }
        ]
    },
];

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science', 'Physical Education'];
const CLASSES = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

export default function ExaminationsPage() {
    const isSuperAdmin = useIsSuperAdmin();
    const { addExam: addExamToStore } = useExamStore();
    const [examinations, setExaminations] = useState<Exam[]>(dummyExaminations);
    const [weeklyTests, setWeeklyTests] = useState<WeeklyTest[]>(dummyWeeklyTests);
    const [expandedExamId, setExpandedExamId] = useState<string | null>(null);
    const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

    // Dialog States
    const [showAddExamDialog, setShowAddExamDialog] = useState(false);
    const [showAddTestDialog, setShowAddTestDialog] = useState(false);
    const [showScheduleExamDialog, setShowScheduleExamDialog] = useState(false);
    const [selectedExamForSchedule, setSelectedExamForSchedule] = useState<Exam | null>(null);

    // Form States
    const [newExam, setNewExam] = useState({
        name: '',
        type: 'FA1',
        startDate: '',
        endDate: '',
        classes: '10-A',
        totalSubjects: 5,
    });

    const [newTest, setNewTest] = useState({
        week: 'Week 1',
        subject: 'Mathematics',
        class: '10-A',
        date: '',
        maxMarks: 25,
        time: '10:00 AM - 10:45 AM',
        syllabus: '',
    });

    const [newScheduleItem, setNewScheduleItem] = useState({
        date: '',
        subject: 'Mathematics',
        time: '09:00 AM - 12:00 PM',
        duration: '3 hours',
        maxMarks: 100,
        class: '10-A',
    });

    // Stats
    const completedExams = examinations.filter(e => e.status === 'Completed').length;
    const upcomingExams = examinations.filter(e => e.status === 'Upcoming' || e.status === 'Scheduled').length;
    const avgPercentage = examinations.filter(e => e.resultsPublished).reduce((sum, e) => sum + e.averagePercentage, 0) / (examinations.filter(e => e.resultsPublished).length || 1);
    const completedTests = weeklyTests.filter(t => t.status === 'Completed').length;

    const handleAddExam = async () => {
        if (!newExam.name || !newExam.startDate || !newExam.endDate) {
            toast.error('Please fill all required fields');
            return;
        }

        // Add to local state for UI display
        const exam: Exam = {
            id: String(Date.now()),
            name: newExam.name,
            type: newExam.type,
            startDate: newExam.startDate,
            endDate: newExam.endDate,
            status: 'Scheduled',
            classes: newExam.classes.split(',').map(c => c.trim()),
            totalSubjects: newExam.totalSubjects,
            totalStudents: 158,
            resultsPublished: false,
            averagePercentage: 0,
            schedule: [],
        };
        setExaminations([...examinations, exam]);

        // Also add to shared store for Marks Entry sync
        try {
            await addExamToStore({
                name: newExam.name,
                type: newExam.type as any,
                startDate: newExam.startDate,
                endDate: newExam.endDate,
                status: 'Scheduled',
                classes: newExam.classes.split(',').map(c => c.trim()),
                totalSubjects: newExam.totalSubjects,
            });
        } catch (error) {
            console.error('Failed to sync exam to store:', error);
        }

        setShowAddExamDialog(false);
        setNewExam({ name: '', type: 'FA1', startDate: '', endDate: '', classes: '10-A', totalSubjects: 5 });
        toast.success('Exam created successfully! Now available in Marks Entry.');
    };

    const handleAddTest = () => {
        if (!newTest.date || !newTest.syllabus) {
            toast.error('Please fill all required fields');
            return;
        }
        const test: WeeklyTest = {
            id: String(Date.now()),
            week: newTest.week,
            subject: newTest.subject,
            class: newTest.class,
            date: newTest.date,
            maxMarks: newTest.maxMarks,
            avgScore: 0,
            highestScore: 0,
            lowestScore: 0,
            status: 'Scheduled',
            totalStudents: 35,
            schedule: [{
                id: `s-${Date.now()}`,
                date: newTest.date,
                subject: newTest.subject,
                time: newTest.time,
                duration: '45 min',
                maxMarks: newTest.maxMarks,
                class: newTest.class,
                syllabus: newTest.syllabus,
            }],
        };
        setWeeklyTests([...weeklyTests, test]);
        setShowAddTestDialog(false);
        setNewTest({ week: 'Week 1', subject: 'Mathematics', class: '10-A', date: '', maxMarks: 25, time: '10:00 AM - 10:45 AM', syllabus: '' });
        toast.success('Weekly test scheduled successfully!');
    };

    const handleAddScheduleItem = () => {
        if (!newScheduleItem.date || !selectedExamForSchedule) {
            toast.error('Please fill all required fields');
            return;
        }
        const dayName = new Date(newScheduleItem.date).toLocaleDateString('en-US', { weekday: 'long' });
        const scheduleItem: ExamScheduleItem = {
            id: String(Date.now()),
            date: newScheduleItem.date,
            day: dayName,
            subject: newScheduleItem.subject,
            time: newScheduleItem.time,
            duration: newScheduleItem.duration,
            maxMarks: newScheduleItem.maxMarks,
            class: newScheduleItem.class,
        };

        const updatedExams = examinations.map(exam => {
            if (exam.id === selectedExamForSchedule.id) {
                return { ...exam, schedule: [...exam.schedule, scheduleItem] };
            }
            return exam;
        });
        setExaminations(updatedExams);
        setNewScheduleItem({ date: '', subject: 'Mathematics', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' });
        toast.success('Exam schedule added!');
    };

    const handleExport = () => {
        const headers = ['Exam Name', 'Type', 'Start Date', 'End Date', 'Status', 'Average %'];
        const rows = examinations.map(exam => [exam.name, exam.type, exam.startDate, exam.endDate, exam.status, exam.averagePercentage + '%']);
        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'examinations_report.csv';
        link.click();
        toast.success('Report exported!');
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Upcoming': return 'bg-blue-100 text-blue-700';
            case 'Scheduled': return 'bg-orange-100 text-orange-700';
            case 'Grading': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Examinations</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage exams, schedules, and results</p>
                </div>
                <div className="flex items-center gap-2">
                    {!isSuperAdmin && (
                        <Link href="/dashboard/examinations/marks-entry">
                            <Button variant="outline" size="sm">Marks Entry</Button>
                        </Link>
                    )}
                    <Link href="/dashboard/examinations/analytics">
                        <Button variant="outline" size="sm">Analytics</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    {!isSuperAdmin && (
                        <Button size="sm" onClick={() => setShowAddExamDialog(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exam
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Exams</p>
                                <p className="text-2xl font-bold">{examinations.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{completedExams}</p>
                            </div>
                            <Award className="w-8 h-8 text-green-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Upcoming</p>
                                <p className="text-2xl font-bold text-blue-600">{upcomingExams}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Performance</p>
                                <p className="text-2xl font-bold text-purple-600">{avgPercentage.toFixed(1)}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Weekly Tests</p>
                                <p className="text-2xl font-bold">{weeklyTests.length}</p>
                                <p className="text-xs text-muted-foreground">{completedTests} completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="exams" className="w-full">
                <TabsList>
                    <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly Tests</TabsTrigger>
                </TabsList>

                {/* Exams Tab */}
                <TabsContent value="exams" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground w-8"></th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Exam Name</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Date Range</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Classes</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Avg %</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                            {!isSuperAdmin && <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {examinations.map(exam => (
                                            <>
                                                <tr key={exam.id} className="border-b hover:bg-muted/20">
                                                    <td className="h-14 px-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => setExpandedExamId(expandedExamId === exam.id ? null : exam.id)}
                                                        >
                                                            {expandedExamId === exam.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </Button>
                                                    </td>
                                                    <td className="h-14 px-4 font-medium">{exam.name}</td>
                                                    <td className="h-14 px-4 text-sm">{exam.type}</td>
                                                    <td className="h-14 px-4 text-sm">{exam.startDate} to {exam.endDate}</td>
                                                    <td className="h-14 px-4 text-sm">{exam.classes.slice(0, 2).join(', ')}{exam.classes.length > 2 ? ` +${exam.classes.length - 2}` : ''}</td>
                                                    <td className="h-14 px-4 text-sm font-medium">{exam.resultsPublished ? `${exam.averagePercentage}%` : '-'}</td>
                                                    <td className="h-14 px-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(exam.status)}`}>
                                                            {exam.status}
                                                        </span>
                                                    </td>
                                                    {!isSuperAdmin && (
                                                        <td className="h-14 px-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedExamForSchedule(exam);
                                                                    setShowScheduleExamDialog(true);
                                                                }}
                                                            >
                                                                <Plus className="w-4 h-4 mr-1" />
                                                                Schedule
                                                            </Button>
                                                        </td>
                                                    )}
                                                </tr>
                                                {expandedExamId === exam.id && (
                                                    <tr>
                                                        <td colSpan={8} className="bg-muted/20 p-4">
                                                            <div className="space-y-3">
                                                                <h4 className="font-medium text-sm">Exam Schedule Details</h4>
                                                                {exam.schedule.length === 0 ? (
                                                                    <p className="text-sm text-muted-foreground">No schedule added yet. Click "Schedule" to add exam dates.</p>
                                                                ) : (
                                                                    <table className="w-full border">
                                                                        <thead>
                                                                            <tr className="bg-muted/50">
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Date</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Day</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Subject</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Time</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Duration</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Max Marks</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Class</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {exam.schedule.map(item => (
                                                                                <tr key={item.id} className="border-t">
                                                                                    <td className="px-3 py-2 text-sm">{item.date}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.day}</td>
                                                                                    <td className="px-3 py-2 text-sm font-medium">{item.subject}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.time}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.duration}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.maxMarks}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.class}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Weekly Tests Tab */}
                <TabsContent value="weekly" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Weekly Test Schedule</CardTitle>
                            {!isSuperAdmin && (
                                <Button size="sm" onClick={() => setShowAddTestDialog(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Test
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground w-8"></th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Week</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Subject</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Class</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Max Marks</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Avg Score</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Highest</th>
                                            <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weeklyTests.map(test => (
                                            <>
                                                <tr key={test.id} className="border-b hover:bg-muted/20">
                                                    <td className="h-14 px-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => setExpandedTestId(expandedTestId === test.id ? null : test.id)}
                                                        >
                                                            {expandedTestId === test.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </Button>
                                                    </td>
                                                    <td className="h-14 px-4 font-medium">{test.week}</td>
                                                    <td className="h-14 px-4 text-sm">{test.date}</td>
                                                    <td className="h-14 px-4 text-sm font-medium">{test.subject}</td>
                                                    <td className="h-14 px-4 text-sm">{test.class}</td>
                                                    <td className="h-14 px-4 text-sm">{test.maxMarks}</td>
                                                    <td className="h-14 px-4 text-sm">{test.status === 'Completed' ? test.avgScore : '-'}</td>
                                                    <td className="h-14 px-4 text-sm">{test.status === 'Completed' ? test.highestScore : '-'}</td>
                                                    <td className="h-14 px-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(test.status)}`}>
                                                            {test.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {expandedTestId === test.id && (
                                                    <tr>
                                                        <td colSpan={9} className="bg-muted/20 p-4">
                                                            <div className="space-y-3">
                                                                <h4 className="font-medium text-sm">Test Details</h4>
                                                                {test.schedule.length === 0 ? (
                                                                    <p className="text-sm text-muted-foreground">No details available.</p>
                                                                ) : (
                                                                    <table className="w-full border">
                                                                        <thead>
                                                                            <tr className="bg-muted/50">
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Date</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Subject</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Time</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Duration</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Max Marks</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Class</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium">Syllabus</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {test.schedule.map(item => (
                                                                                <tr key={item.id} className="border-t">
                                                                                    <td className="px-3 py-2 text-sm">{item.date}</td>
                                                                                    <td className="px-3 py-2 text-sm font-medium">{item.subject}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.time}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.duration}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.maxMarks}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.class}</td>
                                                                                    <td className="px-3 py-2 text-sm">{item.syllabus}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add Exam Dialog */}
            <Dialog open={showAddExamDialog} onOpenChange={setShowAddExamDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Exam</DialogTitle>
                        <DialogDescription>Add a new examination to the schedule</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Exam Name *</Label>
                            <Input
                                value={newExam.name}
                                onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                                placeholder="e.g., Formative Assessment 1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={newExam.type} onValueChange={(v) => setNewExam({ ...newExam, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FA1">FA1</SelectItem>
                                        <SelectItem value="FA2">FA2</SelectItem>
                                        <SelectItem value="FA3">FA3</SelectItem>
                                        <SelectItem value="FA4">FA4</SelectItem>
                                        <SelectItem value="SA1">SA1</SelectItem>
                                        <SelectItem value="SA2">SA2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Total Subjects</Label>
                                <Input
                                    type="number"
                                    value={newExam.totalSubjects}
                                    onChange={(e) => setNewExam({ ...newExam, totalSubjects: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date *</Label>
                                <Input
                                    type="date"
                                    value={newExam.startDate}
                                    onChange={(e) => setNewExam({ ...newExam, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date *</Label>
                                <Input
                                    type="date"
                                    value={newExam.endDate}
                                    onChange={(e) => setNewExam({ ...newExam, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Classes (comma separated)</Label>
                            <Input
                                value={newExam.classes}
                                onChange={(e) => setNewExam({ ...newExam, classes: e.target.value })}
                                placeholder="e.g., 10-A, 10-B"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddExamDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddExam}>Create Exam</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Weekly Test Dialog */}
            <Dialog open={showAddTestDialog} onOpenChange={setShowAddTestDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule Weekly Test</DialogTitle>
                        <DialogDescription>Add a new weekly test</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Week</Label>
                                <Select value={newTest.week} onValueChange={(v) => setNewTest({ ...newTest, week: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Week 1">Week 1</SelectItem>
                                        <SelectItem value="Week 2">Week 2</SelectItem>
                                        <SelectItem value="Week 3">Week 3</SelectItem>
                                        <SelectItem value="Week 4">Week 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select value={newTest.class} onValueChange={(v) => setNewTest({ ...newTest, class: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CLASSES.map(cls => (
                                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select value={newTest.subject} onValueChange={(v) => setNewTest({ ...newTest, subject: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SUBJECTS.map(sub => (
                                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Date *</Label>
                                <Input
                                    type="date"
                                    value={newTest.date}
                                    onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Max Marks</Label>
                                <Input
                                    type="number"
                                    value={newTest.maxMarks}
                                    onChange={(e) => setNewTest({ ...newTest, maxMarks: parseInt(e.target.value) || 25 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Time</Label>
                                <Input
                                    value={newTest.time}
                                    onChange={(e) => setNewTest({ ...newTest, time: e.target.value })}
                                    placeholder="e.g., 10:00 AM - 10:45 AM"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Syllabus *</Label>
                            <Input
                                value={newTest.syllabus}
                                onChange={(e) => setNewTest({ ...newTest, syllabus: e.target.value })}
                                placeholder="e.g., Chapter 1-3: Algebra Basics"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddTestDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddTest}>Schedule Test</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Exam Dialog */}
            <Dialog open={showScheduleExamDialog} onOpenChange={setShowScheduleExamDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Exam Schedule</DialogTitle>
                        <DialogDescription>
                            {selectedExamForSchedule ? `Add schedule for ${selectedExamForSchedule.name}` : 'Add exam schedule'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date *</Label>
                                <Input
                                    type="date"
                                    value={newScheduleItem.date}
                                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select value={newScheduleItem.subject} onValueChange={(v) => setNewScheduleItem({ ...newScheduleItem, subject: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SUBJECTS.map(sub => (
                                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Time</Label>
                                <Input
                                    value={newScheduleItem.time}
                                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                                    placeholder="e.g., 09:00 AM - 12:00 PM"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <Input
                                    value={newScheduleItem.duration}
                                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, duration: e.target.value })}
                                    placeholder="e.g., 3 hours"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Max Marks</Label>
                                <Input
                                    type="number"
                                    value={newScheduleItem.maxMarks}
                                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, maxMarks: parseInt(e.target.value) || 100 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select value={newScheduleItem.class} onValueChange={(v) => setNewScheduleItem({ ...newScheduleItem, class: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CLASSES.map(cls => (
                                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowScheduleExamDialog(false)}>Close</Button>
                        <Button onClick={handleAddScheduleItem}>Add Schedule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
