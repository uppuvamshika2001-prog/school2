
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useClassStore } from '@/stores/class.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const classSchema = z.object({
    name: z.string().min(2, 'Class name must be at least 2 characters'),
    academicYear: z.string().min(4, 'Academic year is required'),
    status: z.enum(['ACTIVE', 'INACTIVE']),
});

type ClassFormValues = z.infer<typeof classSchema>;

export default function NewClassPage() {
    const router = useRouter();
    const { createClass, isLoading } = useClassStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            status: 'ACTIVE',
            academicYear: '2023-2024',
        },
    });

    const onSubmit = async (data: ClassFormValues) => {
        try {
            await createClass(data);
            toast.success('Class created successfully');
            router.push('/dashboard/academics/classes');
        } catch (error) {
            toast.error('Failed to create class');
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/academics/classes">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Add New Class</h1>
                        <p className="text-muted-foreground mt-1">Create a new academic class level</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Class Details</CardTitle>
                    <CardDescription>Enter the basic information for the new class.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium">Class Name</label>
                                <input
                                    id="name"
                                    {...register('name')}
                                    placeholder="e.g. Class 11, Grade 10"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="academicYear" className="text-sm font-medium">Academic Year</label>
                                <select
                                    id="academicYear"
                                    {...register('academicYear')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="2023-2024">2023-2024</option>
                                    <option value="2024-2025">2024-2025</option>
                                </select>
                                {errors.academicYear && (
                                    <p className="text-sm text-destructive">{errors.academicYear.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="status" className="text-sm font-medium">Initial Status</label>
                                <select
                                    id="status"
                                    {...register('status')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 border-t pt-6">
                            <Link href="/dashboard/academics/classes">
                                <Button variant="outline" type="button" disabled={isLoading}>
                                    <X className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Class
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
