'use client';

import { useState } from 'react';
import { Calendar, FileText, Award, Download, Eye, X, BookOpen, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

// Dummy exam data for student with FA/SA types
const studentExams = [
    {
        id: '1',
        name: 'Formative Assessment 1 (FA1) 2025-26',
        type: 'FA1',
        startDate: '2025-07-15',
        endDate: '2025-07-20',
        status: 'Completed',
        resultsPublished: true,
        score: '85%',
        totalMarks: 100,
        obtainedMarks: 85,
        rank: 12,
        totalStudents: 158,
        subjects: [
            { name: 'Mathematics', marks: 22, maxMarks: 25 },
            { name: 'Science', marks: 21, maxMarks: 25 },
            { name: 'English', marks: 20, maxMarks: 25 },
            { name: 'Hindi', marks: 22, maxMarks: 25 },
        ],
    },
    {
        id: '2',
        name: 'Formative Assessment 2 (FA2) 2025-26',
        type: 'FA2',
        startDate: '2025-09-10',
        endDate: '2025-09-15',
        status: 'Completed',
        resultsPublished: true,
        score: '78%',
        totalMarks: 100,
        obtainedMarks: 78,
        rank: 18,
        totalStudents: 158,
        subjects: [
            { name: 'Mathematics', marks: 20, maxMarks: 25 },
            { name: 'Science', marks: 19, maxMarks: 25 },
            { name: 'English', marks: 18, maxMarks: 25 },
            { name: 'Hindi', marks: 21, maxMarks: 25 },
        ],
    },
    {
        id: '3',
        name: 'Summative Assessment 1 (SA1) 2025-26',
        type: 'SA1',
        startDate: '2025-10-15',
        endDate: '2025-10-28',
        status: 'Completed',
        resultsPublished: true,
        score: '82%',
        totalMarks: 400,
        obtainedMarks: 328,
        rank: 15,
        totalStudents: 158,
        subjects: [
            { name: 'Mathematics', marks: 85, maxMarks: 100 },
            { name: 'Science', marks: 82, maxMarks: 100 },
            { name: 'English', marks: 78, maxMarks: 100 },
            { name: 'Hindi', marks: 83, maxMarks: 100 },
        ],
    },
    {
        id: '4',
        name: 'Formative Assessment 3 (FA3) 2025-26',
        type: 'FA3',
        startDate: '2025-12-10',
        endDate: '2025-12-15',
        status: 'Completed',
        resultsPublished: true,
        score: '88%',
        totalMarks: 100,
        obtainedMarks: 88,
        rank: 8,
        totalStudents: 158,
        subjects: [
            { name: 'Mathematics', marks: 23, maxMarks: 25 },
            { name: 'Science', marks: 22, maxMarks: 25 },
            { name: 'English', marks: 21, maxMarks: 25 },
            { name: 'Hindi', marks: 22, maxMarks: 25 },
        ],
    },
    {
        id: '5',
        name: 'Formative Assessment 4 (FA4) 2025-26',
        type: 'FA4',
        startDate: '2026-01-20',
        endDate: '2026-01-25',
        status: 'Scheduled',
        resultsPublished: false,
        score: '-',
        totalMarks: 100,
        obtainedMarks: 0,
        rank: 0,
        totalStudents: 158,
        subjects: [],
    },
    {
        id: '6',
        name: 'Summative Assessment 2 (SA2) 2025-26',
        type: 'SA2',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        status: 'Upcoming',
        resultsPublished: false,
        score: '-',
        totalMarks: 400,
        obtainedMarks: 0,
        rank: 0,
        totalStudents: 158,
        subjects: [],
    },
];

const examSchedule = [
    { id: '1', examId: '5', date: '2026-01-20', day: 'Monday', subject: 'Mathematics', time: '10:00 AM - 11:00 AM', duration: '1 hour', maxMarks: 25 },
    { id: '2', examId: '5', date: '2026-01-21', day: 'Tuesday', subject: 'Science', time: '10:00 AM - 11:00 AM', duration: '1 hour', maxMarks: 25 },
    { id: '3', examId: '5', date: '2026-01-22', day: 'Wednesday', subject: 'English', time: '10:00 AM - 11:00 AM', duration: '1 hour', maxMarks: 25 },
    { id: '4', examId: '5', date: '2026-01-23', day: 'Thursday', subject: 'Hindi', time: '10:00 AM - 11:00 AM', duration: '1 hour', maxMarks: 25 },
    { id: '5', examId: '6', date: '2026-03-15', day: 'Monday', subject: 'Mathematics', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100 },
    { id: '6', examId: '6', date: '2026-03-17', day: 'Wednesday', subject: 'Science', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100 },
    { id: '7', examId: '6', date: '2026-03-19', day: 'Friday', subject: 'English', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100 },
    { id: '8', examId: '6', date: '2026-03-21', day: 'Monday', subject: 'Hindi', time: '09:00 AM - 12:00 PM', duration: '3 hours', maxMarks: 100 },
];

export default function StudentExaminationsPage() {
    const [activeTab, setActiveTab] = useState<'exams' | 'schedule'>('exams');
    const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
    const [selectedExamData, setSelectedExamData] = useState<any>(null);

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

    const getTypeColor = (type: string) => {
        if (type.startsWith('FA')) {
            return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
        } else if (type.startsWith('SA')) {
            return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
        }
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    };

    const handleExport = () => {
        const headers = ['Exam Name', 'Type', 'Start Date', 'End Date', 'Status', 'Score', 'Rank'];
        const rows = studentExams.map(exam => [
            exam.name,
            exam.type,
            exam.startDate,
            exam.endDate,
            exam.status,
            exam.score,
            exam.resultsPublished ? `${exam.rank}/${exam.totalStudents}` : '-'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "my_examinations_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Examinations report exported successfully!');
    };

    const handleViewDetails = (exam: any) => {
        setSelectedExamData(exam);
        setShowExamDetailsModal(true);
    };

    const completedExams = studentExams.filter(e => e.status === 'Completed').length;
    const upcomingExams = studentExams.filter(e => e.status === 'Upcoming' || e.status === 'Scheduled').length;
    const avgScore = studentExams.filter(e => e.resultsPublished).reduce((sum, e) => sum + parseInt(e.score), 0) / studentExams.filter(e => e.resultsPublished).length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Examinations</h1>
                    <p className="text-muted-foreground mt-1">View your exam schedule, results and performance</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Export
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                            <p className="text-2xl font-bold mt-1 text-purple-600">{avgScore.toFixed(0)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'exams'
                                ? 'bg-primary text-white'
                                : 'hover:bg-muted'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5" />
                            My Exams
                        </div>
                    </button>
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
                </div>

                <div className="p-6">
                    {activeTab === 'exams' && (
                        <div className="grid gap-4">
                            {studentExams.map((exam) => (
                                <div 
                                    key={exam.id} 
                                    className="bg-muted/30 rounded-xl p-6 border hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => handleViewDetails(exam)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-lg font-bold">{exam.name}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(exam.status)}`}>
                                                    {exam.status}
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getTypeColor(exam.type)}`}>
                                                    {exam.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(exam.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(exam.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {exam.resultsPublished ? (
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">Score</p>
                                                    <p className="text-2xl font-bold text-green-600">{exam.score}</p>
                                                    <p className="text-xs text-muted-foreground">Rank: {exam.rank}/{exam.totalStudents}</p>
                                                </div>
                                            ) : (
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">Results</p>
                                                    <p className="text-sm font-semibold text-orange-600">Pending</p>
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleViewDetails(exam); }}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            >
                                                <Eye className="w-5 h-5 text-primary" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Exam</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Date</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Subject</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Time</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Duration</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Max Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {examSchedule.map((schedule) => {
                                        const exam = studentExams.find(e => e.id === schedule.examId);
                                        return (
                                            <tr key={schedule.id} className="hover:bg-muted/30">
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(exam?.type || '')}`}>
                                                        {exam?.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{new Date(schedule.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                                                    <div className="text-xs text-muted-foreground">{schedule.day}</div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold">{schedule.subject}</td>
                                                <td className="px-4 py-3 text-sm">{schedule.time}</td>
                                                <td className="px-4 py-3 text-sm">{schedule.duration}</td>
                                                <td className="px-4 py-3 font-medium">{schedule.maxMarks}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Exam Details Modal */}
            {showExamDetailsModal && selectedExamData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className={`p-6 border-b flex items-center justify-between ${
                            selectedExamData.type.startsWith('SA') ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-purple-50 dark:bg-purple-900/20'
                        }`}>
                            <div className="flex items-center gap-3">
                                <BookOpen className={`w-6 h-6 ${selectedExamData.type.startsWith('SA') ? 'text-indigo-600' : 'text-purple-600'}`} />
                                <div>
                                    <h2 className={`text-xl font-bold ${selectedExamData.type.startsWith('SA') ? 'text-indigo-700 dark:text-indigo-400' : 'text-purple-700 dark:text-purple-400'}`}>
                                        {selectedExamData.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(selectedExamData.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(selectedExamData.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowExamDetailsModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Status and Score */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <p className={`font-bold mt-1 ${
                                        selectedExamData.status === 'Completed' ? 'text-green-600' :
                                        selectedExamData.status === 'Upcoming' ? 'text-blue-600' :
                                        'text-orange-600'
                                    }`}>{selectedExamData.status}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Total Marks</p>
                                    <p className="font-bold mt-1">{selectedExamData.totalMarks}</p>
                                </div>
                                {selectedExamData.resultsPublished && (
                                    <>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-xs text-green-600/80">Obtained</p>
                                            <p className="font-bold mt-1 text-green-700">{selectedExamData.obtainedMarks}/{selectedExamData.totalMarks}</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-xs text-blue-600/80">Rank</p>
                                            <p className="font-bold mt-1 text-blue-700">{selectedExamData.rank} / {selectedExamData.totalStudents}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Subject-wise Marks */}
                            {selectedExamData.resultsPublished && selectedExamData.subjects.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Subject-wise Performance</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left px-4 py-2 text-sm font-semibold">Subject</th>
                                                    <th className="text-left px-4 py-2 text-sm font-semibold">Marks</th>
                                                    <th className="text-left px-4 py-2 text-sm font-semibold">Percentage</th>
                                                    <th className="text-left px-4 py-2 text-sm font-semibold">Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {selectedExamData.subjects.map((subject: any, index: number) => {
                                                    const percentage = (subject.marks / subject.maxMarks) * 100;
                                                    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'D';
                                                    return (
                                                        <tr key={index} className="hover:bg-muted/30">
                                                            <td className="px-4 py-3 font-medium">{subject.name}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`font-bold ${
                                                                    percentage >= 80 ? 'text-green-600' :
                                                                    percentage >= 60 ? 'text-blue-600' :
                                                                    percentage >= 40 ? 'text-orange-600' :
                                                                    'text-red-600'
                                                                }`}>
                                                                    {subject.marks}/{subject.maxMarks}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className={`h-full rounded-full ${
                                                                                percentage >= 80 ? 'bg-green-500' :
                                                                                percentage >= 60 ? 'bg-blue-500' :
                                                                                percentage >= 40 ? 'bg-orange-500' :
                                                                                'bg-red-500'
                                                                            }`}
                                                                            style={{ width: `${percentage}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-700' :
                                                                    grade === 'B+' || grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                                }`}>
                                                                    {grade}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {!selectedExamData.resultsPublished && (
                                <div className="p-6 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl text-center">
                                    <Award className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                                    <p className="text-orange-700 dark:text-orange-400 font-medium">Results not yet published</p>
                                    <p className="text-sm text-muted-foreground mt-1">Check back later for your results</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3 bg-muted/30">
                            <button
                                onClick={() => setShowExamDetailsModal(false)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
