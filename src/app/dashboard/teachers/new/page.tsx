'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2, Upload, X } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { teacherService } from '@/services/teacher.service';
import { TeacherDocument } from '@/types/teacher.types';
import { useIsSuperAdmin } from '@/stores/auth.store';

const teacherSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    gender: z.string().min(1, 'Gender is required'),
    dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
    joiningDate: z.date({ required_error: 'Joining date is required' }),
    qualification: z.string().min(2, 'Qualification is required'),
    specialization: z.string().min(2, 'Specialization is required'),
    designation: z.string().min(2, 'Designation is required'),
    department: z.string().min(2, 'Department is required'),
    address: z.string().min(5, 'Address is required'),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export default function AddTeacherPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<File[]>([]);
    const isSuperAdmin = useIsSuperAdmin();

    // Redirect super admin - they should not have access to add teachers
    useEffect(() => {
        if (isSuperAdmin) {
            toast.error('Super Admin does not have permission to add teachers');
            router.push('/dashboard/teachers');
        }
    }, [isSuperAdmin, router]);

    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialization: '',
            qualification: '',
            designation: '',
            department: '',
            address: '',
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setDocuments((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeDocument = (index: number) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    async function onSubmit(data: TeacherFormValues) {
        setIsLoading(true);
        try {
            // Create mock documents from files
            const mockDocuments: TeacherDocument[] = documents.map((file, index) => ({
                id: `doc-${Date.now()}-${index}`,
                name: file.name,
                type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                uploadDate: new Date().toISOString(),
                url: URL.createObjectURL(file), // Mock URL
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            }));

            // Call service to create teacher (we'll need to update the service to handle this)
            await teacherService.createTeacher({
                ...data,
                status: 'ACTIVE',
                joinDate: data.joiningDate.toISOString(), // Map joiningDate to joinDate
                qualifications: [
                    {
                        id: `qual-${Date.now()}`,
                        degree: data.qualification,
                        institution: 'Unknown University', // Placeholder
                        yearOfCompletion: 2020, // Placeholder
                        specialization: data.specialization
                    }
                ],
                documents: mockDocuments
            });

            toast.success('Teacher added successfully');
            router.push('/dashboard/teachers');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add teacher');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add New Teacher</h2>
                    <p className="text-muted-foreground">
                        Create a new teacher profile and assign initial details.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Enter the personal details of the teacher.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="John" {...form.register('firstName')} />
                                    {form.formState.errors.firstName && (
                                        <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" {...form.register('lastName')} />
                                    {form.formState.errors.lastName && (
                                        <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john.doe@school.edu" {...form.register('email')} />
                                    {form.formState.errors.email && (
                                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" placeholder="+1 234 567 890" {...form.register('phone')} />
                                    {form.formState.errors.phone && (
                                        <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select onValueChange={(value) => form.setValue('gender', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.gender && (
                                        <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label>Date of Birth</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !form.watch('dateOfBirth') && "text-muted-foreground"
                                                )}
                                            >
                                                {form.watch('dateOfBirth') ? (
                                                    format(form.watch('dateOfBirth'), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={form.watch('dateOfBirth')}
                                                onSelect={(date) => date && form.setValue('dateOfBirth', date)}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                captionLayout="dropdown"
                                                fromYear={1900}
                                                toYear={new Date().getFullYear()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {form.formState.errors.dateOfBirth && (
                                        <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="123 Main St, City" {...form.register('address')} />
                                {form.formState.errors.address && (
                                    <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                            <CardDescription>Academic and employment information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <Input id="qualification" placeholder="e.g. M.Sc Mathematics" {...form.register('qualification')} />
                                    {form.formState.errors.qualification && (
                                        <p className="text-sm text-red-500">{form.formState.errors.qualification.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input id="specialization" placeholder="e.g. Mathematics" {...form.register('specialization')} />
                                    {form.formState.errors.specialization && (
                                        <p className="text-sm text-red-500">{form.formState.errors.specialization.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input id="designation" placeholder="e.g. Senior Teacher" {...form.register('designation')} />
                                    {form.formState.errors.designation && (
                                        <p className="text-sm text-red-500">{form.formState.errors.designation.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" placeholder="e.g. Science" {...form.register('department')} />
                                    {form.formState.errors.department && (
                                        <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label>Joining Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !form.watch('joiningDate') && "text-muted-foreground"
                                                )}
                                            >
                                                {form.watch('joiningDate') ? (
                                                    format(form.watch('joiningDate'), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={form.watch('joiningDate')}
                                                onSelect={(date) => date && form.setValue('joiningDate', date)}
                                                captionLayout="dropdown"
                                                fromYear={1900}
                                                toYear={new Date().getFullYear() + 10}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {form.formState.errors.joiningDate && (
                                        <p className="text-sm text-red-500">{form.formState.errors.joiningDate.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>Upload teacher's resume, certificates, etc.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="documents">Upload Files</Label>
                                <div className="flex items-center gap-4">
                                    <Input id="documents" type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
                                </div>
                            </div>

                            {documents.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {documents.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Upload className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm truncate">{file.name}</span>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDocument(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Teacher
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
