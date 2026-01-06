'use client';

import { useEffect, useState } from 'react';
import { useLeaveStore } from '@/stores/leave.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LeaveStatusBadge } from '@/components/leave/LeaveStatusBadge';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export default function StudentLeavePage() {
    const {
        myLeaves,
        fetchMyLeaves,
        applyLeave,
        isSubmitting,
        isLoading
    } = useLeaveStore();

    const [date, setDate] = useState<DateRange | undefined>();
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchMyLeaves();
    }, [fetchMyLeaves]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date?.from || !date?.to || !reason) return;

        const success = await applyLeave({
            fromDate: date.from,
            toDate: date.to,
            reason
        }, 'STUDENT');

        if (success) {
            setDate(undefined);
            setReason('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">My Leaves</h1>
                <p className="text-muted-foreground">Apply for new leave or check the status of your requests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Apply Leave Form */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Apply for Leave</CardTitle>
                        <CardDescription>Submit a new leave request</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "LLL dd, y")} -{" "}
                                                        {format(date.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(date.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date range</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={(range) => setDate(range)}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason</Label>
                                <textarea
                                    id="reason"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Briefly explain why you need leave..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting || !date?.from || !date?.to || !reason}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* History Table */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>History</CardTitle>
                        <CardDescription>Your past leave applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b bg-muted/50">
                                    <tr className="border-b transition-colors">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Dates</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Reason</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">Status</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right w-[100px]">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-muted-foreground">Loading...</td>
                                        </tr>
                                    ) : myLeaves.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-muted-foreground">No history found.</td>
                                        </tr>
                                    ) : (
                                        myLeaves.map((leave) => (
                                            <tr key={leave.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle">
                                                    <div className="flex flex-col text-xs text-muted-foreground">
                                                        <span>{format(new Date(leave.fromDate), 'MMM d, yyyy')}</span>
                                                        <span className="text-center font-bold">to</span>
                                                        <span>{format(new Date(leave.toDate), 'MMM d, yyyy')}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle max-w-[200px] truncate" title={leave.reason}>
                                                    {leave.reason}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <LeaveStatusBadge status={leave.status} />
                                                </td>
                                                <td className="p-4 align-middle text-right text-xs text-red-500 italic">
                                                    {leave.rejectionReason || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
