'use client';

// Create Event Page (Admin)
// ==========================

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    Save,
    PartyPopper,
    FileText,
    GraduationCap,
    Briefcase,
    Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCalendarStore } from '@/stores/calendar.store';
import { EventType, EventPriority, CalendarEventFormData } from '@/types/calendar.types';
import { useIsSuperAdmin } from '@/stores/auth.store';

// Form validation schema
const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500),
    type: z.enum(['holiday', 'exam', 'academic', 'event', 'meeting']),
    priority: z.enum(['low', 'medium', 'high']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    isAllDay: z.boolean(),
    location: z.string().optional(),
    applicableRoles: z.array(z.string()).min(1, 'Select at least one role'),
    applicableClasses: z.array(z.string()),
});

type FormValues = z.infer<typeof eventSchema>;

const eventTypes: { value: EventType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'holiday', label: 'Holiday', icon: <PartyPopper className="w-5 h-5" />, color: 'text-red-600' },
    { value: 'exam', label: 'Examination', icon: <FileText className="w-5 h-5" />, color: 'text-purple-600' },
    { value: 'academic', label: 'Academic', icon: <GraduationCap className="w-5 h-5" />, color: 'text-blue-600' },
    { value: 'event', label: 'Event', icon: <Calendar className="w-5 h-5" />, color: 'text-green-600' },
    { value: 'meeting', label: 'Meeting', icon: <Briefcase className="w-5 h-5" />, color: 'text-orange-600' },
];

const roles = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'SCHOOL_ADMIN', label: 'School Admin' },
    { value: 'TEACHER', label: 'Teachers' },
    { value: 'STUDENT', label: 'Students' },
    { value: 'PARENT', label: 'Parents' },
];

const classes = [
    '1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B', '5-A', '5-B',
    '6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B',
    '11-A', '11-B', '12-A', '12-B'
];

export default function CreateEventPage() {
    const router = useRouter();
    const { createEvent, isSubmitting } = useCalendarStore();
    const isSuperAdmin = useIsSuperAdmin();

    // Redirect super admin - they should not have access to create events
    useEffect(() => {
        if (isSuperAdmin) {
            toast.error('Super Admin does not have permission to create events');
            router.push('/dashboard/calendar');
        }
    }, [isSuperAdmin, router]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            description: '',
            type: 'event',
            priority: 'medium',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            isAllDay: true,
            location: '',
            applicableRoles: [],
            applicableClasses: [],
        },
    });

    const selectedType = watch('type');
    const isAllDay = watch('isAllDay');
    const selectedRoles = watch('applicableRoles') || [];
    const selectedClasses = watch('applicableClasses') || [];

    const onSubmit = async (data: FormValues) => {
        const success = await createEvent(data as CalendarEventFormData);
        if (success) {
            toast.success('Event created successfully!');
            router.push('/dashboard/calendar');
        } else {
            toast.error('Failed to create event. Please try again.');
        }
    };

    const toggleRole = (role: string) => {
        const newRoles = selectedRoles.includes(role)
            ? selectedRoles.filter(r => r !== role)
            : [...selectedRoles, role];
        setValue('applicableRoles', newRoles);
    };

    const toggleClass = (cls: string) => {
        const newClasses = selectedClasses.includes(cls)
            ? selectedClasses.filter(c => c !== cls)
            : [...selectedClasses, cls];
        setValue('applicableClasses', newClasses);
    };

    const selectAllRoles = () => {
        setValue('applicableRoles', roles.map(r => r.value));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/calendar">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
                    <p className="text-muted-foreground mt-1">Add a new event to the academic calendar</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                        <CardDescription>Basic information about the event</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Event Type */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Event Type
                            </label>
                            <div className="grid grid-cols-5 gap-3">
                                {eventTypes.map(type => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setValue('type', type.value)}
                                        className={`p-4 rounded-xl border-2 transition-all text-center
                                            ${selectedType === type.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'}`}
                                    >
                                        <div className={`${type.color} flex flex-col items-center gap-2`}>
                                            {type.icon}
                                            <span className="text-xs font-bold">{type.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Event Title</label>
                            <Input
                                {...register('title')}
                                placeholder="Enter event title"
                                className="h-12"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Description</label>
                            <textarea
                                {...register('description')}
                                placeholder="Describe the event..."
                                rows={4}
                                className="w-full p-4 rounded-xl border bg-background resize-none
                                    focus:ring-2 focus:ring-primary outline-none"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Priority</label>
                            <div className="flex gap-3">
                                {(['low', 'medium', 'high'] as EventPriority[]).map(priority => (
                                    <button
                                        key={priority}
                                        type="button"
                                        onClick={() => setValue('priority', priority)}
                                        className={`px-4 py-2 rounded-lg border font-medium capitalize
                                            ${watch('priority') === priority
                                                ? priority === 'high'
                                                    ? 'bg-red-500 text-white border-red-500'
                                                    : priority === 'medium'
                                                        ? 'bg-yellow-500 text-white border-yellow-500'
                                                        : 'bg-green-500 text-white border-green-500'
                                                : 'hover:border-primary/50'}`}
                                    >
                                        {priority}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Date & Time */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Date & Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Start Date</label>
                                <Input
                                    {...register('startDate')}
                                    type="date"
                                    className="h-12"
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-destructive">{errors.startDate.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">End Date</label>
                                <Input
                                    {...register('endDate')}
                                    type="date"
                                    className="h-12"
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-destructive">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        {/* All Day Toggle */}
                        <div
                            onClick={() => setValue('isAllDay', !isAllDay)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                                ${isAllDay ? 'border-primary bg-primary/5' : 'border-muted'}`}
                        >
                            <div>
                                <p className="font-bold">All Day Event</p>
                                <p className="text-sm text-muted-foreground">
                                    Toggle off to set specific times
                                </p>
                            </div>
                            <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-1
                                ${isAllDay ? 'bg-primary' : 'bg-muted'}`}>
                                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform
                                    ${isAllDay ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        {!isAllDay && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Start Time
                                    </label>
                                    <Input
                                        {...register('startTime')}
                                        type="time"
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        End Time
                                    </label>
                                    <Input
                                        {...register('endTime')}
                                        type="time"
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Location (Optional)
                            </label>
                            <Input
                                {...register('location')}
                                placeholder="e.g., School Auditorium, Classroom 101"
                                className="h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Applicable To */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Applicable To
                                </CardTitle>
                                <CardDescription>Select who this event applies to</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={selectAllRoles}>
                                Select All Roles
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Roles */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Roles
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {roles.map(role => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => toggleRole(role.value)}
                                        className={`px-4 py-2 rounded-full border font-medium transition-all
                                            ${selectedRoles.includes(role.value)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'hover:border-primary/50'}`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                            {errors.applicableRoles && (
                                <p className="text-sm text-destructive">{errors.applicableRoles.message}</p>
                            )}
                        </div>

                        {/* Classes */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Specific Classes (Optional)
                            </label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {classes.map(cls => (
                                    <button
                                        key={cls}
                                        type="button"
                                        onClick={() => toggleClass(cls)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                                            ${selectedClasses.includes(cls)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'hover:border-primary/50'}`}
                                    >
                                        {cls}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Sparkles className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Create Event
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
