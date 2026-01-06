'use client';

import { mockFees } from '@/data/student-mock';
import { Download, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentFeesPage() {
    const handleDownload = (id: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Generating Receipt...',
                success: 'Receipt downloaded successfully',
                error: 'Failed to download'
            }
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
                <p className="text-muted-foreground">View fee history and download receipts</p>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-4 text-left">Receipt ID</th>
                                <th className="px-6 py-4 text-left">Term</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Amount</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {mockFees.map((fee) => (
                                <tr key={fee.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-mono">{fee.id}</td>
                                    <td className="px-6 py-4">{fee.term}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{fee.date}</td>
                                    <td className="px-6 py-4 font-medium">₹{fee.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {fee.status === 'Paid' ? (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 w-fit">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 w-fit">
                                                <Clock className="w-3.5 h-3.5" /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {fee.status === 'Paid' && (
                                            <button
                                                onClick={() => handleDownload(fee.id)}
                                                className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Download Receipt"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        )}
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
