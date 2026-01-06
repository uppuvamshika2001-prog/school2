
import { Class, Section, TimetableEntry, ClassFilters, ClassAssignmentRequest, Student } from '@/types/class.types';

// Mock Names for Lookup
const MOCK_TEACHERS: Record<string, string> = {
    'tch-1': 'Sarah Johnson',
    'tch-2': 'Robert Smith',
    'tch-3': 'Emily Brown',
};

const MOCK_STUDENTS: Record<string, string> = {
    'std-1': 'Arjun Sharma',
    'std-2': 'Priya Patel',
};

// Mock Data
const MOCK_CLASSES: Class[] = [
    {
        id: 'cls-1',
        name: 'Class 10',
        academicYear: '2023-2024',
        status: 'ACTIVE',
        sections: [
            { id: 'sec-10a', name: 'A', capacity: 40, studentCount: 38, classTeacherId: 'tch-1', classTeacherName: 'Sarah Johnson', classMonitorId: 'std-1', classMonitorName: 'Arjun Sharma' },
            { id: 'sec-10b', name: 'B', capacity: 40, studentCount: 35, classTeacherId: 'tch-2', classTeacherName: 'Robert Smith' },
        ],
    },
    {
        id: 'cls-2',
        name: 'Class 9',
        academicYear: '2023-2024',
        status: 'ACTIVE',
        sections: [
            { id: 'sec-9a', name: 'A', capacity: 35, studentCount: 32, classTeacherId: 'tch-3', classTeacherName: 'Emily Brown' },
        ],
    },
    {
        id: 'cls-3',
        name: 'Class 8',
        academicYear: '2022-2023',
        status: 'INACTIVE',
        sections: [
            { id: 'sec-8a', name: 'A', capacity: 30, studentCount: 28 },
        ],
    },
];

const MOCK_TIMETABLE: TimetableEntry[] = [
    {
        id: 'tt-1',
        dayOfWeek: 'MONDAY',
        period: 1,
        startTime: '09:00',
        endTime: '10:00',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        teacherId: 'tch-1',
        teacherName: 'Sarah Johnson',
        classId: 'cls-1',
        sectionId: 'sec-10a',
        roomNo: '101'
    },
    {
        id: 'tt-2',
        dayOfWeek: 'MONDAY',
        period: 2,
        startTime: '10:00',
        endTime: '11:00',
        subjectId: 'sub-phy',
        subjectName: 'Physics',
        teacherId: 'tch-2',
        teacherName: 'Robert Smith',
        classId: 'cls-1',
        sectionId: 'sec-10a',
        roomNo: '101'
    }
];

class ClassService {
    async getClasses(filters?: ClassFilters): Promise<Class[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        let results = [...MOCK_CLASSES];

        if (filters?.academicYear) {
            results = results.filter(c => c.academicYear === filters.academicYear);
        }

        if (filters?.status && filters.status !== 'ALL') {
            results = results.filter(c => c.status === filters.status);
        }

        if (filters?.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(c => c.name.toLowerCase().includes(q));
        }

        return results;
    }

    async getClassById(id: string): Promise<Class | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_CLASSES.find(c => c.id === id) || null;
    }

    async getTimetable(classId: string, sectionId: string): Promise<TimetableEntry[]> {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_TIMETABLE.filter(t => t.classId === classId && t.sectionId === sectionId);
    }

    async assignClassTeacher(request: ClassAssignmentRequest): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const cls = MOCK_CLASSES.find(c => c.id === request.classId);
        if (cls) {
            const section = cls.sections.find(s => s.id === request.sectionId);
            if (section && request.teacherId) {
                section.classTeacherId = request.teacherId;
                section.classTeacherName = MOCK_TEACHERS[request.teacherId] || 'Unknown Teacher';
            }
        }
    }

    async assignClassMonitor(request: ClassAssignmentRequest): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const cls = MOCK_CLASSES.find(c => c.id === request.classId);
        if (cls) {
            const section = cls.sections.find(s => s.id === request.sectionId);
            if (section && request.monitorId) {
                section.classMonitorId = request.monitorId;
                section.classMonitorName = MOCK_STUDENTS[request.monitorId] || 'Unknown Student';
            }
        }
    }

    async createClass(data: Omit<Class, 'id' | 'sections'>): Promise<Class> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newClass: Class = {
            ...data,
            id: `cls-${MOCK_CLASSES.length + 1}`,
            sections: [],
        };
        MOCK_CLASSES.push(newClass);
        return newClass;
    }

    async addSection(classId: string, data: Omit<Section, 'id' | 'studentCount'>): Promise<Section> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const cls = MOCK_CLASSES.find(c => c.id === classId);
        if (!cls) throw new Error('Class not found');

        const newSection: Section = {
            ...data,
            id: `sec-${cls.name.toLowerCase().replace(' ', '')}${String.fromCharCode(97 + cls.sections.length)}`,
            studentCount: 0,
        };
        cls.sections.push(newSection);
        return newSection;
    }

    async getStudents(classId: string, sectionId?: string): Promise<Student[]> {
        await new Promise(resolve => setTimeout(resolve, 600));
        let students = MOCK_CLASS_STUDENTS;
        if (sectionId) {
            students = students.filter(s => s.sectionId === sectionId);
        }
        return students;
    }
}

// Mock Detailed Students List
const MOCK_CLASS_STUDENTS: Student[] = [
    {
        id: 'std-1',
        name: 'Arjun Sharma',
        rollNo: '101',
        fatherName: 'Ramesh Sharma',
        motherName: 'Sita Sharma',
        guardianName: 'Ramesh Sharma',
        contactNumber: '9876543210',
        sectionId: 'sec-10a'
    },
    {
        id: 'std-2',
        name: 'Priya Patel',
        rollNo: '102',
        fatherName: 'Suresh Patel',
        motherName: 'Meena Patel',
        guardianName: 'Suresh Patel',
        contactNumber: '9876543211',
        sectionId: 'sec-10a'
    },
    {
        id: 'std-3',
        name: 'Rahul Bose',
        rollNo: '103',
        fatherName: 'Subhash Bose',
        motherName: 'Anita Bose',
        guardianName: 'Subhash Bose',
        contactNumber: '9876543212',
        sectionId: 'sec-10a'
    },
    {
        id: 'std-4',
        name: 'Anjali Gupta',
        rollNo: '201',
        fatherName: 'Manoj Gupta',
        motherName: 'Kiran Gupta',
        guardianName: 'Manoj Gupta',
        contactNumber: '9876543213',
        sectionId: 'sec-10b'
    },
    {
        id: 'std-5',
        name: 'Vikram Singh',
        rollNo: '202',
        fatherName: 'Vijay Singh',
        motherName: 'Pooja Singh',
        guardianName: 'Vijay Singh',
        contactNumber: '9876543214',
        sectionId: 'sec-10b'
    },
];

export const classService = new ClassService();
