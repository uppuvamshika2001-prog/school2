'use client';

import { useState } from 'react';
import { Calendar, FileText, Award, Download, Edit, Eye, X, Users, TrendingUp, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

// Dummy exam data for teacher with FA/SA types
const teacherExams = [
    {
        id: '1',
        name: 'Formative Assessment 1 (FA1) 2025-26',
        type: 'FA1',
        classes: ['10-A', '10-B'],
        subject: 'Mathematics',
        startDate: '2025-07-15',
        endDate: '2025-07-20',
        status: 'Completed',
        monitoringStatus: 'Marks Submitted',
        totalStudents: 68,
        marksEntered: 68,
        avgScore: 78.5,
        highestScore: 24,
        lowestScore: 12,
        passPercentage: 94.1,
    },
    {
        id: '2',
        name: 'Formative Assessment 2 (FA2) 2025-26',
        type: 'FA2',
        classes: ['10-A', '10-B'],
        subject: 'Mathematics',
        startDate: '2025-09-10',
        endDate: '2025-09-15',
        status: 'Completed',
        monitoringStatus: 'Marks Submitted',
        totalStudents: 68,
        marksEntered: 68,
        avgScore: 75.2,
        highestScore: 25,
        lowestScore: 10,
        passPercentage: 91.2,
    },
    {
        id: '3',
        name: 'Summative Assessment 1 (SA1) 2025-26',
        type: 'SA1',
        classes: ['10-A', '10-B'],
        subject: 'Mathematics',
        startDate: '2025-10-15',
        endDate: '2025-10-28',
        status: 'Completed',
        monitoringStatus: 'Marks Submitted',
        totalStudents: 68,
        marksEntered: 68,
        avgScore: 72.8,
        highestScore: 98,
        lowestScore: 35,
        passPercentage: 88.2,
    },
    {
        id: '4',
        name: 'Formative Assessment 3 (FA3) 2025-26',
        type: 'FA3',
        classes: ['10-A', '10-B'],
        subject: 'Mathematics',
        startDate: '2025-12-10',
        endDate: '2025-12-15',
        status: 'Completed',
        monitoringStatus: 'Marks Submitted',
        totalStudents: 68,
        marksEntered: 68,
        avgScore: 76.4,
        highestScore: 25,
        lowestScore: 11,
        passPercentage: 92.6,
    },
    {
        id: '5',
        name: 'Formative Assessment 4 (FA4) 2025-26',
        type: 'FA4',
        classes: ['9-A', '9-B'],
        subject: 'Mathematics',
        startDate: '2026-01-20',
        endDate: '2026-01-25',
        status: 'Scheduled',
        monitoringStatus: 'Pending',
        totalStudents: 64,
        marksEntered: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passPercentage: 0,
    },
    {
        id: '6',
        name: 'Summative Assessment 2 (SA2) 2025-26',
        type: 'SA2',
        classes: ['10-A', '10-B'],
        subject: 'Mathematics',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        status: 'Upcoming',
        monitoringStatus: 'Pending',
        totalStudents: 68,
        marksEntered: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passPercentage: 0,
    },
];

export default function TeacherExaminationsPage() {
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

    const handleEnterMarks = (examName: string) => {
        toast.info(`Marks entry for ${examName} coming soon!`);
    };

    const handleViewDetails = (exam: any) => {
        setSelectedExamData(exam);
        setShowExamDetailsModal(true);
    };

    const handleExport = () => {
        const headers = ['Exam Name', 'Type', 'Classes', 'Subject', 'Start Date', 'Status', 'Marks Status', 'Avg Score', 'Pass %'];
        const rows = teacherExams.map(exam => [
            exam.name,
            exam.type,
            exam.classes.join(' | '),
            exam.subject,
            exam.startDate,
            exam.status,
            exam.monitoringStatus,
            exam.avgScore ? `${exam.avgScore}%` : '-',
            exam.passPercentage ? `${exam.passPercentage}%` : '-'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "teacher_examinations_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Examinations report exported successfully!');
    };

    const completedExams = teacherExams.filter(e => e.status === 'Completed').length;
    const pendingMarks = teacherExams.filter(e => e.monitoringStatus === 'Pending').length;
    const totalStudents = teacherExams.reduce((sum, e) => sum + e.totalStudents, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Examinations Management</h1>
                    <p className="text-muted-foreground mt-1">Manage exams and enter marks for your classes</p>
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
                            <p className="text-sm text-muted-foreground">Completed Exams</p>
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
                            <p className="text-sm text-muted-foreground">Pending Marks Entry</p>
                            <p className="text-2xl font-bold mt-1 text-orange-600">{pendingMarks}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Edit className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Students</p>
                            <p className="text-2xl font-bold mt-1 text-blue-600">{totalStudents}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Exams List */}
            <div className="grid gap-4">
                {teacherExams.map((exam) => (
                    <div 
                        key={exam.id} 
                        className="bg-card rounded-xl border p-6 hover:shadow-md transition-all cursor-pointer"
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
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        Subject: <span className="font-semibold text-foreground">{exam.subject}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(exam.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(exam.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {exam.classes.map(cls => (
                                        <span key={cls} className="px-2 py-1 bg-secondary rounded text-xs font-medium">Class {cls}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right mr-4">
                                    <p className="text-xs text-muted-foreground">Marks Status</p>
                                    <p className={`text-sm font-medium ${exam.monitoringStatus === 'Marks Submitted' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {exam.monitoringStatus}
                                    </p>
                                    {exam.status === 'Completed' && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {exam.marksEntered}/{exam.totalStudents} entered
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleViewDetails(exam); }}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-5 h-5 text-primary" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEnterMarks(exam.name); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Enter Marks
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
                                        {selectedExamData.subject} • {selectedExamData.classes.join(', ')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowExamDetailsModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Exam Info */}
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
                                    <p className="text-xs text-muted-foreground">Total Students</p>
                                    <p className="font-bold mt-1">{selectedExamData.totalStudents}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Marks Entered</p>
                                    <p className={`font-bold mt-1 ${selectedExamData.marksEntered === selectedExamData.totalStudents ? 'text-green-600' : 'text-orange-600'}`}>
                                        {selectedExamData.marksEntered}/{selectedExamData.totalStudents}
                                    </p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Exam Period</p>
                                    <p className="font-bold mt-1 text-sm">
                                        {new Date(selectedExamData.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(selectedExamData.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            {selectedExamData.status === 'Completed' && selectedExamData.avgScore > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Performance Statistics</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                                            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                            <p className="text-xs text-purple-600/80">Average Score</p>
                                            <p className="text-xl font-bold text-purple-700">{selectedExamData.avgScore}%</p>
                                        </div>
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                            <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                            <p className="text-xs text-green-600/80">Highest Score</p>
                                            <p className="text-xl font-bold text-green-700">{selectedExamData.highestScore}</p>
                                        </div>
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                                            <Award className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                            <p className="text-xs text-red-600/80">Lowest Score</p>
                                            <p className="text-xl font-bold text-red-700">{selectedExamData.lowestScore}</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                                            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                            <p className="text-xs text-blue-600/80">Pass Percentage</p>
                                            <p className="text-xl font-bold text-blue-700">{selectedExamData.passPercentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Classes */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Assigned Classes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedExamData.classes.map((cls: string) => (
                                        <span key={cls} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                                            Class {cls}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {selectedExamData.status !== 'Completed' && (
                                <div className="p-6 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl text-center">
                                    <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                                    <p className="text-orange-700 dark:text-orange-400 font-medium">Exam {selectedExamData.status}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Starts on {new Date(selectedExamData.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
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
                            <button
                                onClick={() => { setShowExamDetailsModal(false); handleEnterMarks(selectedExamData.name); }}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                            >
                                Enter Marks
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
