'use client';

import { useState, useMemo } from 'react';
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    X,
    Users,
    TrendingUp,
    Award,
    AlertCircle,
    BarChart3,
    PieChart as PieChartIcon,
    Download,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';

// Mock data for classes
const classes = [
    { id: '10-A', name: 'Class 10-A' },
    { id: '9-B', name: 'Class 9-B' },
    { id: '8-A', name: 'Class 8-A' },
];

// Mock student data with attendance records
const mockStudents = [
    { id: 1, name: 'Aarav Sharma', rollNo: '101', present: 85, absent: 10, late: 5, percentage: 85 },
    { id: 2, name: 'Aditi Patel', rollNo: '102', present: 92, absent: 5, late: 3, percentage: 92 },
    { id: 3, name: 'Arjun Singh', rollNo: '103', present: 78, absent: 15, late: 7, percentage: 78 },
    { id: 4, name: 'Diya Gupta', rollNo: '104', present: 95, absent: 3, late: 2, percentage: 95 },
    { id: 5, name: 'Ishaan Kumar', rollNo: '105', present: 88, absent: 8, late: 4, percentage: 88 },
    { id: 6, name: 'Kavya Reddy', rollNo: '106', present: 90, absent: 6, late: 4, percentage: 90 },
    { id: 7, name: 'Mira Nair', rollNo: '107', present: 82, absent: 12, late: 6, percentage: 82 },
    { id: 8, name: 'Rohan Verma', rollNo: '108', present: 75, absent: 18, late: 7, percentage: 75 },
    { id: 9, name: 'Sarthak Roy', rollNo: '109', present: 93, absent: 4, late: 3, percentage: 93 },
    { id: 10, name: 'Vihaan Malhotra', rollNo: '110', present: 87, absent: 9, late: 4, percentage: 87 },
    { id: 11, name: 'Zara Khan', rollNo: '111', present: 91, absent: 6, late: 3, percentage: 91 },
    { id: 12, name: 'Ananya Das', rollNo: '112', present: 89, absent: 7, late: 4, percentage: 89 },
];

// Monthly trend data
const monthlyTrend = [
    { month: 'Jan', present: 88, absent: 12 },
    { month: 'Feb', present: 85, absent: 15 },
    { month: 'Mar', present: 90, absent: 10 },
    { month: 'Apr', present: 87, absent: 13 },
    { month: 'May', present: 92, absent: 8 },
    { month: 'Jun', present: 89, absent: 11 },
    { month: 'Jul', present: 91, absent: 9 },
    { month: 'Aug', present: 88, absent: 12 },
    { month: 'Sep', present: 93, absent: 7 },
    { month: 'Oct', present: 90, absent: 10 },
    { month: 'Nov', present: 94, absent: 6 },
    { month: 'Dec', present: 87, absent: 13 },
];

const COLORS = {
    present: '#22c55e',
    absent: '#ef4444',
    late: '#f59e0b',
    excellent: '#8b5cf6',
    good: '#3b82f6',
    average: '#f59e0b',
    poor: '#ef4444',
};

export default function StudentAttendancePage() {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const [activeTab, setActiveTab] = useState<'history' | 'analysis'>('history');
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [leaveReason, setLeaveReason] = useState('');
    const [selectedClass, setSelectedClass] = useState(classes[0].id);
    const [analysisView, setAnalysisView] = useState<'overview' | 'individual' | 'trends'>('overview');

    // Attendance History Data
    const attendanceData = [
        { date: new Date(today.getFullYear(), today.getMonth(), 1), status: 'PRESENT' },
        { date: new Date(today.getFullYear(), today.getMonth(), 2), status: 'PRESENT' },
        { date: new Date(today.getFullYear(), today.getMonth(), 3), status: 'ABSENT' },
        { date: new Date(today.getFullYear(), today.getMonth(), 4), status: 'PRESENT' },
        { date: new Date(today.getFullYear(), today.getMonth(), 5), status: 'PRESENT' },
    ];

    const getStatus = (date: Date) => {
        if (isWeekend(date)) return 'WEEKEND';
        const record = attendanceData.find(d => isSameDay(d.date, date));
        return record ? record.status : 'PRESENT';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'ABSENT': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'LEAVE': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-green-400';
            case 'WEEKEND': return 'bg-muted text-muted-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const handleApplyLeave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Leave applied successfully! Reason: ${leaveReason}`);
        setIsLeaveModalOpen(false);
        setLeaveReason('');
    };

    // Analysis Logic
    const overallStats = useMemo(() => {
        const totalDays = 100;
        const totalPresent = mockStudents.reduce((sum, s) => sum + s.present, 0);
        const totalAbsent = mockStudents.reduce((sum, s) => sum + s.absent, 0);
        const totalLate = mockStudents.reduce((sum, s) => sum + s.late, 0);
        const avgPercentage = (totalPresent / (mockStudents.length * totalDays)) * 100;

        return {
            totalStudents: mockStudents.length,
            totalDays,
            totalPresent,
            totalAbsent,
            totalLate,
            avgPercentage: avgPercentage.toFixed(1),
        };
    }, []);

    const overallPieData = [
        { name: 'Present', value: overallStats.totalPresent, color: COLORS.present },
        { name: 'Absent', value: overallStats.totalAbsent, color: COLORS.absent },
        { name: 'Late', value: overallStats.totalLate, color: COLORS.late },
    ];

    const performanceData = useMemo(() => {
        const excellent = mockStudents.filter(s => s.percentage >= 90).length;
        const good = mockStudents.filter(s => s.percentage >= 75 && s.percentage < 90).length;
        const average = mockStudents.filter(s => s.percentage >= 60 && s.percentage < 74).length;
        const poor = mockStudents.filter(s => s.percentage < 60).length;

        return [
            { category: 'Excellent (≥90%)', count: excellent, color: COLORS.excellent },
            { category: 'Good (75-89%)', count: good, color: COLORS.good },
            { category: 'Average (60-74%)', count: average, color: COLORS.average },
            { category: 'Poor (<60%)', count: poor, color: COLORS.poor },
        ];
    }, []);

    const studentComparisonData = mockStudents.map(s => ({
        name: s.name.split(' ')[0],
        present: s.present,
        absent: s.absent,
        late: s.late,
        percentage: s.percentage,
    }));

    const topPerformers = mockStudents
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5)
        .map(s => ({
            student: s.name.split(' ')[0],
            attendance: s.percentage,
        }));

    return (
        <div className="space-y-6 relative max-w-7xl mx-auto pb-20 p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Corner</h1>
                    <p className="text-muted-foreground">Manage your history and analyze trends</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setIsLeaveModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Apply Leave
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "px-6 py-3 font-medium transition-all border-b-2 text-sm",
                        activeTab === 'history' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Attendance History
                </button>
                <button
                    onClick={() => setActiveTab('analysis')}
                    className={cn(
                        "px-6 py-3 font-medium transition-all border-b-2 text-sm",
                        activeTab === 'analysis' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Advanced Analysis
                </button>
            </div>

            {activeTab === 'history' ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live updates active. Last check: Just now
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-card p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Present</p>
                                    <h3 className="text-3xl font-bold">22 Days</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                                    <XCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Absent</p>
                                    <h3 className="text-3xl font-bold">1 Day</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Percentage</p>
                                    <h3 className="text-3xl font-bold">95.6%</h3>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3 bg-card rounded-xl border shadow-sm overflow-hidden">
                            <div className="p-6 border-b bg-muted/30">
                                <h3 className="font-bold text-lg">{format(today, 'MMMM yyyy')}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted text-xs uppercase text-muted-foreground font-bold">
                                        <tr>
                                            <th className="px-6 py-4 text-left">Date</th>
                                            <th className="px-6 py-4 text-left">Day</th>
                                            <th className="px-6 py-4 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {days.map((day) => {
                                            if (day > today) return null;
                                            const status = getStatus(day);
                                            return (
                                                <tr key={day.toISOString()} className="hover:bg-muted/50 transition-colors">
                                                    <td className="px-6 py-4 font-bold">{format(day, 'dd MMM yyyy')}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{format(day, 'EEEE')}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter', getStatusColor(status))}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                    {/* Analysis Sub-Tabs */}
                    <div className="bg-muted/50 p-2 rounded-xl flex gap-2 w-fit">
                        {[
                            { id: 'overview', label: 'Summary', icon: PieChartIcon },
                            { id: 'individual', label: 'Peer Comparison', icon: Users },
                            { id: 'trends', label: 'Growth Trends', icon: TrendingUp },
                        ].map(subTab => (
                            <button
                                key={subTab.id}
                                onClick={() => setAnalysisView(subTab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                    analysisView === subTab.id ? "bg-white dark:bg-gray-800 shadow-sm text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                )}
                            >
                                <subTab.icon className="w-4 h-4" />
                                {subTab.label}
                            </button>
                        ))}
                    </div>

                    {analysisView === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-card p-6 rounded-2xl border shadow-sm">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <PieChartIcon className="w-6 h-6 text-primary" />
                                    My Distribution
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={overallPieData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {overallPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-card p-6 rounded-2xl border shadow-sm">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-primary" />
                                    Class Performance Benchmarks
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={performanceData}
                                            outerRadius={100}
                                            dataKey="count"
                                        >
                                            {performanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="lg:col-span-2 bg-card p-8 rounded-2xl border shadow-sm">
                                <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-primary">Attendance Radar</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={topPerformers}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="student" />
                                        <PolarRadiusAxis domain={[0, 100]} />
                                        <Radar name="Attendance %" dataKey="attendance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {analysisView === 'individual' && (
                        <div className="space-y-8">
                            <div className="bg-card p-8 rounded-2xl border shadow-sm">
                                <h3 className="text-xl font-bold mb-8">Performance vs Peers</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={studentComparisonData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="present" fill={COLORS.present} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="percentage" fill={COLORS.good} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {analysisView === 'trends' && (
                        <div className="space-y-8">
                            <div className="bg-card p-8 rounded-2xl border shadow-sm">
                                <h3 className="text-xl font-bold mb-8">Attendance Trajectory</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="present" stroke={COLORS.present} strokeWidth={4} dot={{ r: 6 }} name="Present %" />
                                        <Line type="monotone" dataKey="absent" stroke={COLORS.absent} strokeWidth={4} dot={{ r: 6 }} name="Absent %" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Leave Modal stays generic */}
            {isLeaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border-2 p-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">New Leave Request</h2>
                            <button onClick={() => setIsLeaveModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleApplyLeave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground">From</label>
                                    <input type="date" required className="w-full p-3 rounded-xl border bg-background font-medium focus:ring-2 ring-primary transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground">To</label>
                                    <input type="date" required className="w-full p-3 rounded-xl border bg-background font-medium focus:ring-2 ring-primary transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground">Reason</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border bg-background min-h-[120px] font-medium focus:ring-2 ring-primary transition-all"
                                    placeholder="Briefly explain your absence..."
                                    value={leaveReason}
                                    onChange={(e) => setLeaveReason(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsLeaveModalOpen(false)}
                                    className="flex-1 px-4 py-3 text-sm font-bold hover:bg-muted rounded-xl transition-colors border shadow-sm"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    Send Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
