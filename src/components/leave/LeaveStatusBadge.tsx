import { Badge } from '@/components/ui/badge';
import { LeaveStatus } from '@/types/leave';

interface Props {
    status: LeaveStatus;
}

export function LeaveStatusBadge({ status }: Props) {
    if (status === 'APPROVED') {
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Approved</Badge>;
    }
    if (status === 'REJECTED') {
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Rejected</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
}
