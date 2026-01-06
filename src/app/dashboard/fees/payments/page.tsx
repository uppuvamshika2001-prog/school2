'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    Filter,
    Download,
    MoreVertical,
    IndianRupee
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function FeePaymentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const payments = [
        { id: 'RCP-2024-001', student: 'Aarav Patel', class: '10-A', type: 'Tuition Fee (Jan)', amount: 5500, date: '2024-01-02', mode: 'Online', status: 'Success' },
        { id: 'RCP-2024-002', student: 'Diya Sharma', class: '9-B', type: 'Tuition Fee (Jan)', amount: 5500, date: '2024-01-02', mode: 'Cash', status: 'Success' },
        { id: 'RCP-2024-003', student: 'Vihaan Kumar', class: '12-A', type: 'Science Lab Fee', amount: 12000, date: '2024-01-01', mode: 'Online', status: 'Pending' },
        { id: 'RCP-2024-004', student: 'Ananya Singh', class: '8-C', type: 'Transport Fee (Q4)', amount: 4500, date: '2023-12-31', mode: 'Cheque', status: 'Success' },
        { id: 'RCP-2024-005', student: 'Rohan Gupta', class: '11-B', type: 'Tuition Fee (Jan)', amount: 6500, date: '2023-12-30', mode: 'Online', status: 'Failed' },
        { id: 'RCP-2024-006', student: 'Myra Reddy', class: '5-A', type: 'Annual Fee', amount: 25000, date: '2023-12-28', mode: 'Bank Transfer', status: 'Success' },
        { id: 'RCP-2024-007', student: 'Arjun Nair', class: '7-B', type: 'Tuition Fee (Jan)', amount: 4500, date: '2023-12-28', mode: 'Online', status: 'Success' },
        { id: 'RCP-2024-008', student: 'Ishaan Verma', class: '10-C', type: 'Library Fine', amount: 150, date: '2023-12-27', mode: 'Cash', status: 'Success' },
    ];

    const filteredPayments = payments.filter(p =>
        p.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-bold';
            case 'Failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleExport = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Generating payment report...',
            success: 'Payments report exported successfully',
            error: 'Failed to export'
        });
    };

    const handleAction = (type: string, id: string) => {
        switch (type) {
            case 'view':
                toast.info(`Opening receipt ${id}`);
                break;
            case 'refund':
                toast.error(`Refund request initiated for ${id}`);
                break;
            case 'print':
                toast.success(`Sending ${id} to printer...`);
                break;
            default:
                break;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Payments</h1>
                    <p className="text-muted-foreground mt-1">Track and manage student fee transactions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 font-medium"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium shadow-sm">
                        <IndianRupee className="w-4 h-4" />
                        <span>Collect Fee</span>
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/20 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by student, ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-muted-foreground/20"
                        />
                    </div>
                    <button className="p-2 border rounded-lg hover:bg-muted transition-colors border-muted-foreground/20" onClick={() => toast.info('Advanced filters coming soon')}>
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground font-black tracking-widest border-b">
                            <tr>
                                <th className="px-6 py-4 text-left">Receipt ID</th>
                                <th className="px-6 py-4 text-left">Student Info</th>
                                <th className="px-6 py-4 text-left">Fee Type</th>
                                <th className="px-6 py-4 text-left">Amount</th>
                                <th className="px-6 py-4 text-left">Mode</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-primary">{payment.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold">{payment.student}</p>
                                            <p className="text-[10px] uppercase font-black text-muted-foreground">{payment.class}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{payment.type}</td>
                                    <td className="px-6 py-4 font-mono font-bold">₹{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 border rounded-md text-[10px] uppercase font-black bg-muted/50">
                                            {payment.mode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground font-medium">{payment.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${getStatusColor(payment.status)}`}>
                                            {payment.status === 'Success' && <CheckCircle2 className="w-3 h-3" />}
                                            {payment.status === 'Pending' && <Clock className="w-3 h-3" />}
                                            {payment.status === 'Failed' && <XCircle className="w-3 h-3" />}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Receipt Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleAction('view', payment.id)}>
                                                    View Receipt
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('print', payment.id)}>
                                                    Print Copy
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('download', payment.id)}>
                                                    Download PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={() => handleAction('refund', payment.id)}
                                                >
                                                    Initiate Refund
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                        <Search className="w-10 h-10 mx-auto mb-4 opacity-10" />
                                        <p className="font-bold text-lg">No transactions found</p>
                                        <p className="text-sm">Try searching with a different receipt ID or student name</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
