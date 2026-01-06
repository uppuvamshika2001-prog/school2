// Calendar API Service Layer
// ===========================

import {
    CalendarEvent,
    CalendarEventFormData,
    CalendarFilters,
    CalendarSummary
} from '@/types/calendar.types';

// Mock Data for Development
const MOCK_EVENTS: CalendarEvent[] = [
    {
        id: 'evt-001',
        title: 'Republic Day Holiday',
        description: 'National holiday celebrating the adoption of the Constitution of India.',
        type: 'holiday',
        priority: 'high',
        startDate: '2026-01-26',
        endDate: '2026-01-26',
        isAllDay: true,
        applicableTo: { roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
        createdBy: { id: 'admin-1', name: 'System Admin' },
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
    },
    {
        id: 'evt-002',
        title: 'Unit Test - Mathematics (Class 10)',
        description: 'Chapter-wise unit test covering Algebra and Geometry.',
        type: 'exam',
        priority: 'high',
        startDate: '2026-01-15',
        endDate: '2026-01-15',
        startTime: '09:00',
        endTime: '11:00',
        isAllDay: false,
        location: 'Examination Hall A',
        applicableTo: { roles: ['TEACHER', 'STUDENT', 'PARENT'], classes: ['10-A', '10-B', '10-C'] },
        createdBy: { id: 'admin-1', name: 'Academic Coordinator' },
        createdAt: '2025-12-15T00:00:00Z',
        updatedAt: '2025-12-15T00:00:00Z',
    },
    {
        id: 'evt-003',
        title: 'Parent-Teacher Meeting',
        description: 'Quarterly PTM to discuss student progress and academic performance.',
        type: 'meeting',
        priority: 'medium',
        startDate: '2026-01-20',
        endDate: '2026-01-20',
        startTime: '10:00',
        endTime: '14:00',
        isAllDay: false,
        location: 'School Auditorium',
        applicableTo: { roles: ['TEACHER', 'PARENT'] },
        createdBy: { id: 'admin-2', name: 'Principal' },
        createdAt: '2025-12-20T00:00:00Z',
        updatedAt: '2025-12-20T00:00:00Z',
    },
    {
        id: 'evt-004',
        title: 'Annual Sports Day',
        description: 'Inter-house sports competition featuring track and field events.',
        type: 'event',
        priority: 'high',
        startDate: '2026-01-28',
        endDate: '2026-01-29',
        isAllDay: true,
        location: 'School Sports Ground',
        applicableTo: { roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
        createdBy: { id: 'admin-3', name: 'Sports Coordinator' },
        createdAt: '2025-12-10T00:00:00Z',
        updatedAt: '2025-12-10T00:00:00Z',
    },
    {
        id: 'evt-005',
        title: 'Science Exhibition',
        description: 'Annual science exhibition showcasing student projects and innovations.',
        type: 'academic',
        priority: 'medium',
        startDate: '2026-01-22',
        endDate: '2026-01-22',
        startTime: '09:00',
        endTime: '16:00',
        isAllDay: false,
        location: 'School Laboratories',
        applicableTo: { roles: ['TEACHER', 'STUDENT', 'PARENT'] },
        createdBy: { id: 'admin-4', name: 'Science HOD' },
        createdAt: '2025-12-18T00:00:00Z',
        updatedAt: '2025-12-18T00:00:00Z',
    },
    {
        id: 'evt-006',
        title: 'Staff Training Workshop',
        description: 'Professional development workshop on modern teaching methodologies.',
        type: 'academic',
        priority: 'medium',
        startDate: '2026-01-10',
        endDate: '2026-01-10',
        startTime: '14:00',
        endTime: '17:00',
        isAllDay: false,
        location: 'Conference Room',
        applicableTo: { roles: ['TEACHER'] },
        createdBy: { id: 'admin-1', name: 'HR Manager' },
        createdAt: '2025-12-22T00:00:00Z',
        updatedAt: '2025-12-22T00:00:00Z',
    },
    {
        id: 'evt-007',
        title: 'Mid-Term Examinations Begin',
        description: 'Mid-term examinations for all classes. Students to refer to exam schedule.',
        type: 'exam',
        priority: 'high',
        startDate: '2026-02-10',
        endDate: '2026-02-20',
        isAllDay: true,
        applicableTo: { roles: ['TEACHER', 'STUDENT', 'PARENT'] },
        createdBy: { id: 'admin-1', name: 'Examination Controller' },
        createdAt: '2025-12-25T00:00:00Z',
        updatedAt: '2025-12-25T00:00:00Z',
    },
    {
        id: 'evt-008',
        title: 'Holi Holiday',
        description: 'Festival of Colors - School holiday',
        type: 'holiday',
        priority: 'high',
        startDate: '2026-03-17',
        endDate: '2026-03-17',
        isAllDay: true,
        applicableTo: { roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
        createdBy: { id: 'admin-1', name: 'System Admin' },
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
    },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const calendarService = {
    // Get all events with optional filters
    async getEvents(filters?: CalendarFilters): Promise<CalendarEvent[]> {
        await delay(600);

        let result = [...MOCK_EVENTS];

        if (filters) {
            if (filters.type) {
                result = result.filter(e => e.type === filters.type);
            }
            if (filters.month !== undefined && filters.year !== undefined) {
                result = result.filter(e => {
                    const eventDate = new Date(e.startDate);
                    return eventDate.getMonth() === filters.month &&
                        eventDate.getFullYear() === filters.year;
                });
            }
        }

        return result.sort((a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
    },

    // Get events for a specific date
    async getEventsByDate(date: string): Promise<CalendarEvent[]> {
        await delay(400);

        return MOCK_EVENTS.filter(e => {
            const eventStart = new Date(e.startDate);
            const eventEnd = new Date(e.endDate);
            const targetDate = new Date(date);

            return targetDate >= eventStart && targetDate <= eventEnd;
        });
    },

    // Get single event by ID
    async getEventById(id: string): Promise<CalendarEvent | null> {
        await delay(300);
        return MOCK_EVENTS.find(e => e.id === id) || null;
    },

    // Get calendar summary
    async getSummary(month: number, year: number): Promise<CalendarSummary> {
        await delay(400);

        const monthEvents = MOCK_EVENTS.filter(e => {
            const eventDate = new Date(e.startDate);
            return eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });

        const today = new Date();
        const upcomingEvents = MOCK_EVENTS.filter(e => new Date(e.startDate) >= today);

        return {
            totalEvents: MOCK_EVENTS.length,
            upcomingEvents: upcomingEvents.length,
            holidaysThisMonth: monthEvents.filter(e => e.type === 'holiday').length,
            examsThisMonth: monthEvents.filter(e => e.type === 'exam').length,
        };
    },

    // Create new event
    async createEvent(data: CalendarEventFormData): Promise<CalendarEvent> {
        await delay(800);

        const newEvent: CalendarEvent = {
            id: `evt-${Date.now()}`,
            title: data.title,
            description: data.description,
            type: data.type,
            priority: data.priority,
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
            isAllDay: data.isAllDay,
            location: data.location,
            applicableTo: {
                roles: data.applicableRoles as any[],
                classes: data.applicableClasses,
            },
            createdBy: { id: 'current-user', name: 'Current Admin' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        MOCK_EVENTS.push(newEvent);
        return newEvent;
    },

    // Update event
    async updateEvent(id: string, data: Partial<CalendarEventFormData>): Promise<CalendarEvent | null> {
        await delay(600);

        const event = MOCK_EVENTS.find(e => e.id === id);
        if (event) {
            Object.assign(event, {
                ...data,
                updatedAt: new Date().toISOString(),
            });
        }
        return event || null;
    },

    // Delete event
    async deleteEvent(id: string): Promise<boolean> {
        await delay(500);

        const index = MOCK_EVENTS.findIndex(e => e.id === id);
        if (index !== -1) {
            MOCK_EVENTS.splice(index, 1);
            return true;
        }
        return false;
    },
};
