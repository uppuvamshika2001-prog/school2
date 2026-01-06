// Library API Service Layer
// ==========================

import {
    Book,
    BookIssue,
    DigitalResource,
    BookFormData,
    DigitalResourceFormData,
    LibrarySummary,
    LibraryFilters
} from '@/types/library.types';

// Mock Data for Development
const MOCK_BOOKS: Book[] = [
    {
        id: 'book-001',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        category: 'literature',
        publisher: 'J. B. Lippincott & Co.',
        publicationYear: 1960,
        totalCopies: 5,
        availableCopies: 3,
        status: 'available',
        location: 'A-12',
        description: 'A classic of modern American literature, the story of racial injustice and childhood innocence.',
        addedAt: '2025-01-15T00:00:00Z',
    },
    {
        id: 'book-002',
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0-553-38016-3',
        category: 'science',
        publisher: 'Bantam Dell Publishing',
        publicationYear: 1988,
        totalCopies: 3,
        availableCopies: 0,
        status: 'issued',
        location: 'B-05',
        description: 'A landmark volume in science writing exploring the origins of the universe.',
        addedAt: '2025-02-10T00:00:00Z',
    },
    {
        id: 'book-003',
        title: 'The Art of War',
        author: 'Sun Tzu',
        isbn: '978-1-59030-225-5',
        category: 'history',
        publisher: 'Shambhala',
        publicationYear: 2005,
        totalCopies: 4,
        availableCopies: 4,
        status: 'available',
        location: 'C-08',
        description: 'An ancient Chinese military treatise dating from the 5th century BC.',
        addedAt: '2025-03-05T00:00:00Z',
    },
    {
        id: 'book-004',
        title: 'NCERT Mathematics Class 10',
        author: 'NCERT',
        isbn: '978-81-7450-636-8',
        category: 'mathematics',
        publisher: 'NCERT',
        publicationYear: 2023,
        totalCopies: 20,
        availableCopies: 15,
        status: 'available',
        location: 'D-01',
        description: 'Official NCERT textbook for Class 10 Mathematics.',
        addedAt: '2025-04-01T00:00:00Z',
    },
    {
        id: 'book-005',
        title: 'Oxford English Dictionary',
        author: 'Oxford University Press',
        isbn: '978-0-19-861186-8',
        category: 'reference',
        publisher: 'Oxford University Press',
        publicationYear: 2020,
        totalCopies: 2,
        availableCopies: 2,
        status: 'available',
        location: 'REF-01',
        description: 'The definitive record of the English language.',
        addedAt: '2025-01-01T00:00:00Z',
    },
    {
        id: 'book-006',
        title: 'Wings of Fire',
        author: 'A.P.J. Abdul Kalam',
        isbn: '978-81-7371-146-7',
        category: 'biography',
        publisher: 'Universities Press',
        publicationYear: 1999,
        totalCopies: 6,
        availableCopies: 2,
        status: 'available',
        location: 'A-25',
        description: 'An autobiography of APJ Abdul Kalam, former President of India.',
        addedAt: '2025-02-20T00:00:00Z',
    },
];

const MOCK_ISSUES: BookIssue[] = [
    {
        id: 'issue-001',
        bookId: 'book-002',
        bookTitle: 'A Brief History of Time',
        borrowerId: 'stu-001',
        borrowerName: 'Arjun Sharma',
        borrowerType: 'STUDENT',
        borrowerClass: '12-A',
        issueDate: '2026-01-01',
        dueDate: '2026-01-15',
        status: 'active',
    },
    {
        id: 'issue-002',
        bookId: 'book-001',
        bookTitle: 'To Kill a Mockingbird',
        borrowerId: 'stu-002',
        borrowerName: 'Priya Patel',
        borrowerType: 'STUDENT',
        borrowerClass: '11-B',
        issueDate: '2025-12-20',
        dueDate: '2026-01-03',
        status: 'overdue',
        fine: 50,
    },
    {
        id: 'issue-003',
        bookId: 'book-006',
        bookTitle: 'Wings of Fire',
        borrowerId: 'tch-001',
        borrowerName: 'Mrs. Anita Desai',
        borrowerType: 'TEACHER',
        issueDate: '2025-12-28',
        dueDate: '2026-01-28',
        status: 'active',
    },
];

const MOCK_DIGITAL_RESOURCES: DigitalResource[] = [
    {
        id: 'res-001',
        title: 'Introduction to Calculus',
        description: 'Comprehensive video tutorial covering basics of differential calculus.',
        subject: 'Mathematics',
        category: 'mathematics',
        type: 'video',
        fileUrl: '/resources/calculus-intro.mp4',
        fileSize: '245 MB',
        uploadedBy: { id: 'tch-002', name: 'Mr. Rajesh Kumar' },
        uploadedAt: '2025-12-15T00:00:00Z',
        downloads: 156,
        applicableClasses: ['11-A', '11-B', '12-A', '12-B'],
    },
    {
        id: 'res-002',
        title: 'NCERT Solutions - Physics Class 12',
        description: 'Complete chapter-wise solutions for NCERT Physics textbook.',
        subject: 'Physics',
        category: 'science',
        type: 'pdf',
        fileUrl: '/resources/ncert-physics-solutions.pdf',
        fileSize: '12.5 MB',
        uploadedBy: { id: 'tch-003', name: 'Dr. Suresh Menon' },
        uploadedAt: '2025-11-20T00:00:00Z',
        downloads: 432,
        applicableClasses: ['12-A', '12-B', '12-C'],
    },
    {
        id: 'res-003',
        title: 'English Grammar Fundamentals',
        description: 'Audio lessons covering essential English grammar rules.',
        subject: 'English',
        category: 'literature',
        type: 'audio',
        fileUrl: '/resources/grammar-basics.mp3',
        fileSize: '85 MB',
        uploadedBy: { id: 'tch-004', name: 'Ms. Kavita Singh' },
        uploadedAt: '2025-10-10T00:00:00Z',
        downloads: 289,
        applicableClasses: ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B'],
    },
    {
        id: 'res-004',
        title: 'Indian Freedom Movement - Timeline',
        description: 'Interactive presentation on key events of India\'s independence struggle.',
        subject: 'History',
        category: 'history',
        type: 'presentation',
        fileUrl: '/resources/freedom-movement.pptx',
        fileSize: '28 MB',
        uploadedBy: { id: 'tch-005', name: 'Mr. Vikram Rao' },
        uploadedAt: '2025-12-01T00:00:00Z',
        downloads: 198,
        applicableClasses: ['9-A', '9-B', '10-A', '10-B'],
    },
    {
        id: 'res-005',
        title: 'Chemistry Lab Manual',
        description: 'Complete laboratory procedures and safety guidelines.',
        subject: 'Chemistry',
        category: 'science',
        type: 'document',
        fileUrl: '/resources/chem-lab-manual.docx',
        fileSize: '5.2 MB',
        uploadedBy: { id: 'tch-006', name: 'Dr. Meera Iyer' },
        uploadedAt: '2025-09-15T00:00:00Z',
        downloads: 567,
        applicableClasses: ['11-A', '11-B', '12-A', '12-B'],
    },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const libraryService = {
    // Get all books with optional filters
    async getBooks(filters?: LibraryFilters): Promise<Book[]> {
        await delay(600);

        let result = [...MOCK_BOOKS];

        if (filters) {
            if (filters.search) {
                const search = filters.search.toLowerCase();
                result = result.filter(b =>
                    b.title.toLowerCase().includes(search) ||
                    b.author.toLowerCase().includes(search) ||
                    b.isbn.includes(search)
                );
            }
            if (filters.category) {
                result = result.filter(b => b.category === filters.category);
            }
            if (filters.status) {
                result = result.filter(b => b.status === filters.status);
            }
        }

        return result;
    },

    // Get single book by ID
    async getBookById(id: string): Promise<Book | null> {
        await delay(300);
        return MOCK_BOOKS.find(b => b.id === id) || null;
    },

    // Get book issues
    async getIssues(status?: 'active' | 'returned' | 'overdue'): Promise<BookIssue[]> {
        await delay(500);

        if (status) {
            return MOCK_ISSUES.filter(i => i.status === status);
        }
        return [...MOCK_ISSUES];
    },

    // Get digital resources
    async getDigitalResources(filters?: LibraryFilters): Promise<DigitalResource[]> {
        await delay(600);

        let result = [...MOCK_DIGITAL_RESOURCES];

        if (filters) {
            if (filters.search) {
                const search = filters.search.toLowerCase();
                result = result.filter(r =>
                    r.title.toLowerCase().includes(search) ||
                    r.subject.toLowerCase().includes(search)
                );
            }
            if (filters.category) {
                result = result.filter(r => r.category === filters.category);
            }
            if (filters.subject) {
                result = result.filter(r => r.subject.toLowerCase() === filters.subject?.toLowerCase());
            }
        }

        return result;
    },

    // Get library summary
    async getSummary(): Promise<LibrarySummary> {
        await delay(400);

        const totalBooks = MOCK_BOOKS.reduce((sum, b) => sum + b.totalCopies, 0);
        const availableBooks = MOCK_BOOKS.reduce((sum, b) => sum + b.availableCopies, 0);
        const issuedBooks = MOCK_ISSUES.filter(i => i.status === 'active').length;
        const overdueBooks = MOCK_ISSUES.filter(i => i.status === 'overdue').length;

        return {
            totalBooks,
            availableBooks,
            issuedBooks,
            overdueBooks,
            totalDigitalResources: MOCK_DIGITAL_RESOURCES.length,
            activeMembers: 245,
        };
    },

    // Issue a book
    async issueBook(bookId: string, borrowerId: string, borrowerName: string, borrowerType: 'STUDENT' | 'TEACHER', borrowerClass?: string): Promise<BookIssue> {
        await delay(800);

        const book = MOCK_BOOKS.find(b => b.id === bookId);
        if (!book || book.availableCopies <= 0) {
            throw new Error('Book not available');
        }

        book.availableCopies--;
        if (book.availableCopies === 0) {
            book.status = 'issued';
        }

        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + 14);

        const newIssue: BookIssue = {
            id: `issue-${Date.now()}`,
            bookId,
            bookTitle: book.title,
            borrowerId,
            borrowerName,
            borrowerType,
            borrowerClass,
            issueDate: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'active',
        };

        MOCK_ISSUES.push(newIssue);
        return newIssue;
    },

    // Return a book
    async returnBook(issueId: string): Promise<BookIssue | null> {
        await delay(600);

        const issue = MOCK_ISSUES.find(i => i.id === issueId);
        if (!issue) return null;

        const book = MOCK_BOOKS.find(b => b.id === issue.bookId);
        if (book) {
            book.availableCopies++;
            book.status = 'available';
        }

        issue.status = 'returned';
        issue.returnDate = new Date().toISOString().split('T')[0];

        return issue;
    },

    // Add new book
    async addBook(data: BookFormData): Promise<Book> {
        await delay(800);

        const newBook: Book = {
            id: `book-${Date.now()}`,
            ...data,
            availableCopies: data.totalCopies,
            status: 'available',
            addedAt: new Date().toISOString(),
        };

        MOCK_BOOKS.push(newBook);
        return newBook;
    },

    // Add digital resource
    async addDigitalResource(data: DigitalResourceFormData): Promise<DigitalResource> {
        await delay(800);

        const newResource: DigitalResource = {
            id: `res-${Date.now()}`,
            ...data,
            fileUrl: `/resources/${data.title.toLowerCase().replace(/\s+/g, '-')}.${data.type}`,
            fileSize: '0 MB',
            uploadedBy: { id: 'current-user', name: 'Current Admin' },
            uploadedAt: new Date().toISOString(),
            downloads: 0,
        };

        MOCK_DIGITAL_RESOURCES.push(newResource);
        return newResource;
    },
};
