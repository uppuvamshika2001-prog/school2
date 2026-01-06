'use client';

import { useState } from 'react';
import { Search, Calendar, BookOpen, FileText, Award, TrendingUp, Download, Plus, Eye, X, Users, Trophy, TrendingDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useIsSuperAdmin } from '@/stores/auth.store';
import Link from 'next/link';

// Define types for student scores
interface StudentScore {
    id: string;
    testId: string;
    rollNo: string;
    name: string;
    marks: number;
    maxMarks: number;
    percentage: number;
    status: 'Passed' | 'Failed';
}

// Dummy examination data
const dummyExaminations = [
    {

        id: '1',
        name: 'Formative Assessment 1 (FA1) 2025-26',
        type: 'FA1',
        startDate: '2025-07-15',
        endDate: '2025-07-20',
        status: 'Completed',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: true,
        averagePercentage: 78.5,
    },
    {
        id: '2',
        name: 'Formative Assessment 2 (FA2) 2025-26',
        type: 'FA2',
        startDate: '2025-09-10',
        endDate: '2025-09-15',
        status: 'Completed',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: true,
        averagePercentage: 75.2,
    },
    {
        id: '3',
        name: 'Summative Assessment 1 (SA1) 2025-26',
        type: 'SA1',
        startDate: '2025-10-15',
        endDate: '2025-10-28',
        status: 'Completed',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: true,
        averagePercentage: 72.8,
    },
    {
        id: '4',
        name: 'Formative Assessment 3 (FA3) 2025-26',
        type: 'FA3',
        startDate: '2025-12-10',
        endDate: '2025-12-15',
        status: 'Completed',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: true,
        averagePercentage: 76.4,
    },
    {
        id: '5',
        name: 'Formative Assessment 4 (FA4) 2025-26',
        type: 'FA4',
        startDate: '2026-01-20',
        endDate: '2026-01-25',
        status: 'Scheduled',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: false,
        averagePercentage: 0,
    },
    {
        id: '6',
        name: 'Summative Assessment 2 (SA2) 2025-26',
        type: 'SA2',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        status: 'Upcoming',
        classes: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
        totalSubjects: 8,
        totalStudents: 158,
        resultsPublished: false,
        averagePercentage: 0,
    },
];

// Dummy exam schedule
const dummyExamSchedule = [
    { id: '1', examId: '1', date: '2025-12-15', day: 'Monday', subject: 'Mathematics', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
    { id: '2', examId: '1', date: '2025-12-16', day: 'Tuesday', subject: 'Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
    { id: '3', examId: '1', date: '2025-12-17', day: 'Wednesday', subject: 'English', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
    { id: '4', examId: '1', date: '2025-12-18', day: 'Thursday', subject: 'Social Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
    { id: '5', examId: '1', date: '2025-12-19', day: 'Friday', subject: 'Hindi', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100, class: '10-A' },
];

// Dummy results
const dummyResults = [
    { id: '1', examId: '1', class: '10-A', totalStudents: 35, passed: 32, failed: 3, highestMarks: 98, lowestMarks: 42, averageMarks: 78.5, passPercentage: 91.4 },
    { id: '2', examId: '1', class: '10-B', totalStudents: 33, passed: 31, failed: 2, highestMarks: 96, lowestMarks: 38, averageMarks: 76.8, passPercentage: 93.9 },
    { id: '3', examId: '1', class: '9-A', totalStudents: 32, passed: 30, failed: 2, highestMarks: 95, lowestMarks: 35, averageMarks: 75.2, passPercentage: 93.8 },
    { id: '4', examId: '1', class: '11-A', totalStudents: 30, passed: 28, failed: 2, highestMarks: 97, lowestMarks: 40, averageMarks: 79.3, passPercentage: 93.3 },
    { id: '5', examId: '1', class: '12-A', totalStudents: 28, passed: 27, failed: 1, highestMarks: 99, lowestMarks: 45, averageMarks: 82.1, passPercentage: 96.4 },
];

// Dummy Weekly Tests data with lowestScore and failedCount
const dummyWeeklyTests = [
    { id: '1', week: 'Week 1', subject: 'Mathematics', class: '10-A', date: '2026-01-06', maxMarks: 25, avgScore: 18.5, highestScore: 24, lowestScore: 8, lowScorers: 5, failedCount: 2, status: 'Completed', totalStudents: 35 },
    { id: '2', week: 'Week 1', subject: 'Science', class: '10-A', date: '2026-01-07', maxMarks: 25, avgScore: 19.2, highestScore: 25, lowestScore: 9, lowScorers: 4, failedCount: 1, status: 'Completed', totalStudents: 35 },
    { id: '3', week: 'Week 1', subject: 'English', class: '10-B', date: '2026-01-08', maxMarks: 25, avgScore: 17.8, highestScore: 23, lowestScore: 7, lowScorers: 6, failedCount: 3, status: 'Completed', totalStudents: 33 },
    { id: '4', week: 'Week 2', subject: 'Mathematics', class: '10-A', date: '2026-01-13', maxMarks: 25, avgScore: 0, highestScore: 0, lowestScore: 0, lowScorers: 0, failedCount: 0, status: 'Grading', totalStudents: 35 },
    { id: '5', week: 'Week 2', subject: 'Science', class: '10-B', date: '2026-01-14', maxMarks: 25, avgScore: 0, highestScore: 0, lowestScore: 0, lowScorers: 0, failedCount: 0, status: 'Upcoming', totalStudents: 33 },
    { id: '6', week: 'Week 2', subject: 'Hindi', class: '9-A', date: '2026-01-15', maxMarks: 25, avgScore: 0, highestScore: 0, lowestScore: 0, lowScorers: 0, failedCount: 0, status: 'Upcoming', totalStudents: 32 },
    { id: '7', week: 'Week 3', subject: 'Social Science', class: '10-A', date: '2026-01-20', maxMarks: 25, avgScore: 0, highestScore: 0, lowestScore: 0, lowScorers: 0, failedCount: 0, status: 'Scheduled', totalStudents: 35 },
    { id: '8', week: 'Week 3', subject: 'Mathematics', class: '9-A', date: '2026-01-21', maxMarks: 25, avgScore: 0, highestScore: 0, lowestScore: 0, lowScorers: 0, failedCount: 0, status: 'Scheduled', totalStudents: 32 },
];

// Student scores for each weekly test (pass mark = 40% = 10/25)
const dummyStudentScores: StudentScore[] = [
    // Test 1 - Week 1 Mathematics 10-A
    { id: '1', testId: '1', rollNo: '10A001', name: 'Arjun Sharma', marks: 24, maxMarks: 25, percentage: 96, status: 'Passed' },
    { id: '2', testId: '1', rollNo: '10A002', name: 'Priya Patel', marks: 22, maxMarks: 25, percentage: 88, status: 'Passed' },
    { id: '3', testId: '1', rollNo: '10A003', name: 'Rahul Kumar', marks: 21, maxMarks: 25, percentage: 84, status: 'Passed' },
    { id: '4', testId: '1', rollNo: '10A004', name: 'Ananya Singh', marks: 20, maxMarks: 25, percentage: 80, status: 'Passed' },
    { id: '5', testId: '1', rollNo: '10A005', name: 'Vikram Reddy', marks: 19, maxMarks: 25, percentage: 76, status: 'Passed' },
    { id: '6', testId: '1', rollNo: '10A006', name: 'Sneha Gupta', marks: 18, maxMarks: 25, percentage: 72, status: 'Passed' },
    { id: '7', testId: '1', rollNo: '10A007', name: 'Aditya Verma', marks: 17, maxMarks: 25, percentage: 68, status: 'Passed' },
    { id: '8', testId: '1', rollNo: '10A008', name: 'Kavitha Nair', marks: 16, maxMarks: 25, percentage: 64, status: 'Passed' },
    { id: '9', testId: '1', rollNo: '10A009', name: 'Rohan Joshi', marks: 15, maxMarks: 25, percentage: 60, status: 'Passed' },
    { id: '10', testId: '1', rollNo: '10A010', name: 'Meera Das', marks: 14, maxMarks: 25, percentage: 56, status: 'Passed' },
    { id: '11', testId: '1', rollNo: '10A011', name: 'Karthik Iyer', marks: 12, maxMarks: 25, percentage: 48, status: 'Passed' },
    { id: '12', testId: '1', rollNo: '10A012', name: 'Divya Menon', marks: 11, maxMarks: 25, percentage: 44, status: 'Passed' },
    { id: '13', testId: '1', rollNo: '10A013', name: 'Suresh Babu', marks: 10, maxMarks: 25, percentage: 40, status: 'Passed' },
    { id: '14', testId: '1', rollNo: '10A014', name: 'Lakshmi Rao', marks: 8, maxMarks: 25, percentage: 32, status: 'Failed' },
    { id: '15', testId: '1', rollNo: '10A015', name: 'Ravi Prasad', marks: 9, maxMarks: 25, percentage: 36, status: 'Failed' },

    // Test 2 - Week 1 Science 10-A
    { id: '16', testId: '2', rollNo: '10A001', name: 'Arjun Sharma', marks: 23, maxMarks: 25, percentage: 92, status: 'Passed' },
    { id: '17', testId: '2', rollNo: '10A002', name: 'Priya Patel', marks: 25, maxMarks: 25, percentage: 100, status: 'Passed' },
    { id: '18', testId: '2', rollNo: '10A003', name: 'Rahul Kumar', marks: 20, maxMarks: 25, percentage: 80, status: 'Passed' },
    { id: '19', testId: '2', rollNo: '10A004', name: 'Ananya Singh', marks: 22, maxMarks: 25, percentage: 88, status: 'Passed' },
    { id: '20', testId: '2', rollNo: '10A005', name: 'Vikram Reddy', marks: 18, maxMarks: 25, percentage: 72, status: 'Passed' },
    { id: '21', testId: '2', rollNo: '10A006', name: 'Sneha Gupta', marks: 19, maxMarks: 25, percentage: 76, status: 'Passed' },
    { id: '22', testId: '2', rollNo: '10A007', name: 'Aditya Verma', marks: 16, maxMarks: 25, percentage: 64, status: 'Passed' },
    { id: '23', testId: '2', rollNo: '10A008', name: 'Kavitha Nair', marks: 15, maxMarks: 25, percentage: 60, status: 'Passed' },
    { id: '24', testId: '2', rollNo: '10A009', name: 'Rohan Joshi', marks: 14, maxMarks: 25, percentage: 56, status: 'Passed' },
    { id: '25', testId: '2', rollNo: '10A010', name: 'Meera Das', marks: 13, maxMarks: 25, percentage: 52, status: 'Passed' },
    { id: '26', testId: '2', rollNo: '10A011', name: 'Karthik Iyer', marks: 11, maxMarks: 25, percentage: 44, status: 'Passed' },
    { id: '27', testId: '2', rollNo: '10A012', name: 'Divya Menon', marks: 10, maxMarks: 25, percentage: 40, status: 'Passed' },
    { id: '28', testId: '2', rollNo: '10A013', name: 'Suresh Babu', marks: 9, maxMarks: 25, percentage: 36, status: 'Failed' },

    // Test 3 - Week 1 English 10-B
    { id: '29', testId: '3', rollNo: '10B001', name: 'Amit Choudhary', marks: 23, maxMarks: 25, percentage: 92, status: 'Passed' },
    { id: '30', testId: '3', rollNo: '10B002', name: 'Neha Kapoor', marks: 21, maxMarks: 25, percentage: 84, status: 'Passed' },
    { id: '31', testId: '3', rollNo: '10B003', name: 'Sanjay Mishra', marks: 20, maxMarks: 25, percentage: 80, status: 'Passed' },
    { id: '32', testId: '3', rollNo: '10B004', name: 'Pooja Agarwal', marks: 19, maxMarks: 25, percentage: 76, status: 'Passed' },
    { id: '33', testId: '3', rollNo: '10B005', name: 'Rajesh Tiwari', marks: 17, maxMarks: 25, percentage: 68, status: 'Passed' },
    { id: '34', testId: '3', rollNo: '10B006', name: 'Swati Saxena', marks: 16, maxMarks: 25, percentage: 64, status: 'Passed' },
    { id: '35', testId: '3', rollNo: '10B007', name: 'Deepak Pandey', marks: 14, maxMarks: 25, percentage: 56, status: 'Passed' },
    { id: '36', testId: '3', rollNo: '10B008', name: 'Ritu Sharma', marks: 12, maxMarks: 25, percentage: 48, status: 'Passed' },
    { id: '37', testId: '3', rollNo: '10B009', name: 'Manoj Singh', marks: 11, maxMarks: 25, percentage: 44, status: 'Passed' },
    { id: '38', testId: '3', rollNo: '10B010', name: 'Preeti Jain', marks: 9, maxMarks: 25, percentage: 36, status: 'Failed' },
    { id: '39', testId: '3', rollNo: '10B011', name: 'Ashok Kumar', marks: 8, maxMarks: 25, percentage: 32, status: 'Failed' },
    { id: '40', testId: '3', rollNo: '10B012', name: 'Sunita Devi', marks: 7, maxMarks: 25, percentage: 28, status: 'Failed' },
];

export default function ExaminationsPage() {
    const isSuperAdmin = useIsSuperAdmin();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'schedule' | 'weekly'>('schedule');
    const [examinations, setExaminations] = useState(dummyExaminations);
    const [weeklyTests, setWeeklyTests] = useState(dummyWeeklyTests);

    const [showAddExamModal, setShowAddExamModal] = useState(false);
    const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
    const [selectedExamData, setSelectedExamData] = useState<any>(null);

    const [showAddTestModal, setShowAddTestModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [modalType, setModalType] = useState<'highest' | 'average' | 'low' | 'failed' | null>(null);
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [showDetailedMarkList, setShowDetailedMarkList] = useState(false);
    const [detailClass, setDetailClass] = useState('10-A');

    const [newExam, setNewExam] = useState({
        name: '',
        type: 'FA1',
        startDate: '',
        endDate: '',
        classes: ['10-A'],
        totalSubjects: 8,
        totalStudents: 158
    });

    const [newTest, setNewTest] = useState({
        week: 'Week 1',
        subject: '',
        class: '10-A',
        date: '',
        maxMarks: 25,
        status: 'Scheduled'
    });

    const filteredExams = examinations.filter(exam =>
        exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Upcoming':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Scheduled':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const completedExams = examinations.filter(e => e.status === 'Completed').length;
    const upcomingExams = examinations.filter(e => e.status === 'Upcoming' || e.status === 'Scheduled').length;
    const totalStudents = examinations[0]?.totalStudents || 0;
    const avgPercentage = examinations.filter(e => e.resultsPublished).reduce((sum, e) => sum + e.averagePercentage, 0) / examinations.filter(e => e.resultsPublished).length || 0;
    const totalWeeklyTests = weeklyTests.length;
    const completedWeeklyTests = weeklyTests.filter(t => t.status === 'Completed').length;

    const handleExport = () => {
        const headers = ['ID', 'Exam Name', 'Type', 'Start Date', 'End Date', 'Status', 'Average Percentage'];
        const rows = examinations.map(exam => [
            exam.id,
            exam.name,
            exam.type,
            exam.startDate,
            exam.endDate,
            exam.status,
            exam.averagePercentage + '%'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "examinations_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Examinations report exported successfully!');
    };

    const handleAddExam = () => {
        if (!newExam.name || !newExam.startDate || !newExam.endDate) {
            toast.error('Please fill in all required fields');
            return;
        }
        const exam = {
            id: String(examinations.length + 1),
            ...newExam,
            status: 'Scheduled',
            resultsPublished: false,
            averagePercentage: 0
        };
        setExaminations([...examinations, exam]);
        setShowAddExamModal(false);
        setNewExam({
            name: '',
            type: 'Term Exam',
            startDate: '',
            endDate: '',
            classes: ['10-A'],
            totalSubjects: 5,
            totalStudents: 158
        });
        toast.success('Exam scheduled successfully!');
    };

    const handleAddTest = () => {
        if (!newTest.subject || !newTest.date) {
            toast.error('Please fill in all required fields');
            return;
        }
        const test = {
            id: String(weeklyTests.length + 1),
            ...newTest,
            avgScore: 0,
            highestScore: 0,
            lowestScore: 0,
            lowScorers: 0,
            failedCount: 0,
            totalStudents: 35
        };
        setWeeklyTests([...weeklyTests, test]);
        setShowAddTestModal(false);
        setNewTest({ week: 'Week 1', subject: '', class: '10-A', date: '', maxMarks: 25, status: 'Scheduled' });
        toast.success('Weekly test added successfully!');
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Examinations</h1>
                    <p className="text-muted-foreground mt-1">Manage exams, schedules, and results</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/examinations/marks-entry">
                        <button className="flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium">
                            <Eye className="w-5 h-5" />
                            Marks Entry
                        </button>
                    </Link>
                    <Link href="/dashboard/examinations/results">
                        <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                            <Trophy className="w-5 h-5" />
                            Results
                        </button>
                    </Link>
                    <Link href="/dashboard/examinations/analytics">
                        <button className="flex items-center gap-2 px-4 py-2 border border-purple-200 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium">
                            <TrendingUp className="w-5 h-5" />
                            Analytics
                        </button>
                    </Link>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                    {!isSuperAdmin && (
                        <button
                            onClick={() => setShowAddExamModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Add Exam
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Exams</p>
                            <p className="text-2xl font-bold mt-1">{dummyExaminations.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-2xl font-bold mt-1 text-green-600">{completedExams}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Upcoming</p>
                            <p className="text-2xl font-bold mt-1 text-blue-600">{upcomingExams}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Performance</p>
                            <p className="text-2xl font-bold mt-1 text-purple-600">{avgPercentage.toFixed(1)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Weekly Tests</p>
                            <p className="text-2xl font-bold mt-1 text-indigo-600">{totalWeeklyTests}</p>
                            <p className="text-xs text-muted-foreground mt-1">{completedWeeklyTests} completed</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-card rounded-xl border overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'schedule'
                            ? 'bg-primary text-white'
                            : 'hover:bg-muted'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Exam Schedule
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'weekly'
                            ? 'bg-primary text-white'
                            : 'hover:bg-muted'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Weekly Exam Schedule
                        </div>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Exam Schedule Tab */}
                    {activeTab === 'schedule' && (
                        <div className="space-y-4">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Date</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Day</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Subject</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Time</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Duration</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Max Marks</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Class</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {dummyExamSchedule.map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">
                                                    {new Date(schedule.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </td>
                                                <td className="px-4 py-3">{schedule.day}</td>
                                                <td className="px-4 py-3 font-semibold">{schedule.subject}</td>
                                                <td className="px-4 py-3 text-sm">{schedule.time}</td>
                                                <td className="px-4 py-3 text-sm">{schedule.duration}</td>
                                                <td className="px-4 py-3 font-medium">{schedule.maxMarks}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                                        {schedule.class}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Weekly Tests Tab */}
                    {activeTab === 'weekly' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Weekly Assessments</h3>
                                {!isSuperAdmin && (
                                    <button
                                        onClick={() => setShowAddTestModal(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Test
                                    </button>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Week</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Date</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Subject</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Class</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Max Marks</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Avg Score</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Highest</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Low Scorers</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Failed</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {weeklyTests.map((test) => (
                                            <tr key={test.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">{test.week}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {new Date(test.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </td>
                                                <td className="px-4 py-3 font-semibold">{test.subject}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                                        {test.class}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium">{test.maxMarks}</td>
                                                <td className="px-4 py-3">
                                                    {test.status === 'Completed' ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTestId(test.id);
                                                                setModalType('average');
                                                                setShowStudentModal(true);
                                                            }}
                                                            className="font-bold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer flex items-center gap-1"
                                                        >
                                                            <Users className="w-3.5 h-3.5" />
                                                            {test.avgScore}
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {test.status === 'Completed' ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTestId(test.id);
                                                                setModalType('highest');
                                                                setShowStudentModal(true);
                                                            }}
                                                            className="font-bold text-green-600 hover:text-green-800 hover:underline cursor-pointer flex items-center gap-1"
                                                        >
                                                            <Trophy className="w-3.5 h-3.5" />
                                                            {test.highestScore}
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {test.status === 'Completed' ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTestId(test.id);
                                                                setModalType('low');
                                                                setShowStudentModal(true);
                                                            }}
                                                            className="font-bold text-orange-600 hover:text-orange-800 hover:underline cursor-pointer flex items-center gap-1"
                                                        >
                                                            <TrendingDown className="w-3.5 h-3.5" />
                                                            {test.lowScorers}
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {test.status === 'Completed' ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTestId(test.id);
                                                                setModalType('failed');
                                                                setShowStudentModal(true);
                                                            }}
                                                            className="font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer flex items-center gap-1"
                                                        >
                                                            <AlertTriangle className="w-3.5 h-3.5" />
                                                            {test.failedCount}
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${test.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        test.status === 'Grading' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            test.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                        }`}>
                                                        {test.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>



            {/* Add Weekly Test Modal */}
            {showAddTestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20">
                            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">Add Weekly Test</h2>
                            <button onClick={() => setShowAddTestModal(false)} className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-full">
                                <X className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Week</label>
                                <select
                                    value={newTest.week}
                                    onChange={(e) => setNewTest({ ...newTest, week: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option>Week 1</option>
                                    <option>Week 2</option>
                                    <option>Week 3</option>
                                    <option>Week 4</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Subject *</label>
                                <input
                                    type="text"
                                    value={newTest.subject}
                                    onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                                    placeholder="e.g., Mathematics"
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Class</label>
                                <select
                                    value={newTest.class}
                                    onChange={(e) => setNewTest({ ...newTest, class: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option>9-A</option>
                                    <option>9-B</option>
                                    <option>10-A</option>
                                    <option>10-B</option>
                                    <option>11-A</option>
                                    <option>11-B</option>
                                    <option>12-A</option>
                                    <option>12-B</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date *</label>
                                <input
                                    type="date"
                                    value={newTest.date}
                                    onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Max Marks</label>
                                <input
                                    type="number"
                                    value={newTest.maxMarks}
                                    onChange={(e) => setNewTest({ ...newTest, maxMarks: parseInt(e.target.value) || 25 })}
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={newTest.status}
                                    onChange={(e) => setNewTest({ ...newTest, status: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option>Scheduled</option>
                                    <option>Upcoming</option>
                                    <option>Grading</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddTestModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTest}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Add Test
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Details Modal */}
            {showStudentModal && selectedTestId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className={`p-6 border-b flex items-center justify-between ${modalType === 'highest' ? 'bg-green-50 dark:bg-green-900/20' :
                            modalType === 'average' ? 'bg-purple-50 dark:bg-purple-900/20' :
                                modalType === 'low' ? 'bg-orange-50 dark:bg-orange-900/20' :
                                    'bg-red-50 dark:bg-red-900/20'
                            }`}>
                            <div className="flex items-center gap-3">
                                {modalType === 'highest' && <Trophy className="w-6 h-6 text-green-600" />}
                                {modalType === 'average' && <Users className="w-6 h-6 text-purple-600" />}
                                {modalType === 'low' && <TrendingDown className="w-6 h-6 text-orange-600" />}
                                {modalType === 'failed' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                                <div>
                                    <h2 className={`text-xl font-bold ${modalType === 'highest' ? 'text-green-700 dark:text-green-400' :
                                        modalType === 'average' ? 'text-purple-700 dark:text-purple-400' :
                                            modalType === 'low' ? 'text-orange-700 dark:text-orange-400' :
                                                'text-red-700 dark:text-red-400'
                                        }`}>
                                        {modalType === 'highest' && 'Top Performer'}
                                        {modalType === 'average' && 'All Students'}
                                        {modalType === 'low' && 'Low Scorers'}
                                        {modalType === 'failed' && 'Failed Candidates'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {weeklyTests.find(t => t.id === selectedTestId)?.subject} - {weeklyTests.find(t => t.id === selectedTestId)?.class}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowStudentModal(false);
                                    setSelectedTestId(null);
                                    setModalType(null);
                                }}
                                className={`p-2 rounded-full hover:bg-opacity-50 ${modalType === 'highest' ? 'hover:bg-green-100 dark:hover:bg-green-900/30' :
                                    modalType === 'average' ? 'hover:bg-purple-100 dark:hover:bg-purple-900/30' :
                                        modalType === 'low' ? 'hover:bg-orange-100 dark:hover:bg-orange-900/30' :
                                            'hover:bg-red-100 dark:hover:bg-red-900/30'
                                    }`}
                            >
                                <X className={`w-5 h-5 ${modalType === 'highest' ? 'text-green-700 dark:text-green-400' :
                                    modalType === 'average' ? 'text-purple-700 dark:text-purple-400' :
                                        modalType === 'low' ? 'text-orange-700 dark:text-orange-400' :
                                            'text-red-700 dark:text-red-400'
                                    }`} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <table className="w-full">
                                <thead className="bg-muted/50 sticky top-0">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Roll No</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Student Name</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Marks</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Percentage</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {(() => {
                                        const testScores = dummyStudentScores.filter(s => s.testId === selectedTestId);
                                        const selectedTest = weeklyTests.find(t => t.id === selectedTestId);
                                        const avgScore = selectedTest?.avgScore || 0;

                                        let filteredScores: StudentScore[] = [];

                                        if (modalType === 'highest') {
                                            const maxMarks = Math.max(...testScores.map(s => s.marks));
                                            filteredScores = testScores.filter(s => s.marks === maxMarks);
                                        } else if (modalType === 'average') {
                                            filteredScores = testScores.sort((a, b) => b.marks - a.marks);
                                        } else if (modalType === 'low') {
                                            filteredScores = testScores.filter(s => s.marks < avgScore && s.status === 'Passed').sort((a, b) => a.marks - b.marks);
                                        } else if (modalType === 'failed') {
                                            filteredScores = testScores.filter(s => s.status === 'Failed').sort((a, b) => a.marks - b.marks);
                                        }

                                        if (filteredScores.length === 0) {
                                            return (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                                        No students found in this category
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return filteredScores.map((student, index) => (
                                            <tr key={student.id} className={`transition-colors ${student.status === 'Failed' ? 'bg-red-50 dark:bg-red-900/10' :
                                                index === 0 && modalType === 'highest' ? 'bg-green-50 dark:bg-green-900/10' :
                                                    ''
                                                }`}>
                                                <td className="px-4 py-3 font-medium">{student.rollNo}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {index === 0 && modalType === 'highest' && (
                                                            <Trophy className="w-4 h-4 text-yellow-500" />
                                                        )}
                                                        <span className="font-semibold">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-bold ${student.status === 'Failed' ? 'text-red-600' :
                                                        student.percentage >= 80 ? 'text-green-600' :
                                                            student.percentage >= 60 ? 'text-blue-600' :
                                                                'text-orange-600'
                                                        }`}>
                                                        {student.marks}/{student.maxMarks}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${student.status === 'Failed' ? 'bg-red-500' :
                                                                    student.percentage >= 80 ? 'bg-green-500' :
                                                                        student.percentage >= 60 ? 'bg-blue-500' :
                                                                            'bg-orange-500'
                                                                    }`}
                                                                style={{ width: `${student.percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium">{student.percentage}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${student.status === 'Passed'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ));
                                    })()}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t bg-muted/30">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                    {modalType === 'highest' && 'Showing top performer(s)'}
                                    {modalType === 'average' && `Showing all ${dummyStudentScores.filter(s => s.testId === selectedTestId).length} students`}
                                    {modalType === 'low' && `Showing students scoring below average (${weeklyTests.find(t => t.id === selectedTestId)?.avgScore})`}
                                    {modalType === 'failed' && 'Showing students who did not meet the pass mark (40%)'}
                                </p>
                                <button
                                    onClick={() => {
                                        setShowStudentModal(false);
                                        setSelectedTestId(null);
                                        setModalType(null);
                                    }}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Exam Modal */}
            {showAddExamModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-3">
                                <Plus className="w-6 h-6 text-primary" />
                                <h2 className="text-xl font-bold">Schedule New Exam</h2>
                            </div>
                            <button onClick={() => setShowAddExamModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Exam Name *</label>
                                <input
                                    type="text"
                                    value={newExam.name}
                                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Unit Test 2 - February"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={newExam.type}
                                        onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="FA1">Formative Assessment 1 (FA1)</option>
                                        <option value="FA2">Formative Assessment 2 (FA2)</option>
                                        <option value="FA3">Formative Assessment 3 (FA3)</option>
                                        <option value="FA4">Formative Assessment 4 (FA4)</option>
                                        <option value="SA1">Summative Assessment 1 (SA1)</option>
                                        <option value="SA2">Summative Assessment 2 (SA2)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Subjects</label>
                                    <input
                                        type="number"
                                        value={newExam.totalSubjects}
                                        onChange={(e) => setNewExam({ ...newExam, totalSubjects: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        value={newExam.startDate}
                                        onChange={(e) => setNewExam({ ...newExam, startDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        value={newExam.endDate}
                                        onChange={(e) => setNewExam({ ...newExam, endDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Target Classes (comma separated)</label>
                                <input
                                    type="text"
                                    value={newExam.classes.join(', ')}
                                    onChange={(e) => setNewExam({ ...newExam, classes: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. 10-A, 10-B"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 bg-muted/30">
                            <button
                                onClick={() => setShowAddExamModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddExam}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                            >
                                Schedule Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exam Details Modal */}
            {showExamDetailsModal && selectedExamData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-3">
                                <Eye className="w-6 h-6 text-primary" />
                                <div>
                                    <h2 className="text-xl font-bold">{selectedExamData.name}</h2>
                                    <p className="text-sm text-muted-foreground">{selectedExamData.type}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowExamDetailsModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <p className={`font-bold mt-1 ${selectedExamData.status === 'Completed' ? 'text-green-600' :
                                        selectedExamData.status === 'Upcoming' ? 'text-blue-600' :
                                            'text-orange-600'
                                        }`}>{selectedExamData.status}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Pass Rate</p>
                                    <p className="font-bold mt-1">92.4%</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Total Students</p>
                                    <p className="font-bold mt-1">{selectedExamData.totalStudents}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Subjects</p>
                                    <p className="font-bold mt-1">{selectedExamData.totalSubjects}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">General Information</h3>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Exam Period</p>
                                        <p className="font-medium">{selectedExamData.startDate} to {selectedExamData.endDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Assigned Classes</p>
                                        <p className="font-medium">{selectedExamData.classes.join(', ')}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedExamData.resultsPublished && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
                                        <Award className="w-5 h-5" />
                                        Final Performance Report
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-green-600/80">Average Score</p>
                                            <p className="text-lg font-bold text-green-700">{selectedExamData.averagePercentage}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-600/80">Highest Score</p>
                                            <p className="text-lg font-bold text-green-700">99.2%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-600/80">Batch Rank</p>
                                            <p className="text-lg font-bold text-green-700">#3 Overall</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 bg-muted/30">
                            <button
                                onClick={() => setShowExamDetailsModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                            >
                                Close
                            </button>
                            {selectedExamData.status === 'Completed' && (
                                <button
                                    onClick={() => {
                                        setShowDetailedMarkList(true);
                                        setShowExamDetailsModal(false);
                                    }}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                                >
                                    Detailed Marks List
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Detailed Mark List Modal */}
            {showDetailedMarkList && selectedExamData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-3">
                                <Award className="w-6 h-6 text-primary" />
                                <div>
                                    <h2 className="text-2xl font-bold">Detailed Mark List</h2>
                                    <p className="text-sm text-muted-foreground">{selectedExamData.name} • Academic Year 2025-26</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailedMarkList(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-4 border-b bg-muted/20 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold">Class:</label>
                                <select
                                    value={detailClass.split('-')[0]}
                                    onChange={(e) => setDetailClass(`${e.target.value}-${detailClass.split('-')[1]}`)}
                                    className="px-3 py-1.5 rounded-lg border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold">Section:</label>
                                <select
                                    value={detailClass.split('-')[1]}
                                    onChange={(e) => setDetailClass(`${detailClass.split('-')[0]}-${e.target.value}`)}
                                    className="px-3 py-1.5 rounded-lg border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="A">Section A</option>
                                    <option value="B">Section B</option>
                                </select>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-background transition-colors text-sm font-medium">
                                    <Download className="w-4 h-4" /> Export PDF
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                                    Print List
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-6">
                            <table className="w-full border-collapse">
                                <thead className="bg-muted/50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-left border text-xs font-bold uppercase tracking-wider">Roll No</th>
                                        <th className="px-4 py-3 text-left border text-xs font-bold uppercase tracking-wider">Student Name</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider">Math</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider">Sci</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider">Eng</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider">Social</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider">Lang</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider font-black">Total</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider font-black">%</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider">Grade</th>
                                        <th className="px-4 py-3 text-center border text-xs font-bold uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y border">
                                    {[
                                        { roll: '101', name: 'Arjun Sharma', marks: [95, 88, 92, 90, 85] },
                                        { roll: '102', name: 'Priya Patel', marks: [98, 95, 96, 92, 94] },
                                        { roll: '103', name: 'Rahul Kumar', marks: [45, 52, 48, 55, 50] },
                                        { roll: '104', name: 'Sneha Gupta', marks: [82, 75, 80, 78, 85] },
                                        { roll: '105', name: 'Vikram Singh', marks: [38, 42, 35, 40, 32] },
                                        { roll: '106', name: 'Ananya Rao', marks: [88, 90, 85, 87, 92] },
                                        { roll: '107', name: 'Karthik S', marks: [75, 72, 78, 80, 70] },
                                        { roll: '108', name: 'Meera Nair', marks: [92, 94, 90, 95, 96] },
                                    ].map((student, i) => {
                                        const total = student.marks.reduce((a, b) => a + b, 0);
                                        const perc = (total / 500) * 100;
                                        const status = perc >= 40 ? 'Passed' : 'Failed';
                                        const grade = perc >= 90 ? 'A+' : perc >= 80 ? 'A' : perc >= 70 ? 'B' : perc >= 60 ? 'C' : perc >= 40 ? 'D' : 'E';

                                        return (
                                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 border text-sm font-medium">{detailClass.replace('-', '')}{student.roll}</td>
                                                <td className="px-4 py-3 border text-sm font-bold">{student.name}</td>
                                                {student.marks.map((m, mi) => (
                                                    <td key={mi} className={`px-4 py-3 border text-center text-sm ${m < 40 ? 'text-red-600 font-bold' : ''}`}>{m}</td>
                                                ))}
                                                <td className="px-4 py-3 border text-center text-sm font-black bg-muted/10">{total}</td>
                                                <td className="px-4 py-3 border text-center text-sm font-black bg-muted/10">{perc.toFixed(1)}%</td>
                                                <td className="px-4 py-3 border text-center text-sm font-bold">
                                                    <span className={`px-2 py-0.5 rounded ${perc >= 80 ? 'bg-green-100 text-green-700' : perc >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                        {grade}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 border text-center text-sm">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${status === 'Passed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t bg-muted/10 flex justify-between items-center">
                            <div className="flex gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-muted-foreground font-medium">Passed: <span className="text-foreground font-bold">6</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-muted-foreground font-medium">Failed: <span className="text-foreground font-bold">2</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-medium">Class Avg: <span className="text-foreground font-bold">76.4%</span></span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailedMarkList(false)}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-bold"
                            >
                                Close Mark List
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
