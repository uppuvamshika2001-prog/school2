'use client';

// Event Detail View
// =================

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    User,
    Edit,
    Trash2,
    PartyPopper,
    FileText,
    GraduationCap,
    Briefcase,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalendarStore } from '@/stores/calendar.store';
import { EventType } from '@/types/calendar.types';
import { toast } from 'sonner';

// Event type configuration
const eventTypeConfig: Record<EventType, { label: string; color: string; bg: string; bgLight: string; icon: React.ReactNode }> = {
    holiday: {
        label: 'Holiday',
        color: 'text-red-600',
        bg: 'bg-red-500',
        bgLight: 'bg-red-50 dark:bg-red-900/20',
        icon: <PartyPopper className="w-6 h-6" />
    },
    exam: {
        label: 'Examination',
        color: 'text-purple-600',
        bg: 'bg-purple-500',
        bgLight: 'bg-purple-50 dark:bg-purple-900/20',
        icon: <FileText className="w-6 h-6" />
    },
    academic: {
        label: 'Academic',
        color: 'text-blue-600',
        bg: 'bg-blue-500',
        bgLight: 'bg-blue-50 dark:bg-blue-900/20',
        icon: <GraduationCap className="w-6 h-6" />
    },
    event: {
        label: 'Event',
        color: 'text-green-600',
        bg: 'bg-green-500',
        bgLight: 'bg-green-50 dark:bg-green-900/20',
        icon: <Calendar className="w-6 h-6" />
    },
    meeting: {
        label: 'Meeting',
        color: 'text-orange-600',
        bg: 'bg-orange-500',
        bgLight: 'bg-orange-50 dark:bg-orange-900/20',
        icon: <Briefcase className="w-6 h-6" />
    },
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatTime(time?: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { selectedEvent, isLoading, fetchEventById, deleteEvent, clearSelectedEvent } = useCalendarStore();

    const eventId = params.id as string;

    useEffect(() => {
        if (eventId) {
            fetchEventById(eventId);
        }
        return () => clearSelectedEvent();
    }, [eventId, fetchEventById, clearSelectedEvent]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        const success = await deleteEvent(eventId);
        if (success) {
            toast.success('Event deleted successfully');
            router.push('/dashboard/calendar');
        } else {
            toast.error('Failed to delete event');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-muted-foreground font-medium">Loading event...</p>
                </div>
            </div>
        );
    }

    if (!selectedEvent) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Card className="max-w-md w-full text-center border-none shadow-lg">
                    <CardContent className="pt-12 pb-8 space-y-4">
                        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground/30" />
                        <h2 className="text-xl font-bold">Event Not Found</h2>
                        <p className="text-muted-foreground">
                            The event you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push('/dashboard/calendar')}>
                            Back to Calendar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const event = selectedEvent;
    const typeInfo = eventTypeConfig[event.type];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/calendar">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className={`${typeInfo.bg} text-white`}>
                                {typeInfo.label}
                            </Badge>
                            {event.priority === 'high' && (
                                <Badge variant="destructive">High Priority</Badge>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href={`/dashboard/calendar/${event.id}/edit`}>
                            <Edit className="w-4 h-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Type Card */}
                    <Card className={`border-2 border-${typeInfo.color.replace('text-', '')} shadow-sm overflow-hidden`}>
                        <div className={`p-6 ${typeInfo.bgLight} border-b flex items-center gap-4`}>
                            <div className={`p-4 rounded-2xl bg-white shadow-sm ${typeInfo.color}`}>
                                {typeInfo.icon}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{typeInfo.label}</p>
                                <p className="text-sm text-muted-foreground">
                                    {event.isAllDay ? 'All Day Event' : 'Scheduled Event'}
                                </p>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-3">Description</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Applicable To */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Applicable To
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Roles</p>
                                    <div className="flex flex-wrap gap-2">
                                        {event.applicableTo.roles.map(role => (
                                            <Badge key={role} variant="secondary" className="text-sm">
                                                {role.replace('_', ' ')}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {event.applicableTo.classes && event.applicableTo.classes.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Classes</p>
                                        <div className="flex flex-wrap gap-2">
                                            {event.applicableTo.classes.map(cls => (
                                                <Badge key={cls} variant="outline" className="text-sm">
                                                    Class {cls}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Date & Time */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date & Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Start Date</p>
                                <p className="font-medium">{formatDate(event.startDate)}</p>
                            </div>
                            {event.startDate !== event.endDate && (
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">End Date</p>
                                    <p className="font-medium">{formatDate(event.endDate)}</p>
                                </div>
                            )}
                            {!event.isAllDay && event.startTime && (
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Time</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Location */}
                    {event.location && (
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{event.location}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Created By */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Created By
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {event.createdBy.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold">{event.createdBy.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(event.createdAt).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
