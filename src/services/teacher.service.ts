import { Teacher, SubjectAssignment, TimetableEntry, TeacherAttendance } from '@/types/teacher.types';

// Mock Data
const MOCK_TEACHERS: Teacher[] = [
    {
        id: 'tch-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@school.com',
        phone: '+1 234 567 8900',
        specialization: 'Mathematics',
        joinDate: '2023-01-15',
        status: 'ACTIVE',
        qualifications: [
            { id: 'q1', degree: 'M.Sc. Mathematics', institution: 'State University', yearOfCompletion: 2018 }
        ],
    },
    {
        id: 'tch-2',
        firstName: 'Robert',
        lastName: 'Smith',
        email: 'robert.s@school.com',
        phone: '+1 987 654 3210',
        specialization: 'Physics',
        joinDate: '2022-08-20',
        status: 'ACTIVE',
        qualifications: [
            { id: 'q2', degree: 'Ph.D. Physics', institution: 'Tech Institute', yearOfCompletion: 2019 }
        ],
    },
    {
        id: 'tch-3',
        firstName: 'Emily',
        lastName: 'Brown',
        email: 'emily.b@school.com',
        phone: '+1 555 123 4567',
        specialization: 'English',
        joinDate: '2024-02-10',
        status: 'ON_LEAVE',
        qualifications: [
            { id: 'q3', degree: 'B.Ed.', institution: 'City College', yearOfCompletion: 2021 }
        ],
    }
];

const MOCK_ASSIGNMENTS: SubjectAssignment[] = [
    {
        id: 'assign-1',
        teacherId: 'tch-1',
        subjectName: 'Mathematics',
        subjectCode: 'MATH-101',
        classId: 'Class 10',
        sectionId: 'A',
        academicYear: '2023-2024'
    },
    {
        id: 'assign-2',
        teacherId: 'tch-1',
        subjectName: 'Algebra',
        subjectCode: 'MATH-201',
        classId: 'Class 9',
        sectionId: 'B',
        academicYear: '2023-2024'
    }
];

class TeacherService {
    /**
     * Get all teachers with optional filtering
     */
    async getTeachers(filters?: { search?: string; status?: string }): Promise<Teacher[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let results = [...MOCK_TEACHERS];

        if (filters?.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(t =>
                t.firstName.toLowerCase().includes(q) ||
                t.lastName.toLowerCase().includes(q) ||
                t.email.toLowerCase().includes(q)
            );
        }

        if (filters?.status && filters.status !== 'ALL') {
            results = results.filter(t => t.status === filters.status);
        }

        return results;
    }

    /**
     * Get single teacher by ID
     */
    async getTeacherById(id: string): Promise<Teacher | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_TEACHERS.find(t => t.id === id) || null;
    }

    /**
     * Creates a new teacher
     */
    async createTeacher(data: Omit<Teacher, 'id'>): Promise<Teacher> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newTeacher = { ...data, id: `tch-${Date.now()}` };
        MOCK_TEACHERS.push(newTeacher);
        return newTeacher;
    }

    /**
     * Update teacher details
     */
    async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const index = MOCK_TEACHERS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Teacher not found');

        MOCK_TEACHERS[index] = { ...MOCK_TEACHERS[index], ...data };
        return MOCK_TEACHERS[index];
    }

    // --- Assignments ---

    async getAssignments(teacherId: string): Promise<SubjectAssignment[]> {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_ASSIGNMENTS.filter(a => a.teacherId === teacherId);
    }

    async assignSubject(data: Omit<SubjectAssignment, 'id'>): Promise<SubjectAssignment> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newAssignment = { ...data, id: `assign-${Date.now()}` };
        MOCK_ASSIGNMENTS.push(newAssignment);
        return newAssignment;
    }

    // --- Timetable ---

    async getTimetable(teacherId: string): Promise<TimetableEntry[]> {
        await new Promise(resolve => setTimeout(resolve, 400));

        // Dynamic timetable generation based on assignments to show integration
        const assignments = MOCK_ASSIGNMENTS.filter(a => a.teacherId === teacherId);
        const entries: TimetableEntry[] = [];

        const DAYS: TimetableEntry['dayOfWeek'][] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
        const TIMES = [
            { start: '09:00', end: '10:00' },
            { start: '10:00', end: '11:00' },
            { start: '11:00', end: '12:00' },
            { start: '13:00', end: '14:00' },
            { start: '14:00', end: '15:00' }
        ];

        // Randomly scatter assignments across the week
        assignments.forEach((assign, index) => {
            // Assign 3 slots per assignment
            for (let i = 0; i < 3; i++) {
                const dayIndex = (index + i) % 5;
                const timeIndex = (index * 2 + i) % 5;

                entries.push({
                    id: `tt-${assign.id}-${i}`,
                    dayOfWeek: DAYS[dayIndex],
                    startTime: TIMES[timeIndex].start,
                    endTime: TIMES[timeIndex].end,
                    subjectId: assign.subjectName, // Using name as ID for display simplification
                    classId: assign.classId.replace('Class ', ''),
                    sectionId: assign.sectionId,
                    teacherId: assign.teacherId,
                    roomNo: `${100 + parseInt(assign.classId.replace(/\D/g, '') || '0')}-${assign.sectionId}`
                });
            }
        });

        return entries;
    }
}

export const teacherService = new TeacherService();
