
'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useClassStore } from '@/stores/class.store';
import { toast } from 'sonner';

interface AssignmentDialogProps {
    type: 'TEACHER' | 'MONITOR';
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentId?: string;
    options: { id: string; name: string }[];
}

export function AssignmentDialog({
    type,
    classId,
    className,
    sectionId,
    sectionName,
    isOpen,
    onOpenChange,
    currentId,
    options
}: AssignmentDialogProps) {
    const [selectedId, setSelectedId] = useState(currentId || '');
    const { assignTeacher, assignMonitor, isLoading } = useClassStore();

    const handleAssign = async () => {
        if (!selectedId) return;

        try {
            if (type === 'TEACHER') {
                await assignTeacher(classId, sectionId, selectedId);
                toast.success(`Assigned ${type.toLowerCase()} successfully`);
                onOpenChange(false);
            } else {
                await assignMonitor(classId, sectionId, selectedId);
                toast.success(`Assigned ${type.toLowerCase()} successfully`);
                onOpenChange(false);
            }
        } catch (err) {
            toast.error('Failed to assign');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign {type === 'TEACHER' ? 'Class Teacher' : 'Class Monitor'}</DialogTitle>
                    <DialogDescription>
                        Assign a {type.toLowerCase()} for Class {className}, Section {sectionName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="assignee">Select {type === 'TEACHER' ? 'Teacher' : 'Student'}</Label>
                        <Select value={selectedId} onValueChange={setSelectedId}>
                            <SelectTrigger id="assignee">
                                <SelectValue placeholder={`Choose ${type.toLowerCase()}...`} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleAssign} disabled={isLoading || !selectedId}>
                        Confirm Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
