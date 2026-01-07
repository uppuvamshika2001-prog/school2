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
    IndianRupee,
    Printer,
    FileText,
    User,
    Calendar,
    CreditCard
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useFeeStore } from '@/stores/fee.store';
import { useIsSuperAdmin } from '@/stores/auth.store';

export default function FeePaymentsPage() {
    const isSuperAdmin = useIsSuperAdmin();
    const { payments, collectPayment, studentFees, fetchStudentFees } = useFeeStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showCollectDialog, setShowCollectDialog] = useState(false);

    // Form state for collection
    const [formData, setFormData] = useState({
        studentName: '',
        admissionNumber: '',
        class: '',
        feeType: 'Tuition Fee',
        amount: '',
        mode: 'Cash',
        status: 'Success',
        date: new Date().toISOString().split('T')[0],
        utrNumber: '',
        chequeNumber: '',
        bankName: ''
    });

    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (studentFees.length === 0) {
            fetchStudentFees();
        }
    }, [fetchStudentFees, studentFees.length]);

    const handleStudentNameChange = (query: string) => {
        setFormData({ ...formData, studentName: query });
        if (query.length > 1) {
            const suggestions = studentFees.filter(s =>
                s.studentName.toLowerCase().includes(query.toLowerCase()) ||
                s.admissionNumber.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStudents(suggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectStudent = (student: any) => {
        setFormData({
            ...formData,
            studentName: student.studentName,
            admissionNumber: student.admissionNumber,
            class: student.className,
            utrNumber: '',
            chequeNumber: '',
            bankName: ''
        });
        setShowSuggestions(false);
    };

    const filteredPayments = payments.filter(p =>
        p.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    const handleAction = (type: string, id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        switch (type) {
            case 'view':
                const payment = payments.find(p => p.id === id);
                if (payment) {
                    setSelectedPayment(payment);
                    setShowDetails(true);
                }
                break;
            case 'refund':
                toast.error(`Refund request initiated for ${id}`);
                break;
            case 'print':
            case 'download':
                const p = payments.find(p => p.id === id);
                if (p) {
                    setSelectedPayment(p);
                    // Short delay to ensure state is updated before printing
                    setTimeout(() => {
                        window.print();
                    }, 100);
                }
                break;
            default:
                break;
        }
    };

    const handleRowClick = (payment: any) => {
        setSelectedPayment(payment);
        setShowDetails(true);
    };

    const handleCollectSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.studentName) {
            toast.error('Student Name is required');
            return;
        }
        if (!formData.admissionNumber) {
            toast.error('Admission Number is required');
            return;
        }
        if (!formData.amount) {
            toast.error('Amount is required');
            return;
        }
        if (!formData.class) {
            toast.error('Class/Block is required');
            return;
        }

        if (formData.mode === 'Online' && !formData.utrNumber) {
            toast.error('UTR Number is mandatory for online payments');
            return;
        }

        if (formData.mode === 'Cheque' && (!formData.chequeNumber || !formData.bankName)) {
            toast.error('Cheque Number and Bank Name are mandatory for cheque payments');
            return;
        }

        collectPayment({
            student: formData.studentName,
            admissionNumber: formData.admissionNumber,
            class: formData.class,
            type: formData.feeType,
            amount: parseFloat(formData.amount),
            date: formData.date,
            mode: formData.mode,
            status: formData.status as any,
            utrNumber: formData.utrNumber,
            chequeNumber: formData.chequeNumber,
            bankName: formData.bankName
        });

        setShowCollectDialog(false);
        setFormData({
            studentName: '',
            admissionNumber: '',
            class: '',
            feeType: 'Tuition Fee',
            amount: '',
            mode: 'Cash',
            status: 'Success',
            date: new Date().toISOString().split('T')[0],
            utrNumber: '',
            chequeNumber: '',
            bankName: ''
        });

        toast.success(`Payment of ₹${formData.amount} collected for ${formData.studentName}`);
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
                    {!isSuperAdmin && (
                        <button
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium shadow-sm"
                            onClick={() => setShowCollectDialog(true)}
                        >
                            <IndianRupee className="w-4 h-4" />
                            <span>Collect Fee</span>
                        </button>
                    )}
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
                                <tr
                                    key={payment.id}
                                    className="hover:bg-primary/5 cursor-pointer transition-colors group"
                                    onClick={() => handleRowClick(payment)}
                                >
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-primary">{payment.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold">{payment.student}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase font-black text-muted-foreground">{payment.class}</span>
                                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                <span className="text-[10px] font-mono text-primary font-bold">{payment.admissionNumber}</span>
                                            </div>
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
                                                <button
                                                    className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Receipt Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={(e) => handleAction('view', payment.id, e)}>
                                                    View Receipt
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => handleAction('print', payment.id, e)}>
                                                    Print Copy
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => handleAction('download', payment.id, e)}>
                                                    Download PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={(e) => handleAction('refund', payment.id, e)}
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

            {/* Payment Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
                    <DialogHeader className="p-8 bg-primary text-primary-foreground relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-white/20 text-white border-none text-[10px] uppercase tracking-widest font-black">
                                    Official Receipt
                                </Badge>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-black bg-white/10 ${selectedPayment?.status === 'Success' ? 'text-green-300' :
                                    selectedPayment?.status === 'Pending' ? 'text-yellow-300' : 'text-red-300'
                                    }`}>
                                    {selectedPayment?.status === 'Success' && <CheckCircle2 className="w-3 h-3" />}
                                    {selectedPayment?.status}
                                </span>
                            </div>
                            <DialogTitle className="text-3xl font-black font-mono">
                                ₹{selectedPayment?.amount.toLocaleString()}
                            </DialogTitle>
                            <DialogDescription className="text-primary-foreground/80 font-medium mt-1">
                                {selectedPayment?.type} • {selectedPayment?.id} •
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] uppercase font-black bg-white ${selectedPayment?.status === 'Success' ? 'text-green-600' :
                                    selectedPayment?.status === 'Pending' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                    {selectedPayment?.status}
                                </span>
                            </DialogDescription>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    </DialogHeader>

                    <div className="p-8 space-y-8 bg-card max-h-[70vh] overflow-y-auto">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2 tracking-widest">
                                        <User className="w-3 h-3" /> Student Details
                                    </p>
                                    <p className="text-sm font-bold">{selectedPayment?.student}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black uppercase text-primary bg-primary/5 inline-block px-1.5 py-0.5 rounded">
                                            {selectedPayment?.class}
                                        </p>
                                        <p className="text-[10px] font-mono font-bold text-muted-foreground">
                                            {selectedPayment?.admissionNumber}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2 tracking-widest">
                                        <Calendar className="w-3 h-3" /> Payment Date
                                    </p>
                                    <p className="text-sm font-bold text-foreground">
                                        {selectedPayment?.date}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2 tracking-widest">
                                        <CreditCard className="w-3 h-3" /> Payment Mode
                                    </p>
                                    <p className="text-sm font-bold">{selectedPayment?.mode}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2 tracking-widest">
                                        <FileText className="w-3 h-3" /> Reference / Details
                                    </p>
                                    <p className="text-sm font-mono font-bold text-primary">
                                        {selectedPayment?.mode === 'Online' ? `UTR: ${selectedPayment.utrNumber}` :
                                            selectedPayment?.mode === 'Cheque' ? `CHQ: ${selectedPayment.chequeNumber} (${selectedPayment.bankName})` :
                                                `TXN-${selectedPayment?.id.split('-').pop()}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment History Section */}
                        <div className="pt-6 border-t space-y-4">
                            <p className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2 tracking-widest mb-4">
                                <Clock className="w-3 h-3" /> Payment History for {selectedPayment?.student.split(' ')[0]}
                            </p>
                            <div className="space-y-3">
                                {payments
                                    .filter(p => p.student === selectedPayment?.student && p.id !== selectedPayment?.id)
                                    .length > 0 ? (
                                    payments
                                        .filter(p => p.student === selectedPayment?.student && p.id !== selectedPayment?.id)
                                        .map((p, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-background rounded-lg border shadow-sm">
                                                        <FileText className="w-3 h-3 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold">{p.type}</p>
                                                        <p className="text-[10px] text-muted-foreground font-medium">{p.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black font-mono">₹{p.amount.toLocaleString()}</p>
                                                    <p className={`text-[9px] font-black uppercase ${p.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>{p.status}</p>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-center py-6 border rounded-xl bg-muted/10 border-dashed">
                                        <p className="text-xs text-muted-foreground font-medium italic">No other payments recorded for this academic period.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Remarks/Notes */}
                        <div className="pt-6 border-t space-y-3">
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Description & Remarks</p>
                            <div className="bg-muted/30 p-4 rounded-xl text-xs leading-relaxed text-muted-foreground font-medium border border-dashed">
                                Payment for <span className="text-foreground font-bold">{selectedPayment?.type}</span> has been processed successfully.
                                {selectedPayment?.mode === 'Online' ? ' The transaction was verified through our digital gateway.' : ' Verification completed via manual entry.'}
                                All academic dues for this specific category are now cleared.
                            </div>
                        </div>

                        {/* Professional Note/Footer */}
                        <div className="pt-6 border-t space-y-4">
                            <div className="bg-muted/30 p-4 rounded-xl border border-dashed flex items-start gap-3">
                                <div className="p-2 bg-background rounded-lg text-muted-foreground shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Printer className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Official Document</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        This is a computer-generated receipt. You can print this for your personal records or as proof of payment. For any discrepancies, please contact the accounts office.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button className="flex-1 gap-2 h-11" onClick={() => handleAction('print', selectedPayment?.id)}>
                                    <Printer className="w-4 h-4" /> Print Receipt
                                </Button>
                                <Button variant="outline" className="flex-1 gap-2 h-11" onClick={() => handleAction('download', selectedPayment?.id)}>
                                    <Download className="w-4 h-4" /> Save as PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showCollectDialog} onOpenChange={setShowCollectDialog}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
                    <DialogHeader className="p-6 bg-primary text-primary-foreground">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <IndianRupee className="h-5 w-5" /> Collect Fee Payment
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/80">
                            Enter the details below to record a new fee payment.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCollectSubmit} className="flex flex-col min-h-0 bg-card">
                        <div className="p-6 space-y-4 overflow-y-auto overflow-x-hidden max-h-[60vh] custom-scrollbar">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Student Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="Search by name..."
                                                value={formData.studentName}
                                                onChange={(e) => handleStudentNameChange(e.target.value)}
                                                autoComplete="off"
                                            />
                                            {showSuggestions && filteredStudents.length > 0 && (
                                                <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-xl max-h-40 overflow-auto">
                                                    {filteredStudents.map((s) => (
                                                        <div
                                                            key={s.studentId}
                                                            className="px-3 py-2 text-xs hover:bg-primary/5 cursor-pointer flex justify-between items-center group border-b last:border-0"
                                                            onClick={() => selectStudent(s)}
                                                        >
                                                            <div>
                                                                <p className="font-bold">{s.studentName}</p>
                                                                <p className="text-[9px] font-mono text-primary-foreground bg-primary px-1 rounded inline-block mt-0.5">{s.admissionNumber}</p>
                                                            </div>
                                                            <span className="text-[10px] uppercase text-muted-foreground group-hover:text-primary font-black">{s.className}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Admission Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="e.g. 2024-AD-001"
                                                value={formData.admissionNumber}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData({ ...formData, admissionNumber: val });
                                                    if (val.length > 2) {
                                                        const suggestions = studentFees.filter(s =>
                                                            s.admissionNumber.toLowerCase().includes(val.toLowerCase()) ||
                                                            s.studentName.toLowerCase().includes(val.toLowerCase())
                                                        );
                                                        setFilteredStudents(suggestions);
                                                        setShowSuggestions(true);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Class/Block</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-primary bg-primary/5 border-primary/20"
                                            placeholder="e.g. 10-A"
                                            value={formData.class}
                                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Fee Type</label>
                                    <select
                                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-background"
                                        value={formData.feeType}
                                        onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                                    >
                                        <option>Tuition Fee</option>
                                        <option>Science Lab Fee</option>
                                        <option>Transport Fee</option>
                                        <option>Annual Fee</option>
                                        <option>Library Fine</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Amount (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-dashed">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Payment Method</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Cash', 'Online', 'Cheque'].map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mode: m })}
                                                className={`py-2 px-4 text-xs font-bold rounded-lg border transition-all ${formData.mode === m
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                    : 'bg-background hover:bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Conditional Fields */}
                                    {formData.mode === 'Online' && (
                                        <div className="pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="text-[10px] uppercase font-black text-primary tracking-widest mb-1 block">UTR Number (Mandatory)</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 text-sm border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background font-mono"
                                                    placeholder="Enter Transaction ID/UTR..."
                                                    value={formData.utrNumber}
                                                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                                                    required
                                                />
                                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50" />
                                            </div>
                                        </div>
                                    )}

                                    {formData.mode === 'Cheque' && (
                                        <div className="pt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-black text-primary tracking-widest block">Cheque No.</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 text-sm border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background font-mono"
                                                        placeholder="6 digits"
                                                        value={formData.chequeNumber}
                                                        onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-black text-primary tracking-widest block">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 text-sm border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-background"
                                                        placeholder="e.g. HDFC"
                                                        value={formData.bankName}
                                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-muted/10 flex gap-3 shrink-0">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1"
                                onClick={() => setShowCollectDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 gap-2"
                            >
                                <CheckCircle2 className="h-4 w-4" /> Confirm Payment
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Printable Receipt Area - Hidden by default, visible only via @media print */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8" id="printable-receipt">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body * { visibility: hidden; }
                        #printable-receipt, #printable-receipt * { visibility: visible; }
                        #printable-receipt { 
                            position: absolute; 
                            left: 0; 
                            top: 0; 
                            width: 100%; 
                            background: white !important;
                        }
                        @page { size: auto; margin: 0mm; }
                    }
                `}} />

                <div className="max-w-[800px] mx-auto border-2 border-black p-8 bg-white text-black">
                    <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black uppercase tracking-tighter">EXCELLENCE PUBLIC SCHOOL</h1>
                            <p className="text-xs font-bold uppercase">123 Education Hub, Knowledge Park, India</p>
                            <p className="text-xs font-bold uppercase">Phone: +91 98765 43210 | Email: accounts@eps.edu</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-black bg-black text-white px-4 py-1 inline-block mb-2">FEE RECEIPT</h2>
                            <div className="flex flex-col items-end">
                                <p className="text-sm font-mono font-bold tracking-widest">{selectedPayment?.id}</p>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mt-1 ${selectedPayment?.status === 'Success' ? 'bg-green-100 text-green-700' :
                                    selectedPayment?.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    Status: {selectedPayment?.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedPayment?.status !== 'Success' && (
                        <div className="mb-6 p-4 border-4 border-double rounded text-center font-black uppercase tracking-[0.2em]">
                            {selectedPayment?.status === 'Pending' ? (
                                <div className="text-yellow-600 bg-yellow-50">
                                    <p className="text-lg">PAYMENT PENDING</p>
                                    <p className="text-[8px] mt-1 italic">Note: This receipt is temporary until payment clearance.</p>
                                </div>
                            ) : (
                                <div className="text-red-600 bg-red-50">
                                    <p className="text-lg">PAYMENT FAILED / VOID</p>
                                    <p className="text-[8px] mt-1 italic">Note: This receipt is invalid and cannot be used for official purposes.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-12 mb-8">
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-500">Student Name</p>
                                <p className="text-lg font-black uppercase">{selectedPayment?.student}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-500">Admission Number</p>
                                <p className="text-sm font-mono font-bold">{selectedPayment?.admissionNumber}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-right">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-500">Class / Block</p>
                                <p className="text-sm font-black uppercase">{selectedPayment?.class}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-500">Receipt Date</p>
                                <p className="text-sm font-bold">{selectedPayment?.date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-b border-black py-4 mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black uppercase border-b border-black/10">
                                    <th className="py-2 text-left">Description</th>
                                    <th className="py-2 text-left">Category</th>
                                    <th className="py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-sm font-bold">
                                    <td className="py-4">Payment towards {selectedPayment?.type}</td>
                                    <td className="py-4">Tuition / Academic</td>
                                    <td className="py-4 text-right font-mono text-lg">₹{selectedPayment?.amount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-black">
                                    <td colSpan={2} className="py-4 text-right font-black uppercase text-sm">Grand Total</td>
                                    <td className="py-4 text-right font-black font-mono text-xl">₹{selectedPayment?.amount.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="p-4 bg-gray-50 border border-black/10 rounded">
                            <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Payment Mode</p>
                            <p className="text-xs font-bold uppercase">{selectedPayment?.mode}</p>
                            {selectedPayment?.mode === 'Online' && <p className="text-xs font-mono font-bold mt-1">UTR: {selectedPayment.utrNumber}</p>}
                            {selectedPayment?.mode === 'Cheque' && <p className="text-xs font-mono font-bold mt-1">CHQ: {selectedPayment.chequeNumber} ({selectedPayment.bankName})</p>}
                        </div>
                        <div className="flex flex-col justify-end text-right">
                            <div className="h-16 w-32 border-b border-black ml-auto mb-2 opacity-20"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Authorized Signatory</p>
                        </div>
                    </div>

                    <div className="text-center pt-8 border-t border-black/10">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                            This is a system generated receipt and does not require a physical signature.
                        </p>
                        <p className="text-[9px] font-bold uppercase text-gray-400">
                            Generated on {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
