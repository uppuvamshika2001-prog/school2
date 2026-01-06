'use client';

import { useState, useRef, useEffect } from 'react';
import { BookOpen, MoreVertical, Plus, Beaker, Calculator, Languages, Globe, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsSuperAdmin } from '@/stores/auth.store';

interface Subject {
    id: string;
    name: string;
    code: string;
    department: string;
    type: string;
    icon: React.ElementType;
}

export default function SubjectsPage() {
    const isSuperAdmin = useIsSuperAdmin();
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 'SUB001', name: 'Mathematics', code: 'MATH-001', department: 'Mathematics', type: 'Theory', icon: Calculator },
        { id: 'SUB002', name: 'Science', code: 'SCI-001', department: 'Science', type: 'Theory + Practical', icon: Beaker },
        { id: 'SUB003', name: 'English', code: 'ENG-001', department: 'Languages', type: 'Theory', icon: Languages },
        { id: 'SUB004', name: 'Social Studies', code: 'SST-001', department: 'Social Sciences', type: 'Theory', icon: Globe },
        { id: 'SUB005', name: 'Physics', code: 'PHY-011', department: 'Science', type: 'Theory + Practical', icon: Beaker },
        { id: 'SUB006', name: 'Chemistry', code: 'CHEM-011', department: 'Science', type: 'Theory + Practical', icon: Beaker },
        { id: 'SUB007', name: 'Biology', code: 'BIO-011', department: 'Science', type: 'Theory + Practical', icon: Beaker },
        { id: 'SUB008', name: 'Computer Science', code: 'CS-011', department: 'Computer Science', type: 'Practical', icon: BookOpen },
        { id: 'SUB009', name: 'Economics', code: 'ECO-011', department: 'Commerce', type: 'Theory', icon: Calculator },
        { id: 'SUB010', name: 'Accountancy', code: 'ACC-011', department: 'Commerce', type: 'Theory', icon: Calculator },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [newSubject, setNewSubject] = useState({
        name: '',
        code: '',
        department: '',
        type: 'Theory'
    });

    const [editSubject, setEditSubject] = useState({
        name: '',
        code: '',
        department: '',
        type: 'Theory'
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        const sub: Subject = {
            id: `SUB0${subjects.length + 1}`,
            ...newSubject,
            icon: BookOpen
        };
        setSubjects([...subjects, sub]);
        setShowAddModal(false);
        setNewSubject({ name: '', code: '', department: '', type: 'Theory' });
        toast.success('Subject added successfully!');
    };

    const handleEditClick = (subject: Subject) => {
        setSelectedSubject(subject);
        setEditSubject({
            name: subject.name,
            code: subject.code,
            department: subject.department,
            type: subject.type
        });
        setActiveDropdown(null);
        setShowEditModal(true);
    };

    const handleEditSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject) return;

        setSubjects(subjects.map(sub =>
            sub.id === selectedSubject.id
                ? { ...sub, ...editSubject }
                : sub
        ));
        setShowEditModal(false);
        setSelectedSubject(null);
        toast.success('Subject updated successfully!');
    };

    const handleDeleteClick = (subject: Subject) => {
        setSelectedSubject(subject);
        setActiveDropdown(null);
        setShowDeleteConfirm(true);
    };

    const handleDeleteSubject = () => {
        if (!selectedSubject) return;

        setSubjects(subjects.filter(sub => sub.id !== selectedSubject.id));
        setShowDeleteConfirm(false);
        setSelectedSubject(null);
        toast.success('Subject deleted successfully!');
    };

    const toggleDropdown = (id: string) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
                    <p className="text-muted-foreground mt-1">Configure curriculum and subjects.</p>
                </div>
                {!isSuperAdmin && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Subject</span>
                    </button>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">Add New Subject</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubject} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                    placeholder="e.g. History"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject Code</label>
                                <input
                                    required
                                    type="text"
                                    value={newSubject.code}
                                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                                    placeholder="e.g. HIS-001"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <input
                                    required
                                    type="text"
                                    value={newSubject.department}
                                    onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
                                    placeholder="e.g. Humanities"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    value={newSubject.type}
                                    onChange={(e) => setNewSubject({ ...newSubject, type: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="Theory">Theory</option>
                                    <option value="Practical">Practical</option>
                                    <option value="Theory + Practical">Theory + Practical</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save Subject</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedSubject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">Edit Subject</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubject} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject Name</label>
                                <input
                                    required
                                    type="text"
                                    value={editSubject.name}
                                    onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
                                    placeholder="e.g. History"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject Code</label>
                                <input
                                    required
                                    type="text"
                                    value={editSubject.code}
                                    onChange={(e) => setEditSubject({ ...editSubject, code: e.target.value })}
                                    placeholder="e.g. HIS-001"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <input
                                    required
                                    type="text"
                                    value={editSubject.department}
                                    onChange={(e) => setEditSubject({ ...editSubject, department: e.target.value })}
                                    placeholder="e.g. Humanities"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    value={editSubject.type}
                                    onChange={(e) => setEditSubject({ ...editSubject, type: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="Theory">Theory</option>
                                    <option value="Practical">Practical</option>
                                    <option value="Theory + Practical">Theory + Practical</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Update Subject</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedSubject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
                                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-center mb-2">Delete Subject</h2>
                            <p className="text-muted-foreground text-center mb-6">
                                Are you sure you want to delete <strong>{selectedSubject.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteSubject}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-card rounded-xl border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-4 text-left">Subject Name</th>
                                <th className="px-6 py-4 text-left">Code</th>
                                <th className="px-6 py-4 text-left">Department</th>
                                <th className="px-6 py-4 text-left">Type</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {subjects.map((sub) => (
                                <tr key={sub.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-primary/10 rounded text-primary">
                                                <sub.icon className="w-4 h-4" />
                                            </div>
                                            {sub.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">{sub.code}</td>
                                    <td className="px-6 py-4">{sub.department}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${sub.type.includes('Practical')
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                            {sub.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isSuperAdmin && (
                                            <div className="relative inline-block" ref={activeDropdown === sub.id ? dropdownRef : null}>
                                                <button
                                                    onClick={() => toggleDropdown(sub.id)}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                {activeDropdown === sub.id && (
                                                    <div className="absolute right-0 mt-1 w-36 bg-background border rounded-lg shadow-lg z-10 py-1">
                                                        <button
                                                            onClick={() => handleEditClick(sub)}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(sub)}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
