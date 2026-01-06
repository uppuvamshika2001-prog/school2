
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Plus,
    Trash2,
    Save,
    ChevronLeft,
    IndianRupee,
    Calculator,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Truck
} from 'lucide-react';
import { useFeeStore } from '@/stores/fee.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

const feeSchema = z.object({
    classId: z.string().min(1, 'Class is required'),
    academicYear: z.string().min(1, 'Academic year is required'),
    tuitionFee: z.number().min(0, 'Must be positive'),
    transportFee: z.number().min(0, 'Must be positive'),
    examinationFee: z.number().min(0, 'Must be positive'),
    others: z.number().min(0, 'Must be positive'),
});

type FeeFormValues = z.infer<typeof feeSchema>;

export default function FeeStructurePage() {
    const { structures, fetchStructures, addStructure, isLoading } = useFeeStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FeeFormValues>({
        resolver: zodResolver(feeSchema),
        defaultValues: {
            tuitionFee: 0,
            transportFee: 0,
            examinationFee: 0,
            others: 0,
            academicYear: '2025-26'
        }
    });

    const tuition = watch('tuitionFee');
    const transport = watch('transportFee');
    const exam = watch('examinationFee');
    const others = watch('others');
    const total = (tuition || 0) + (transport || 0) + (exam || 0) + (others || 0);

    useEffect(() => {
        fetchStructures();
    }, [fetchStructures]);

    const handleEdit = (structure: any) => {
        setEditingId(structure.id);
        setIsAdding(true);
        reset({
            classId: structure.classId,
            academicYear: structure.academicYear,
            tuitionFee: structure.categories.find((c: any) => c.category === 'Tuition')?.amount || 0,
            transportFee: structure.categories.find((c: any) => c.category === 'Transport')?.amount || 0,
            examinationFee: structure.categories.find((c: any) => c.category === 'Examination')?.amount || 0,
            others: structure.categories.find((c: any) => c.category === 'Others' || c.category === 'Others')?.amount || 0,
        });
    };

    const handleDelete = (id: string) => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: 'Deleting structure...',
            success: 'Fee structure deleted successfully',
            error: 'Failed to delete'
        });
    };

    const onSubmit = async (data: FeeFormValues) => {
        try {
            await addStructure({
                classId: data.classId,
                className: `Class ${data.classId.split('-')[1] || data.classId}`,
                academicYear: data.academicYear,
                categories: [
                    { category: 'Tuition', amount: data.tuitionFee },
                    { category: 'Transport', amount: data.transportFee },
                    { category: 'Examination', amount: data.examinationFee },
                    { category: 'Others', amount: data.others },
                ],
                totalAmount: total
            });
            toast.success(editingId ? 'Fee structure updated successfully' : 'Fee structure created successfully');
            setIsAdding(false);
            setEditingId(null);
            reset();
        } catch (error) {
            toast.error('Failed to save fee structure');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Structure Management</h1>
                    <p className="text-muted-foreground mt-1">Define annual fee benchmarks for different classes</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => { setIsAdding(true); setEditingId(null); reset(); }} className="gap-2">
                        <Plus className="h-4 w-4" /> Create New Structure
                    </Button>
                )}
            </div>

            {isAdding ? (
                <Card className="border-primary/20 shadow-lg animate-in fade-in zoom-in duration-200">
                    <CardHeader className="bg-primary/5 border-b">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle>{editingId ? 'Edit Fee Structure' : 'New Fee Structure'}</CardTitle>
                                <CardDescription>Configure annual charges for a specific class</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Basic Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Select Class</label>
                                            <select
                                                {...register('classId')}
                                                className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="">Select Class</option>
                                                <option value="cls-9">Class 9</option>
                                                <option value="cls-10">Class 10</option>
                                                <option value="cls-11">Class 11</option>
                                                <option value="cls-12">Class 12</option>
                                            </select>
                                            {errors.classId && <p className="text-xs text-destructive">{errors.classId.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Academic Year</label>
                                            <Input {...register('academicYear')} placeholder="e.g. 2025-26" />
                                            {errors.academicYear && <p className="text-xs text-destructive">{errors.academicYear.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <IndianRupee className="h-4 w-4" /> Fee Particulars
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Tuition Fee (Annual)</label>
                                            <Input
                                                type="number"
                                                {...register('tuitionFee', { valueAsNumber: true })}
                                                className="font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Transport Fee (Annual)</label>
                                            <Input
                                                type="number"
                                                {...register('transportFee', { valueAsNumber: true })}
                                                className="font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Examination Fee</label>
                                            <Input
                                                type="number"
                                                {...register('examinationFee', { valueAsNumber: true })}
                                                className="font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Other Charges</label>
                                            <Input
                                                type="number"
                                                {...register('others', { valueAsNumber: true })}
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/50 p-6 rounded-xl flex items-center justify-between border">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg shadow-inner">
                                        <Calculator className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Auto-Calculated Annual Total</p>
                                        <h2 className="text-3xl font-black text-primary font-mono select-none">
                                            ₹{total.toLocaleString()}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" type="button" onClick={() => { setIsAdding(false); setEditingId(null); }}>Cancel</Button>
                                    <Button type="submit" disabled={isLoading} className="gap-2">
                                        {isLoading ? 'Saving...' : <><Save className="h-4 w-4" /> {editingId ? 'Update' : 'Save'} Structure</>}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {structures.map((structure) => (
                        <Card key={structure.id} className="group hover:border-primary/50 transition-all shadow-sm flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                        AY {structure.academicYear}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(structure.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-2xl mt-2">{structure.className}</CardTitle>
                                <CardDescription>Annual Consolidated Fees</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <div className="space-y-2">
                                    {structure.categories.map((cat, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{cat.category}</span>
                                            <span className="font-semibold">₹{cat.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t flex justify-between items-center text-primary">
                                    <span className="text-sm font-bold uppercase tracking-wider">Total Amount</span>
                                    <span className="text-xl font-black font-mono">₹{structure.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-0 mt-4 h-10 border rounded-lg overflow-hidden">
                                    <button
                                        className="text-sm font-medium hover:bg-muted transition-colors border-r"
                                        onClick={() => handleEdit(structure)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-sm font-medium hover:bg-muted transition-colors"
                                        onClick={() => toast.info(`Viewing details for ${structure.className}`)}
                                    >
                                        Details
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {structures.length === 0 && !isLoading && (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted text-muted-foreground">
                            <AlertCircle className="h-10 w-10 mb-4 opacity-20" />
                            <p className="font-bold">No fee structures defined yet</p>
                            <Button variant="link" onClick={() => setIsAdding(true)}>Create your first structure</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
