// Library State Management (Zustand)
// ===================================

import { create } from 'zustand';
import { libraryService } from '@/services/library.service';
import {
    Book,
    BookIssue,
    DigitalResource,
    BookFormData,
    DigitalResourceFormData,
    LibrarySummary,
    LibraryFilters
} from '@/types/library.types';

interface LibraryState {
    // Data
    books: Book[];
    selectedBook: Book | null;
    issues: BookIssue[];
    digitalResources: DigitalResource[];
    summary: LibrarySummary | null;

    // Filters
    filters: LibraryFilters;

    // Loading states
    isLoading: boolean;
    isSubmitting: boolean;

    // Actions
    fetchBooks: (filters?: LibraryFilters) => Promise<void>;
    fetchBookById: (id: string) => Promise<void>;
    fetchIssues: (status?: 'active' | 'returned' | 'overdue') => Promise<void>;
    fetchDigitalResources: (filters?: LibraryFilters) => Promise<void>;
    fetchSummary: () => Promise<void>;
    issueBook: (bookId: string, borrowerId: string, borrowerName: string, borrowerType: 'STUDENT' | 'TEACHER', borrowerClass?: string) => Promise<boolean>;
    returnBook: (issueId: string) => Promise<boolean>;
    addBook: (data: BookFormData) => Promise<boolean>;
    addDigitalResource: (data: DigitalResourceFormData) => Promise<boolean>;
    setFilters: (filters: LibraryFilters) => void;
    clearSelectedBook: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    // Initial state
    books: [],
    selectedBook: null,
    issues: [],
    digitalResources: [],
    summary: null,
    filters: {},
    isLoading: false,
    isSubmitting: false,

    // Fetch all books
    fetchBooks: async (filters?: LibraryFilters) => {
        set({ isLoading: true });
        try {
            const books = await libraryService.getBooks(filters || get().filters);
            set({ books, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch books:', error);
            set({ isLoading: false });
        }
    },

    // Fetch single book
    fetchBookById: async (id: string) => {
        set({ isLoading: true });
        try {
            const selectedBook = await libraryService.getBookById(id);
            set({ selectedBook, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch book:', error);
            set({ isLoading: false });
        }
    },

    // Fetch issues
    fetchIssues: async (status?: 'active' | 'returned' | 'overdue') => {
        set({ isLoading: true });
        try {
            const issues = await libraryService.getIssues(status);
            set({ issues, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch issues:', error);
            set({ isLoading: false });
        }
    },

    // Fetch digital resources
    fetchDigitalResources: async (filters?: LibraryFilters) => {
        set({ isLoading: true });
        try {
            const digitalResources = await libraryService.getDigitalResources(filters);
            set({ digitalResources, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch digital resources:', error);
            set({ isLoading: false });
        }
    },

    // Fetch summary
    fetchSummary: async () => {
        try {
            const summary = await libraryService.getSummary();
            set({ summary });
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    },

    // Issue a book
    issueBook: async (bookId, borrowerId, borrowerName, borrowerType, borrowerClass) => {
        set({ isSubmitting: true });
        try {
            await libraryService.issueBook(bookId, borrowerId, borrowerName, borrowerType, borrowerClass);
            await get().fetchBooks();
            await get().fetchIssues();
            await get().fetchSummary();
            set({ isSubmitting: false });
            return true;
        } catch (error) {
            console.error('Failed to issue book:', error);
            set({ isSubmitting: false });
            return false;
        }
    },

    // Return a book
    returnBook: async (issueId: string) => {
        set({ isSubmitting: true });
        try {
            await libraryService.returnBook(issueId);
            await get().fetchBooks();
            await get().fetchIssues();
            await get().fetchSummary();
            set({ isSubmitting: false });
            return true;
        } catch (error) {
            console.error('Failed to return book:', error);
            set({ isSubmitting: false });
            return false;
        }
    },

    // Add new book
    addBook: async (data: BookFormData) => {
        set({ isSubmitting: true });
        try {
            await libraryService.addBook(data);
            await get().fetchBooks();
            await get().fetchSummary();
            set({ isSubmitting: false });
            return true;
        } catch (error) {
            console.error('Failed to add book:', error);
            set({ isSubmitting: false });
            return false;
        }
    },

    // Add digital resource
    addDigitalResource: async (data: DigitalResourceFormData) => {
        set({ isSubmitting: true });
        try {
            await libraryService.addDigitalResource(data);
            await get().fetchDigitalResources();
            await get().fetchSummary();
            set({ isSubmitting: false });
            return true;
        } catch (error) {
            console.error('Failed to add resource:', error);
            set({ isSubmitting: false });
            return false;
        }
    },

    // Set filters
    setFilters: (filters: LibraryFilters) => {
        set({ filters });
    },

    // Clear selected book
    clearSelectedBook: () => {
        set({ selectedBook: null });
    },
}));
