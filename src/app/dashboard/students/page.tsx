'use client';

import { useState } from 'react';
import { Search, User, Phone, Mail, Calendar, MapPin, Plus, Eye, Pencil, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useIsSuperAdmin } from '@/stores/auth.store';
import { format } from 'date-fns';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Student type
interface Student {
  id: string;
  admissionNo: string;
  name: string;
  class: string;
  gender: string;
  phone: string;
  email: string;
  dob: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  address: string;
  status: string;
}

// Dummy student data
const initialStudents: Student[] = [
  { id: '1', admissionNo: 'STU2024001', name: 'Arjun Sharma', class: '10-A', gender: 'Male', phone: '+91 98765 43210', email: 'arjun.sharma@school.edu', dob: '2008-05-15', bloodGroup: 'O+', fatherName: 'Ramesh Sharma', motherName: 'Sita Sharma', guardianName: 'Ramesh Sharma', address: 'Green Park, New Delhi', status: 'Active' },
  { id: '2', admissionNo: 'STU2024002', name: 'Priya Patel', class: '10-A', gender: 'Female', phone: '+91 98765 43211', email: 'priya.patel@school.edu', dob: '2008-07-22', bloodGroup: 'A+', fatherName: 'Suresh Patel', motherName: 'Meena Patel', guardianName: 'Suresh Patel', address: 'Connaught Place, Delhi', status: 'Active' },
  { id: '3', admissionNo: 'STU2024003', name: 'Rahul Kumar', class: '9-B', gender: 'Male', phone: '+91 98765 43212', email: 'rahul.kumar@school.edu', dob: '2009-03-10', bloodGroup: 'B+', fatherName: 'Subhash Kumar', motherName: 'Anita Kumar', guardianName: 'Subhash Kumar', address: 'Karol Bagh, Delhi', status: 'Active' },
  { id: '4', admissionNo: 'STU2024004', name: 'Sneha Singh', class: '10-B', gender: 'Female', phone: '+91 98765 43213', email: 'sneha.singh@school.edu', dob: '2008-11-05', bloodGroup: 'AB+', fatherName: 'Vijay Singh', motherName: 'Pooja Singh', guardianName: 'Vijay Singh', address: 'Rohini, Delhi', status: 'Active' },
  { id: '5', admissionNo: 'STU2024005', name: 'Amit Verma', class: '9-A', gender: 'Male', phone: '+91 98765 43214', email: 'amit.verma@school.edu', dob: '2009-01-18', bloodGroup: 'O-', fatherName: 'Manoj Verma', motherName: 'Kiran Verma', guardianName: 'Manoj Verma', address: 'Dwarka, Delhi', status: 'Active' },
  { id: '6', admissionNo: 'STU2024006', name: 'Neha Gupta', class: '10-A', gender: 'Female', phone: '+91 98765 43215', email: 'neha.gupta@school.edu', dob: '2008-09-30', bloodGroup: 'A-', fatherName: 'Sanjay Gupta', motherName: 'Rekha Gupta', guardianName: 'Sanjay Gupta', address: 'Pitampura, Delhi', status: 'Active' },
  { id: '7', admissionNo: 'STU2024007', name: 'Vikram Reddy', class: '11-A', gender: 'Male', phone: '+91 98765 43216', email: 'vikram.reddy@school.edu', dob: '2007-06-12', bloodGroup: 'B-', fatherName: 'Prasad Reddy', motherName: 'Laxmi Reddy', guardianName: 'Prasad Reddy', address: 'Janakpuri, Delhi', status: 'Active' },
  { id: '8', admissionNo: 'STU2024008', name: 'Anjali Mehta', class: '11-B', gender: 'Female', phone: '+91 98765 43217', email: 'anjali.mehta@school.edu', dob: '2007-12-25', bloodGroup: 'AB-', fatherName: 'Harish Mehta', motherName: 'Sarita Mehta', guardianName: 'Harish Mehta', address: 'Lajpat Nagar, Delhi', status: 'Active' },
  { id: '9', admissionNo: 'STU2024009', name: 'Rohan Das', class: '12-A', gender: 'Male', phone: '+91 98765 43218', email: 'rohan.das@school.edu', dob: '2006-04-08', bloodGroup: 'O+', fatherName: 'Bimal Das', motherName: 'Tripti Das', guardianName: 'Bimal Das', address: 'Saket, Delhi', status: 'Active' },
  { id: '10', admissionNo: 'STU2024010', name: 'Kavya Iyer', class: '12-B', gender: 'Female', phone: '+91 98765 43219', email: 'kavya.iyer@school.edu', dob: '2006-08-14', bloodGroup: 'A+', fatherName: 'Krishna Iyer', motherName: 'Radha Iyer', guardianName: 'Krishna Iyer', address: 'Vasant Kunj, Delhi', status: 'Active' },
];

export default function StudentsPage() {
  const router = useRouter();
  const isSuperAdmin = useIsSuperAdmin();
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // Form data for add/edit
  const [formData, setFormData] = useState({
    name: '',
    admissionNo: '',
    class: '',
    gender: 'Male',
    phone: '',
    email: '',
    dob: '',
    bloodGroup: 'O+',
    fatherName: '',
    motherName: '',
    guardianName: '',
    address: '',
    status: 'Active'
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      admissionNo: '',
      class: '',
      gender: 'Male',
      phone: '',
      email: '',
      dob: '',
      bloodGroup: 'O+',
      fatherName: '',
      motherName: '',
      guardianName: '',
      address: '',
      status: 'Active'
    });
  };

  // Handle add student
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Date.now().toString(),
      ...formData,
      dob: formData.dob || '2010-01-01',
      bloodGroup: formData.bloodGroup || 'O+',
      address: formData.address || 'New Entry, School Record'
    };
    setStudents([newStudent, ...students]);
    setShowAddForm(false);
    resetFormData();
    toast.success('Student added successfully!');
  };

  // Handle edit click - open modal with student data
  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      admissionNo: student.admissionNo,
      class: student.class,
      gender: student.gender,
      phone: student.phone,
      email: student.email,
      dob: student.dob,
      bloodGroup: student.bloodGroup,
      fatherName: student.fatherName,
      motherName: student.motherName,
      guardianName: student.guardianName,
      address: student.address,
      status: student.status
    });
    setShowEditForm(true);
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedStudents = students.map(s =>
        s.id === selectedStudent.id
          ? { ...s, ...formData }
          : s
      );
      setStudents(updatedStudents);
      setShowEditForm(false);
      setSelectedStudent(null);
      resetFormData();
      toast.success('Student updated successfully!');
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view click
  const handleViewClick = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  // Handle delete click - show confirmation modal
  const handleDelete = (id: string) => {
    setStudentToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm and perform delete
  const confirmDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter(s => s.id !== studentToDelete));
      toast.success('Student deleted successfully');
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return student.status === 'Active';
    if (filter === 'MALE') return student.gender === 'Male';
    if (filter === 'FEMALE') return student.gender === 'Female';

    return true;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records and information</p>
        </div>
        {!isSuperAdmin && (
          <button
            onClick={() => {
              resetFormData();
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-background">
              <h2 className="text-xl font-bold">Add New Student</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admission No</label>
                  <input
                    required
                    type="text"
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="STU2024..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <input
                    required
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="10-A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="+91..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="john@school.edu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full p-2 border rounded-md bg-background text-left font-normal flex items-center justify-between",
                          !formData.dob && "text-muted-foreground"
                        )}
                      >
                        {formData.dob ? format(new Date(formData.dob), "PPP") : <span>Pick a date</span>}
                        <Calendar className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI
                        mode="single"
                        selected={formData.dob ? new Date(formData.dob) : undefined}
                        onSelect={(date) => setFormData({ ...formData, dob: date ? format(date, "yyyy-MM-dd") : "" })}
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded-md bg-background resize-none"
                  rows={2}
                  placeholder="Enter full address"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditForm && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-background">
              <h2 className="text-xl font-bold">Edit Student</h2>
              <button onClick={() => {
                setShowEditForm(false);
                setSelectedStudent(null);
                resetFormData();
              }} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admission No</label>
                  <input
                    required
                    type="text"
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <input
                    required
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full p-2 border rounded-md bg-background text-left font-normal flex items-center justify-between",
                          !formData.dob && "text-muted-foreground"
                        )}
                      >
                        {formData.dob ? format(new Date(formData.dob), "PPP") : <span>Pick a date</span>}
                        <Calendar className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI
                        mode="single"
                        selected={formData.dob ? new Date(formData.dob) : undefined}
                        onSelect={(date) => setFormData({ ...formData, dob: date ? format(date, "yyyy-MM-dd") : "" })}
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Graduated</option>
                    <option>Transferred</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded-md bg-background resize-none"
                  rows={2}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedStudent(null);
                    resetFormData();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-muted"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Student Details</h2>
              <button onClick={() => {
                setShowViewModal(false);
                setSelectedStudent(null);
              }} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.admissionNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Class</p>
                  <p className="font-medium">{selectedStudent.class}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedStudent.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{selectedStudent.dob}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{selectedStudent.bloodGroup}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedStudent.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedStudent.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedStudent.status === 'Active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditClick(selectedStudent);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setStudentToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => setFilter('ALL')}
          className={`bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${filter === 'ALL' ? 'ring-2 ring-primary border-primary' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold mt-1">{students.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('ACTIVE')}
          className={`bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${filter === 'ACTIVE' ? 'ring-2 ring-green-600 border-green-600' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {students.filter(s => s.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('MALE')}
          className={`bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${filter === 'MALE' ? 'ring-2 ring-blue-600 border-blue-600' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Male</p>
              <p className="text-2xl font-bold mt-1">
                {students.filter(s => s.gender === 'Male').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('FEMALE')}
          className={`bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${filter === 'FEMALE' ? 'ring-2 ring-pink-600 border-pink-600' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Female</p>
              <p className="text-2xl font-bold mt-1">
                {students.filter(s => s.gender === 'Female').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, admission number, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        {searchQuery && (
          <div className="mt-3 text-sm text-muted-foreground">
            Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4 text-left">Student Name</th>
                <th className="px-6 py-4 text-left">Admission No</th>
                <th className="px-6 py-4 text-left">Class</th>
                <th className="px-6 py-4 text-left">Contact Info</th>
                <th className="px-6 py-4 text-left">Gender</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.admissionNo}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="w-3 h-3" /> {student.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="w-3 h-3" /> {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${student.status === 'Active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/students/${student.id}`)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!isSuperAdmin && (
                        <>
                          <button
                            onClick={() => handleEditClick(student)}
                            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-blue-600 transition-colors"
                            title="Edit Student"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-600 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <p className="text-muted-foreground">No students found</p>
        </div>
      )}
    </div>
  );
}

