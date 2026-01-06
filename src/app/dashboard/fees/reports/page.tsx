'use client';

import { BarChart3, TrendingUp, TrendingDown, AlertCircle, Download, Calendar, Filter, IndianRupee } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const sixMonthData = [
    { month: 'Jul', amount: 1200000 },
    { month: 'Aug', amount: 1800000 },
    { month: 'Sep', amount: 1500000 },
    { month: 'Oct', amount: 2200000 },
    { month: 'Nov', amount: 2800000 },
    { month: 'Dec', amount: 3500000 },
];

const yearlyData = [
    { month: 'Apr', amount: 4500000 },
    { month: 'May', amount: 3200000 },
    { month: 'Jun', amount: 2800000 },
    { month: 'Jul', amount: 1200000 },
    { month: 'Aug', amount: 1800000 },
    { month: 'Sep', amount: 1500000 },
    { month: 'Oct', amount: 2200000 },
    { month: 'Nov', amount: 2800000 },
    { month: 'Dec', amount: 3500000 },
    { month: 'Jan', amount: 4100000 },
    { month: 'Feb', amount: 3800000 },
    { month: 'Mar', amount: 5000000 },
];

export default function FeeReportsPage() {
    const [mounted, setMounted] = useState(false);
    const [timeframe, setTimeframe] = useState<'6m' | 'year'>('6m');

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeData = timeframe === '6m' ? sixMonthData : yearlyData;

    const stats = [
        { label: 'Total Expected', value: 25000000, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Total Collected', value: 18500000, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { label: 'Pending Dues', value: 6500000, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
        { label: 'Scholarships', value: 500000, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    ];

    const defaulters = [
        { id: 'STU005', name: 'Rohan Gupta', class: '11-B', amount: 35000, months: 3, lastPayment: '2023-09-15', parent: 'Sanjay Gupta', phone: '+91 98765 43210' },
        { id: 'STU012', name: 'Kavya Singh', class: '8-A', amount: 12500, months: 2, lastPayment: '2023-10-10', parent: 'Vikram Singh', phone: '+91 98765 43211' },
        { id: 'STU023', name: 'Kabir Das', class: '10-C', amount: 8500, months: 1, lastPayment: '2023-11-05', parent: 'Amit Das', phone: '+91 98765 43212' },
        { id: 'STU045', name: 'Meera Iyer', class: '5-B', amount: 4500, months: 1, lastPayment: '2023-11-15', parent: 'Rahul Iyer', phone: '+91 98765 43213' },
        { id: 'STU056', name: 'Aryan Khan', class: '9-A', amount: 15500, months: 2, lastPayment: '2023-10-20', parent: 'Sameer Khan', phone: '+91 98765 43214' },
    ];

    const handleDownloadReport = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Compiling financial reports...',
            success: 'Full financial report downloaded (PDF)',
            error: 'Failed to generate report'
        });
    };

    const handleReminder = (name: string) => {
        toast.success(`Defaulter reminder sent to ${name}'s parent.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Analyze fee collection and outstanding dues.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border rounded-lg hover:bg-muted text-sm flex items-center gap-2 font-medium transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span>This Academic Year</span>
                    </button>
                    <button
                        onClick={handleDownloadReport}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm flex items-center gap-2 font-medium shadow-sm transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Report</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-xl border shadow-sm group hover:border-primary/50 transition-all">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                        <div className="flex items-center gap-3 mt-3">
                            <div className={`p-3 rounded-lg ${stat.bg} shadow-inner`}>
                                <IndianRupee className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <h3 className="text-2xl font-black font-mono tracking-tight">{formatCurrency(stat.value)}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b bg-muted/10 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg">Fee Collection Trend</h3>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Monthly collection overview</p>
                        </div>
                        <select
                            className="text-xs font-bold border rounded-md p-1.5 bg-background focus:ring-2 focus:ring-primary outline-none"
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value as '6m' | 'year')}
                        >
                            <option value="6m">Last 6 Months</option>
                            <option value="year">Full Academic Year</option>
                        </select>
                    </div>
                    <div className="p-6 flex-1 min-h-[300px] w-full bg-muted/5">
                        {mounted ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                                        tickFormatter={(value) => `₹${value / 100000}L`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            fontWeight: 'bold'
                                        }}
                                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Collection']}
                                    />
                                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={timeframe === '6m' ? 40 : 25}>
                                        {activeData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === activeData.length - 1 ? '#0F172A' : '#3B82F6'}
                                                fillOpacity={0.8}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <BarChart3 className="w-16 h-16 mb-4 text-primary/20 animate-pulse" />
                                <p className="font-black uppercase tracking-[0.2em] text-xs">Initialization...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b bg-muted/10">
                        <h3 className="font-bold text-lg">Collection by Mode</h3>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Payment method distribution</p>
                    </div>
                    <div className="p-6 space-y-5">
                        {[
                            { mode: 'Online Transfer', percentage: 45, color: 'bg-blue-500' },
                            { mode: 'Cheque', percentage: 25, color: 'bg-purple-500' },
                            { mode: 'Cash', percentage: 20, color: 'bg-green-500' },
                            { mode: 'UPI', percentage: 10, color: 'bg-orange-500' },
                        ].map((item) => (
                            <div key={item.mode} className="group">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="font-bold uppercase tracking-tight">{item.mode}</span>
                                    <span className="font-black text-primary">{item.percentage}%</span>
                                </div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full ${item.color} transition-all duration-1000 group-hover:brightness-110 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: `${item.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-muted/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="font-bold text-lg text-red-600">Top Defaulters</h3>
                    </div>
                    <button className="text-xs font-black uppercase tracking-wider text-primary hover:underline underline-offset-4" onClick={() => toast.info('Navigating to full defaulter list...')}>View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground font-black tracking-widest border-b">
                            <tr>
                                <th className="px-6 py-4 text-left">Student Info</th>
                                <th className="px-6 py-4 text-left">Parent Details</th>
                                <th className="px-6 py-4 text-left">Pending Amount</th>
                                <th className="px-6 py-4 text-left">Due Since</th>
                                <th className="px-6 py-4 text-left">Last Payment</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {defaulters.map((stu) => (
                                <tr key={stu.id} className="hover:bg-red-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold">{stu.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black">{stu.class} • {stu.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold">{stu.parent}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{stu.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black font-mono text-red-600 text-base">{formatCurrency(stu.amount)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 shadow-sm">
                                            {stu.months} Months
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground font-medium">{stu.lastPayment}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleReminder(stu.name)}
                                            className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 shadow-sm transition-all active:scale-95"
                                        >
                                            Send Reminder
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
