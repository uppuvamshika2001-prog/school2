'use client';

import { FileText, Download, Filter, Calendar, TrendingUp, Users, DollarSign, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const reportStats = [
    { label: 'Total Revenue', value: '₹45,23,000', change: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Avg Attendance', value: '94.2%', change: '+1.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pass Percentage', value: '98.5%', change: '+0.8%', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'New Admissions', value: '145', change: '-5%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const recentReports = [
    { id: 1, name: 'Annual Academic Performance 2024-25', type: 'Academic', date: '2025-12-30', generatedBy: 'Admin', size: '2.4 MB' },
    { id: 2, name: 'Fee Collection Report - Term 1', type: 'Financial', date: '2025-12-28', generatedBy: 'Accounts', size: '1.1 MB' },
    { id: 3, name: 'Monthly Attendance Summary - Dec', type: 'Attendance', date: '2025-12-31', generatedBy: 'System', size: '0.8 MB' },
    { id: 4, name: 'Staff Salary Disbursement - Dec', type: 'Financial', date: '2025-12-25', generatedBy: 'HR Dept', size: '1.5 MB' },
    { id: 5, name: 'Term 1 Exam Resuts Analysis', type: 'Academic', date: '2025-12-15', generatedBy: 'Exam Cell', size: '3.2 MB' },
    { id: 6, name: 'Transport Route Utilization', type: 'Transport', date: '2025-12-10', generatedBy: 'Admin', size: '0.5 MB' },
    { id: 7, name: 'Library Inventory Audit', type: 'Inventory', date: '2025-12-05', generatedBy: 'Librarian', size: '4.1 MB' },
];

const reportCategories = [
    { name: 'Academic Reports', description: 'Exam results, progress cards, student performance analysis.' },
    { name: 'Financial Reports', description: 'Fee collection, expense tracking, salary statements.' },
    { name: 'Attendance Reports', description: 'Student & staff daily attendance, monthly summaries.' },
    { name: 'HR & Payroll', description: 'Staff directory, salary slips, leave records.' },
    { name: 'Inventory & Assets', description: 'Library books, lab equipment, infrastructure audits.' },
    { name: 'Transport', description: 'Route optimization, fuel logs, vehicle maintenance.' },
];

export default function ReportsPage() {
    const handleDownload = (reportName: string) => {
        toast.success(`Downloading ${reportName}...`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">Access and generate comprehensive school reports.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Select Date</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportStats.map((stat, index) => (
                    <div key={index} className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                <p className={`text-xs font-medium mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change} from last month
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Generate New Report Section */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-semibold">Generate Reports</h2>
                    <div className="grid gap-4">
                        {reportCategories.map((category, index) => (
                            <div key={index} className="bg-card p-4 rounded-xl border hover:border-primary/50 cursor-pointer transition-all hover:shadow-sm group">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{category.name}</h3>
                                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                                <button className="text-xs font-medium text-primary hover:underline">Generate New Report →</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Reports Table */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold">Recent Reports</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Report Name</th>
                                        <th className="px-6 py-4 text-left">Type</th>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Generated By</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                {report.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{report.generatedBy}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDownload(report.name)}
                                                    className="inline-flex items-center justify-center p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-primary transition-colors"
                                                    title="Download Report"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
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
    );
}
