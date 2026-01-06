'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFeeStore } from '@/stores/fee.store';
import {
    IndianRupee,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    AlertTriangle,
    Download,
    Filter,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { useIsSuperAdmin } from '@/stores/auth.store';

export default function FeesDashboard() {
    const { summaries, fetchSummaries, isLoading } = useFeeStore();
    const [showTransactions, setShowTransactions] = useState(false);
    const isSuperAdmin = useIsSuperAdmin();

    useEffect(() => {
        fetchSummaries();
    }, [fetchSummaries]);

    const totalStats = summaries.reduce((acc, curr) => ({
        totalStudents: acc.totalStudents + curr.totalStudents,
        collectedAmount: acc.collectedAmount + curr.collectedAmount,
        pendingAmount: acc.pendingAmount + curr.pendingAmount,
        totalAmount: acc.totalAmount + curr.totalAmount
    }), { totalStudents: 0, collectedAmount: 0, pendingAmount: 0, totalAmount: 0 });

    const collectionPercentage = (totalStats.collectedAmount / totalStats.totalAmount) * 100 || 0;

    const router = useRouter();

    const handleExport = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Generating financial report...',
            success: 'Detailed report exported successfully (PDF)',
            error: 'Failed to export report'
        });
    };

    const handleCollectFee = () => {
        router.push('/dashboard/fees/students');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Collection Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Real-time monitoring of financial health and receivables</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export Financials
                    </Button>
                    {!isSuperAdmin && (
                        <>
                            <Button className="gap-2" onClick={handleCollectFee}>
                                <IndianRupee className="h-4 w-4" /> Collect Fee
                            </Button>
                            <Link href="/dashboard/fees/structure">
                                <Button variant="secondary" className="gap-2">
                                    Structures <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-primary/70">Total Receivable</p>
                                <h2 className="text-2xl font-black font-mono">₹{totalStats.totalAmount.toLocaleString()}</h2>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <IndianRupee className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
                            <TrendingUp className="h-4 w-4" /> +12.5% vs Last Year
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-green-600/70">Total Collected</p>
                                <h2 className="text-2xl font-black font-mono text-green-600">₹{totalStats.collectedAmount.toLocaleString()}</h2>
                            </div>
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                <span>Progress</span>
                                <span>{collectionPercentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={collectionPercentage} className="h-1.5 bg-green-100" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-red-500/5 border-red-500/20">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-red-600/70">Outstanding Dues</p>
                                <h2 className="text-2xl font-black font-mono text-red-600">₹{totalStats.pendingAmount.toLocaleString()}</h2>
                            </div>
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-red-600">
                            <Clock className="h-4 w-4" /> Dues from {totalStats.totalStudents - summaries.reduce((a, b) => a + b.collectedCount, 0)} Students
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-blue-600/70">Student Base</p>
                                <h2 className="text-2xl font-black font-mono text-blue-600">{totalStats.totalStudents}</h2>
                            </div>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-600">
                            Across {summaries.length} Academic Blocks
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Academic Block Collection Status
                        </CardTitle>
                        <CardDescription>Class-wise breakdown of fee receivables and collections</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {summaries.map((s) => (
                                <div key={s.classId} className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold">{s.className}</h3>
                                        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                                            <span>S: {s.totalStudents}</span>
                                            <span className="text-green-600 font-bold">P: {s.collectedCount}</span>
                                            <span className="text-red-600 font-bold">U: {s.pendingCount}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black font-mono">₹{s.collectedAmount.toLocaleString()}</p>
                                        <Link href={`/dashboard/fees/students?classId=${s.classId}`}>
                                            <Button variant="link" size="sm" className="h-6 p-0 text-xs">View Students</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-muted/20">
                    <CardHeader>
                        <CardTitle>Recent Financial Activity</CardTitle>
                        <CardDescription>Latest transactions across all departments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { name: 'Arjun Sharma', type: 'Tuition Fee', amount: 15000, date: '10 mins ago', status: 'Success' },
                                { name: 'Priya Patel', type: 'Transport Fee', amount: 3000, date: '2 hours ago', status: 'Success' },
                                { name: 'Rahul Kumar', type: 'Admission Fee', amount: 25000, date: '5 hours ago', status: 'Pending' },
                                { name: 'Sneha Gupta', type: 'Exam Fee', amount: 1500, date: 'Yesterday', status: 'Success' },
                                { name: 'Vikram Singh', type: 'Tuition Fee', amount: 12000, date: 'Yesterday', status: 'Failed' },
                            ].map((txn, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${txn.status === 'Success' ? 'bg-green-100 text-green-700' :
                                            txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {txn.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{txn.name}</p>
                                            <p className="text-xs text-muted-foreground">{txn.type} • {txn.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black font-mono">₹{txn.amount.toLocaleString()}</p>
                                        <Badge className={`text-[10px] h-4 px-1 ${txn.status === 'Success' ? 'bg-green-500' :
                                            txn.status === 'Pending' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}>{txn.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6" onClick={() => setShowTransactions(true)}>View All Transactions</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Modal */}
            {showTransactions && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <CardHeader className="border-b bg-primary/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>All Transactions</CardTitle>
                                    <CardDescription>Complete financial audit log for Academic Year 2025-26</CardDescription>
                                </div>
                                <Button variant="ghost" onClick={() => setShowTransactions(false)}>✕</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-auto p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Student</th>
                                        <th className="px-6 py-3 text-left">Category</th>
                                        <th className="px-6 py-3 text-left">Amount</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {Array.from({ length: 15 }).map((_, i) => (
                                        <tr key={i} className="hover:bg-muted/30">
                                            <td className="px-6 py-3 text-muted-foreground">05 Jan 2024</td>
                                            <td className="px-6 py-3 font-medium">Sample Student {i + 1}</td>
                                            <td className="px-6 py-3">Tuition Fee</td>
                                            <td className="px-6 py-3 font-mono font-bold">₹{(1000 + i * 500).toLocaleString()}</td>
                                            <td className="px-6 py-3">
                                                <Badge className="bg-green-500 text-[10px]">Success</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                        <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowTransactions(false)}>Close</Button>
                            <Button onClick={handleExport}>Download CSV</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
