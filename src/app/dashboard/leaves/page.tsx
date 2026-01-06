'use client';

import { useEffect, useState } from 'react';
import { useLeaveStore } from '@/stores/leave.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LeaveStatusBadge } from '@/components/leave/LeaveStatusBadge';
import { format } from 'date-fns';
import { Leave } from '@/types/leave';
import { Check, X } from 'lucide-react';

export default function AdminLeavePage() {
    const {
        teacherLeaves,
        fetchTeacherLeaves,
        approveLeave,
        rejectLeave,
        isLoading
    } = useLeaveStore();

    const [rejectDialog, setRejectDialog] = useState<{ isOpen: boolean; leaveId: string | null }>({
        isOpen: false,
        leaveId: null
    });
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchTeacherLeaves();
    }, [fetchTeacherLeaves]);

    const handleRejectClick = (leaveId: string) => {
        setRejectDialog({ isOpen: true, leaveId });
        setRejectionReason('');
    };

    const confirmReject = async () => {
        if (rejectDialog.leaveId && rejectionReason) {
            await rejectLeave(rejectDialog.leaveId, rejectionReason);
            setRejectDialog({ isOpen: false, leaveId: null });
        }
    };

    const LeaveTable = ({ leaves }: { leaves: Leave[] }) => (
        <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[200px]">Name</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Dates</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Reason</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">Status</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                    No leave requests found.
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave) => (
                                <tr key={leave.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{leave.userName}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col text-xs text-muted-foreground">
                                            <span>From: {format(new Date(leave.fromDate), 'PPP')}</span>
                                            <span>To: {format(new Date(leave.toDate), 'PPP')}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle max-w-[300px] truncate" title={leave.reason}>
                                        {leave.reason}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <LeaveStatusBadge status={leave.status} />
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        {leave.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                                    onClick={() => approveLeave(leave.id)}
                                                    title="Approve"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleRejectClick(leave.id)}
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {leave.status === 'REJECTED' && leave.rejectionReason && (
                                            <span className="text-xs text-red-500 italic">" {leave.rejectionReason} "</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                    <p className="text-muted-foreground">Review and manage leave requests from students and teachers.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Teacher Requests</CardTitle>
                    <CardDescription>Manage leave applications from staff</CardDescription>
                </CardHeader>
                <CardContent>
                    <LeaveTable leaves={teacherLeaves} />
                </CardContent>
            </Card>

            <Dialog open={rejectDialog.isOpen} onOpenChange={(open) => setRejectDialog({ isOpen: open, leaveId: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Leave Request</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason for rejection</Label>
                            <Input
                                id="reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="E.g., Exams impending..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialog({ isOpen: false, leaveId: null })}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmReject} disabled={!rejectionReason}>Reject Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
