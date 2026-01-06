// Calendar Management Types
// ==========================

export type EventType = 'holiday' | 'exam' | 'academic' | 'event' | 'meeting';

export type EventPriority = 'low' | 'medium' | 'high';

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    type: EventType;
    priority: EventPriority;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    isAllDay: boolean;
    location?: string;
    applicableTo: {
        roles: ('SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT')[];
        classes?: string[];
    };
    createdBy: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CalendarEventFormData {
    title: string;
    description: string;
    type: EventType;
    priority: EventPriority;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    isAllDay: boolean;
    location?: string;
    applicableRoles: string[];
    applicableClasses: string[];
}

export interface CalendarFilters {
    month?: number;
    year?: number;
    type?: EventType;
    academicYear?: string;
}

export interface CalendarSummary {
    totalEvents: number;
    upcomingEvents: number;
    holidaysThisMonth: number;
    examsThisMonth: number;
}
