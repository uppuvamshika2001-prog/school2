'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFeeStore } from '@/stores/fee.store';
import {
    Search,
    Filter,
    Download,
    MoreVertical,
    IndianRupee,
    Mail,
    Phone,
    Eye,
    ChevronLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { StudentFeeStatus } from '@/types/fee.types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function StudentFeesPage() {
    const searchParams = useSearchParams();
    const classIdFromUrl = searchParams.get('classId');

    const { studentFees, fetchStudentFees, isLoading } = useFeeStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState(classIdFromUrl || '');

    useEffect(() => {
        fetchStudentFees(selectedClass);
    }, [fetchStudentFees, selectedClass]);

    const filteredStudents = studentFees.filter((s: StudentFeeStatus) =>
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExportLedger = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Exporting student ledger...',
            success: 'Ledger exported successfully (Excel)',
            error: 'Failed to export ledger'
        });
    };

    const handleAction = (type: string, studentName: string) => {
        switch (type) {
            case 'mail':
                toast.success(`Fee reminder sent to ${studentName}`);
                break;
            case 'pay':
                toast.info(`Payment collection initiated for ${studentName}`);
                break;
            case 'more':
                toast.info(`Viewing detailed ledger for ${studentName}`);
                break;
            case 'filter':
                toast.info('Advanced filter options coming soon');
                break;
            default:
                break;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/fees">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Fee Status</h1>
                    <p className="text-muted-foreground">Manage individual student accounts and overdue payments</p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="bg-muted/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-4 max-w-xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or roll number..."
                                    className="pl-10 h-10 border-muted-foreground/20 focus:ring-primary focus:border-primary"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                value={selectedClass}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClass(e.target.value)}
                                className="h-10 px-3 rounded-md border border-muted-foreground/20 bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-shadow"
                            >
                                <option value="">All Blocks</option>
                                <option value="cls-9">Class 9</option>
                                <option value="cls-10">Class 10</option>
                                <option value="cls-11">Class 11</option>
                                <option value="cls-12">Class 12</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 border-muted-foreground/20" onClick={() => handleAction('filter', '')}>
                                <Filter className="h-4 w-4" /> Filters
                            </Button>
                            <Button className="gap-2" onClick={handleExportLedger}>
                                <Download className="h-4 w-4" /> Export Ledger
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30 border-b">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Roll No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Fee</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Paid</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Balance</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y relative">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                )}
                                {filteredStudents.map((s: StudentFeeStatus) => (
                                    <tr key={s.studentId} className="hover:bg-muted/10 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-primary">{s.rollNo}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                                                    {s.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{s.studentName}</p>
                                                    <p className="text-[10px] uppercase text-muted-foreground font-bold">{s.className}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono font-medium">₹{s.totalFee.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm font-mono font-medium text-green-600">₹{s.paidAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-red-600">₹{s.balanceAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge className={`text-[10px] font-black uppercase shadow-sm ${s.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' :
                                                s.status === 'Partial' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                    'bg-red-500 hover:bg-red-600'
                                                }`}>
                                                {s.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleAction('mail', s.studentName)}>
                                                            <Mail className="mr-2 h-4 w-4" /> Send Reminder
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleAction('pay', s.studentName)}>
                                                            <IndianRupee className="mr-2 h-4 w-4" /> Collect Payment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleAction('more', s.studentName)}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Ledger
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                            Cancel Structure
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                            <Search className="h-10 w-10 mx-auto mb-4 opacity-10" />
                                            <p className="font-bold text-lg">No students found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                            <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedClass(''); }}>Clear all filters</Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
