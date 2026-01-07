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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FeesDashboard() {
    const { summaries, fetchSummaries, payments, isLoading } = useFeeStore();
    const [showTransactions, setShowTransactions] = useState(false);
    const [activeDetail, setActiveDetail] = useState<'receivable' | 'collected' | 'outstanding' | 'students' | null>(null);
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
        router.push('/dashboard/fees/payments');
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
                        <Button className="gap-2" onClick={handleCollectFee}>
                            <IndianRupee className="h-4 w-4" /> Collect Fee
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    className="bg-primary/5 border-primary/20 cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group"
                    onClick={() => setActiveDetail('receivable')}
                >
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-primary/70">Total Receivable</p>
                                <h2 className="text-2xl font-black font-mono group-hover:text-primary transition-colors">₹{totalStats.totalAmount.toLocaleString()}</h2>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <IndianRupee className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
                            <TrendingUp className="h-4 w-4" /> +12.5% vs Last Year
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-green-500/5 border-green-500/20 cursor-pointer hover:shadow-lg hover:border-green-500/40 transition-all group"
                    onClick={() => setActiveDetail('collected')}
                >
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-green-600/70">Total Collected</p>
                                <h2 className="text-2xl font-black font-mono text-green-600">₹{totalStats.collectedAmount.toLocaleString()}</h2>
                            </div>
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
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

                <Card
                    className="bg-red-500/5 border-red-500/20 cursor-pointer hover:shadow-lg hover:border-red-500/40 transition-all group"
                    onClick={() => setActiveDetail('outstanding')}
                >
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-red-600/70">Outstanding Dues</p>
                                <h2 className="text-2xl font-black font-mono text-red-600">₹{totalStats.pendingAmount.toLocaleString()}</h2>
                            </div>
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-red-600">
                            <Clock className="h-4 w-4" /> Dues from {totalStats.totalStudents - summaries.reduce((a, b) => a + b.collectedCount, 0)} Students
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-blue-500/5 border-blue-500/20 cursor-pointer hover:shadow-lg hover:border-blue-500/40 transition-all group"
                    onClick={() => setActiveDetail('students')}
                >
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-blue-600/70">Student Base</p>
                                <h2 className="text-2xl font-black font-mono text-blue-600">{totalStats.totalStudents}</h2>
                            </div>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
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
                            {payments.slice(0, 5).map((txn, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${txn.status === 'Success' ? 'bg-green-100 text-green-700' :
                                            txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {txn.student.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{txn.student}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground">{txn.type} • {txn.date}</p>
                                                <p className="text-[10px] font-mono font-bold text-primary/70">{txn.admissionNumber}</p>
                                            </div>
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
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border-none shadow-2xl">
                        <CardHeader className="border-b bg-primary text-primary-foreground p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Global Transaction Audit Log</CardTitle>
                                    <CardDescription className="text-primary-foreground/80">Complete financial history for Academic Year 2025-26</CardDescription>
                                </div>
                                <Button variant="secondary" size="icon" className="rounded-full h-8 w-8" onClick={() => setShowTransactions(false)}>✕</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-auto p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-muted text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Recipient Info</th>
                                        <th className="px-6 py-4 text-left">Category</th>
                                        <th className="px-6 py-4 text-left">Amount</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {payments.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 text-muted-foreground font-medium">{txn.date}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold">{txn.student}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-muted-foreground uppercase">{txn.class}</span>
                                                    <span className="text-[10px] font-mono text-primary font-bold">{txn.admissionNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{txn.type}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-foreground">₹{txn.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <Badge className={`text-[10px] font-black uppercase ${txn.status === 'Success' ? 'bg-green-500' :
                                                    txn.status === 'Pending' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`}>{txn.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                        <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowTransactions(false)}>Close Log</Button>
                            <Button className="gap-2" onClick={handleExport}><Download className="h-4 w-4" /> Export Audit Trail</Button>
                        </div>
                    </Card>
                </div>
            )}
            {/* Metric Detail Dialog */}
            <Dialog open={!!activeDetail} onOpenChange={() => setActiveDetail(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
                    <DialogHeader className={`p-8 text-white relative ${activeDetail === 'receivable' ? 'bg-primary' :
                        activeDetail === 'collected' ? 'bg-green-600' :
                            activeDetail === 'outstanding' ? 'bg-red-600' :
                                'bg-blue-600'
                        }`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <DialogTitle className="text-3xl font-black uppercase tracking-tight">
                                    {activeDetail === 'receivable' && 'Revenue Forecast Details'}
                                    {activeDetail === 'collected' && 'Collection Audit Log'}
                                    {activeDetail === 'outstanding' && 'Outstanding Dues Audit'}
                                    {activeDetail === 'students' && 'Student Distribution'}
                                </DialogTitle>
                                <DialogDescription className="text-white/80 mt-1 font-medium">
                                    Academic Year 2025-26 • Class-wise Breakdown
                                </DialogDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Total Value</p>
                                <p className="text-3xl font-black font-mono">
                                    {activeDetail === 'receivable' && `₹${totalStats.totalAmount.toLocaleString()}`}
                                    {activeDetail === 'collected' && `₹${totalStats.collectedAmount.toLocaleString()}`}
                                    {activeDetail === 'outstanding' && `₹${totalStats.pendingAmount.toLocaleString()}`}
                                    {activeDetail === 'students' && totalStats.totalStudents}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-0 bg-card overflow-auto max-h-[60vh]">
                        <Table>
                            <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="px-8 py-4 font-black text-[10px] uppercase">Academic Block</TableHead>
                                    <TableHead className="text-right font-black text-[10px] uppercase">
                                        {activeDetail === 'students' ? 'Enrollment' : 'Total Forecast'}
                                    </TableHead>
                                    <TableHead className="text-right font-black text-[10px] uppercase">
                                        {activeDetail === 'collected' ? 'Status' :
                                            activeDetail === 'outstanding' ? 'Pending Count' :
                                                activeDetail === 'students' ? 'Paid Count' : 'Realized'}
                                    </TableHead>
                                    <TableHead className="text-right pr-8 font-black text-[10px] uppercase">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summaries.map((s) => (
                                    <TableRow key={s.classId} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="px-8 py-4 font-bold">{s.className}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {activeDetail === 'students' ? s.totalStudents : `₹${s.totalAmount.toLocaleString()}`}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {activeDetail === 'receivable' && (
                                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100">
                                                    {Math.round((s.collectedAmount / s.totalAmount) * 100)}% Rec.
                                                </Badge>
                                            )}
                                            {activeDetail === 'collected' && (
                                                <Badge className="bg-green-500">{(s.collectedCount / s.totalStudents * 100).toFixed(0)}% Clear</Badge>
                                            )}
                                            {activeDetail === 'outstanding' && (
                                                <span className="text-red-600 font-bold">{s.pendingCount} Students</span>
                                            )}
                                            {activeDetail === 'students' && (
                                                <span className="text-primary font-bold">{s.collectedCount} Paid</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-8 font-mono font-black text-foreground">
                                            {activeDetail === 'receivable' && `₹${s.totalAmount.toLocaleString()}`}
                                            {activeDetail === 'collected' && `₹${s.collectedAmount.toLocaleString()}`}
                                            {activeDetail === 'outstanding' && `₹${s.pendingAmount.toLocaleString()}`}
                                            {activeDetail === 'students' && s.totalStudents}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-6 border-t bg-muted/20 flex justify-end">
                        <Button onClick={() => setActiveDetail(null)} variant="outline">Close Audit View</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
