// Library Management Types
// =========================

export type BookCategory =
    | 'fiction'
    | 'non-fiction'
    | 'science'
    | 'mathematics'
    | 'history'
    | 'geography'
    | 'literature'
    | 'reference'
    | 'biography'
    | 'other';

export type BookStatus = 'available' | 'issued' | 'reserved' | 'lost';

export type ResourceType = 'pdf' | 'video' | 'audio' | 'document' | 'presentation';

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: BookCategory;
    publisher: string;
    publicationYear: number;
    totalCopies: number;
    availableCopies: number;
    status: BookStatus;
    location: string; // Shelf location
    coverImage?: string;
    description?: string;
    addedAt: string;
}

export interface BookIssue {
    id: string;
    bookId: string;
    bookTitle: string;
    borrowerId: string;
    borrowerName: string;
    borrowerType: 'STUDENT' | 'TEACHER';
    borrowerClass?: string;
    issueDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'active' | 'returned' | 'overdue';
    fine?: number;
}

export interface DigitalResource {
    id: string;
    title: string;
    description: string;
    subject: string;
    category: BookCategory;
    type: ResourceType;
    fileUrl: string;
    fileSize: string;
    uploadedBy: {
        id: string;
        name: string;
    };
    uploadedAt: string;
    downloads: number;
    applicableClasses: string[];
}

export interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    category: BookCategory;
    publisher: string;
    publicationYear: number;
    totalCopies: number;
    location: string;
    description?: string;
}

export interface DigitalResourceFormData {
    title: string;
    description: string;
    subject: string;
    category: BookCategory;
    type: ResourceType;
    applicableClasses: string[];
}

export interface LibrarySummary {
    totalBooks: number;
    availableBooks: number;
    issuedBooks: number;
    overdueBooks: number;
    totalDigitalResources: number;
    activeMembers: number;
}

export interface LibraryFilters {
    search?: string;
    category?: BookCategory;
    status?: BookStatus;
    subject?: string;
}
