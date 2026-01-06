export const mockStudentProfile = {
    id: 'STU001',
    name: 'Arjun Sharma',
    class: '10-A',
    rollNo: '23',
    dob: '2008-05-15',
    email: 'arjun.sharma@school.edu',
    phone: '+91 98765 43210',
    address: '123, Green Park, New Delhi',
    parents: {
        father: {
            name: 'Ramesh Sharma',
            occupation: 'Business Analyst',
            phone: '+91 98765 43211',
            email: 'ramesh.sharma@gmail.com'
        },
        mother: {
            name: 'Sushma Sharma',
            occupation: 'Software Engineer',
            phone: '+91 98765 43212',
            email: 'sushma.sharma@gmail.com'
        }
    },
    guardian: {
        name: 'Ramesh Sharma',
        relation: 'Father',
        phone: '+91 98765 43211',
        email: 'ramesh.sharma@gmail.com'
    },
    stats: {
        attendance: 88,
        assignmentsPending: 2,
        upcomingExams: 1,
        feeDue: 0
    }
};

export const mockClassDiary = [
    { id: 1, date: '2025-12-30', subject: 'Mathematics', title: 'Quadratic Equations', content: 'Complete Exercise 4.2, Q1-Q10', type: 'Homework' },
    { id: 2, date: '2025-12-30', subject: 'Science', title: 'Carbon Compounds', content: 'Read Chapter 4, make notes on Allotropes of Carbon', type: 'Classwork' },
    { id: 3, date: '2025-12-29', subject: 'English', title: 'Letter Writing', content: 'Draft a formal letter to the editor regarding pollution', type: 'Homework' },
];

export const mockAttendance = [
    { date: '2025-12-01', status: 'Present' },
    { date: '2025-12-02', status: 'Present' },
    { date: '2025-12-03', status: 'Absent' },
    { date: '2025-12-04', status: 'Present' },
    { date: '2025-12-05', status: 'Present' },
    // ... more entries
];

export const mockLibrary = {
    digital: [
        { id: 1, title: 'Introduction to Physics', author: 'H.C. Verma', url: '#' },
        { id: 2, title: 'Chemistry Vol 1', author: 'NCERT', url: '#' },
    ],
    physical: [
        { id: 101, title: 'Harry Potter and the Goblet of Fire', author: 'J.K. Rowling', status: 'Available', dueDate: null },
        { id: 102, title: 'Concept of Physics', author: 'H.C. Verma', status: 'Borrowed', dueDate: '2026-01-05' },
    ]
};

export const mockNotices = [
    { id: 1, date: '2025-12-28', title: 'Winter Vacation', content: 'School will remain closed from Jan 1st to Jan 10th for winter break.', urgency: 'High' },
    { id: 2, date: '2025-12-25', title: 'Science Exhibition', content: 'Upcoming science exhibition on Jan 15th. Submit project ideas by Jan 5th.', urgency: 'Medium' },
];

export const mockTimeTable = {
    Monday: ['Telugu', 'Hindi', 'English', 'Break', 'Maths', 'Science', 'Social'],
    Tuesday: ['Maths', 'Science', 'Social', 'Break', 'Telugu', 'Hindi', 'English'],
    Wednesday: ['English', 'Maths', 'Science', 'Break', 'Social', 'Telugu', 'Hindi'],
    Thursday: ['Hindi', 'English', 'Maths', 'Break', 'Science', 'Social', 'Telugu'],
    Friday: ['Social', 'Telugu', 'Hindi', 'Break', 'English', 'Maths', 'Science'],
    Saturday: ['Science', 'Social', 'Maths', 'Break', 'Activity', 'Activity', 'Dismissal'],
};

export const mockFees = [
    { id: 'REC001', date: '2025-10-10', term: 'Term 1', amount: 15000, status: 'Paid', downloadUrl: '#' },
    { id: 'REC002', date: '2026-01-10', term: 'Term 2', amount: 15000, status: 'Pending', downloadUrl: '#' },
    { id: 'REC003', date: '2026-04-10', term: 'Term 3', amount: 15000, status: 'Pending', downloadUrl: '#' },
    { id: 'REC004', date: '2025-06-15', term: 'Admission Fee', amount: 25000, status: 'Paid', downloadUrl: '#' },
    { id: 'REC005', date: '2025-06-15', term: 'Development Charges', amount: 5000, status: 'Paid', downloadUrl: '#' },
    { id: 'REC006', date: '2025-08-20', term: 'Transport Fee (Q1)', amount: 4500, status: 'Paid', downloadUrl: '#' },
    { id: 'REC007', date: '2025-11-20', term: 'Transport Fee (Q2)', amount: 4500, status: 'Paid', downloadUrl: '#' },
    { id: 'REC008', date: '2026-02-20', term: 'Transport Fee (Q3)', amount: 4500, status: 'Pending', downloadUrl: '#' },
];
