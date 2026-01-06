'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Phone, Mail, MapPin, Calendar, BookOpen,
  FileText, TrendingUp, DollarSign, Download, Upload,
  Award, AlertCircle, CheckCircle, Clock, ChevronLeft,
  Eye, X, BarChart3, TrendingDown
} from 'lucide-react';
import { useIsSuperAdmin } from '@/stores/auth.store';
import { toast } from 'sonner';

// Enhanced Mock Data with Guardian and Comprehensive Results
// Enhanced Mock Data with Guardian and Comprehensive Results
const MOCK_STUDENTS_LIST = [
  {
    id: '1',
    name: 'Arjun Sharma',
    rollNo: '101',
    admissionNo: 'STU2024001',
    class: '10',
    section: 'A',
    dob: '2008-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    parent: {
      fatherName: 'Ramesh Sharma',
      motherName: 'Sita Sharma',
      guardianName: 'Ramesh Sharma',
      guardianRelation: 'Father',
      primaryPhone: '+91 98765 43210',
      alternatePhone: '+91 98765 43211',
      email: 'ramesh.sharma@example.com',
      address: 'Green Park, New Delhi'
    }
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: '102',
    admissionNo: 'STU2024002',
    class: '10',
    section: 'A',
    dob: '2008-07-22',
    gender: 'Female',
    bloodGroup: 'A+',
    parent: {
      fatherName: 'Suresh Patel',
      motherName: 'Meena Patel',
      guardianName: 'Suresh Patel',
      guardianRelation: 'Father',
      primaryPhone: '+91 98765 43211',
      alternatePhone: '+91 98765 43212',
      email: 'suresh.patel@example.com',
      address: 'Connaught Place, Delhi'
    }
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    rollNo: '103',
    admissionNo: 'STU2024003',
    class: '9',
    section: 'B',
    dob: '2009-03-10',
    gender: 'Male',
    bloodGroup: 'B+',
    parent: {
      fatherName: 'Subhash Kumar',
      motherName: 'Anita Kumar',
      guardianName: 'Subhash Kumar',
      guardianRelation: 'Father',
      primaryPhone: '+91 98765 43212',
      alternatePhone: '+91 98765 43213',
      email: 'subhash.kumar@example.com',
      address: 'Karol Bagh, Delhi'
    }
  }
];

// Fallback for demo
const DEFAULT_STUDENT = {
  id: '0',
  name: 'Default Student',
  rollNo: '0',
  admissionNo: 'ADM-000',
  class: '0',
  section: 'X',
  dob: '2000-01-01',
  gender: 'Other',
  bloodGroup: 'N/A',
  parent: {
    fatherName: 'N/A',
    motherName: 'N/A',
    guardianName: 'N/A',
    guardianRelation: 'N/A',
    primaryPhone: 'N/A',
    alternatePhone: 'N/A',
    email: 'N/A',
    address: 'N/A'
  }
};

// Comprehensive Exam Results with FA1, FA2, SA1, SA2, Weekly Tests
const EXAM_RESULTS = [
  {
    id: 'FA1',
    exam: 'FA1 (Formative Assessment 1)',
    type: 'FA',
    date: 'July 2023',
    total: 100,
    obtained: 88,
    percentage: 88,
    rank: 2,
    subjects: [
      { name: 'Mathematics', marks: 19, max: 20, grade: 'A+', improvement: 2 },
      { name: 'Science', marks: 18, max: 20, grade: 'A', improvement: 1 },
      { name: 'English', marks: 17, max: 20, grade: 'A', improvement: 0 },
      { name: 'Social Studies', marks: 16, max: 20, grade: 'A', improvement: -1 },
      { name: 'Computer Science', marks: 18, max: 20, grade: 'A', improvement: 3 },
    ]
  },
  {
    id: 'FA2',
    exam: 'FA2 (Formative Assessment 2)',
    type: 'FA',
    date: 'September 2023',
    total: 100,
    obtained: 92,
    percentage: 92,
    rank: 1,
    subjects: [
      { name: 'Mathematics', marks: 20, max: 20, grade: 'A+', improvement: 1 },
      { name: 'Science', marks: 19, max: 20, grade: 'A+', improvement: 1 },
      { name: 'English', marks: 18, max: 20, grade: 'A', improvement: 1 },
      { name: 'Social Studies', marks: 17, max: 20, grade: 'A', improvement: 1 },
      { name: 'Computer Science', marks: 18, max: 20, grade: 'A', improvement: 0 },
    ]
  },
  {
    id: 'SA1',
    exam: 'SA1 (Summative Assessment 1)',
    type: 'SA',
    date: 'October 2023',
    total: 500,
    obtained: 425,
    percentage: 85,
    rank: 3,
    subjects: [
      { name: 'Mathematics', marks: 95, max: 100, grade: 'A+', improvement: 5 },
      { name: 'Science', marks: 88, max: 100, grade: 'A', improvement: 3 },
      { name: 'English', marks: 82, max: 100, grade: 'A', improvement: 2 },
      { name: 'Social Studies', marks: 75, max: 100, grade: 'B+', improvement: -2 },
      { name: 'Computer Science', marks: 85, max: 100, grade: 'A', improvement: 0 },
    ]
  },
  {
    id: 'SA2',
    exam: 'SA2 (Summative Assessment 2)',
    type: 'SA',
    date: 'March 2024',
    total: 500,
    obtained: 445,
    percentage: 89,
    rank: 2,
    subjects: [
      { name: 'Mathematics', marks: 98, max: 100, grade: 'A+', improvement: 3 },
      { name: 'Science', marks: 92, max: 100, grade: 'A+', improvement: 4 },
      { name: 'English', marks: 85, max: 100, grade: 'A', improvement: 3 },
      { name: 'Social Studies', marks: 80, max: 100, grade: 'A', improvement: 5 },
      { name: 'Computer Science', marks: 90, max: 100, grade: 'A+', improvement: 5 },
    ]
  }
];

const WEEKLY_TESTS = [
  { id: 'W1', week: 'Week 1', subject: 'Mathematics', date: '2023-08-05', marks: 18, max: 20, status: 'Passed' },
  { id: 'W2', week: 'Week 2', subject: 'Science', date: '2023-08-12', marks: 17, max: 20, status: 'Passed' },
  { id: 'W3', week: 'Week 3', subject: 'English', date: '2023-08-19', marks: 16, max: 20, status: 'Passed' },
  { id: 'W4', week: 'Week 4', subject: 'Mathematics', date: '2023-08-26', marks: 19, max: 20, status: 'Passed' },
  { id: 'W5', week: 'Week 5', subject: 'Computer Science', date: '2023-09-02', marks: 20, max: 20, status: 'Passed' },
];

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isSuperAdmin = useIsSuperAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  // Find student by ID or use fallback
  const studentData = MOCK_STUDENTS_LIST.find(s => s.id === params.id) || {
    ...DEFAULT_STUDENT,
    name: `Student ${params.id}`,
    admissionNo: `STU-2024-${params.id.padStart(3, '0')}`
  };

  // Add mock attendance, fees, and documents to the found student
  const student = {
    ...studentData,
    attendance: {
      present: 145,
      total: 156,
      percentage: 92.5,
      history: Array.from({ length: 20 }, (_, i) => ({
        date: `2023-12-${String(i + 1).padStart(2, '0')}`,
        status: Math.random() > 0.15 ? 'Present' : (Math.random() > 0.5 ? 'Absent' : 'Late')
      }))
    },
    fees: {
      status: 'Paid',
      dueAmount: 0,
      history: [
        { id: 'F001', type: 'Term 1 Tuition', amount: 5000, date: '2023-06-15', status: 'Paid' },
        { id: 'F002', type: 'Transport', amount: 1200, date: '2023-06-15', status: 'Paid' },
        { id: 'F003', type: 'Term 2 Tuition', amount: 5000, date: '2023-11-15', status: 'Paid' }
      ]
    },
    documents: [
      { id: 'D001', name: 'Birth Certificate', type: 'PDF', date: '2023-01-10', size: '2.4 MB', url: '/docs/birth-cert.pdf' },
      { id: 'D002', name: 'Transfer Certificate', type: 'PDF', date: '2023-01-10', size: '1.2 MB', url: '/docs/tc.pdf' },
      { id: 'D003', name: 'Aadhar Card', type: 'JPG', date: '2023-02-15', size: '0.8 MB', url: '/docs/aadhar.jpg' }
    ]
  };
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const handleUploadDocument = () => {
    toast.success('Document uploaded successfully!');
    setShowUploadModal(false);
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDoc(doc);
    setShowDocViewer(true);
  };

  const handleDownloadDocument = (doc: any) => {
    toast.success(`Downloading ${doc.name}...`);
    // In production: window.open(doc.url, '_blank');
  };

  // Calculate overall performance analysis
  const calculateAnalysis = () => {
    const allMarks = EXAM_RESULTS.flatMap(exam => exam.subjects.map(s => (s.marks / s.max) * 100));
    const avgPercentage = allMarks.reduce((a, b) => a + b, 0) / allMarks.length;
    const trend = EXAM_RESULTS[EXAM_RESULTS.length - 1].percentage - EXAM_RESULTS[0].percentage;

    return {
      average: avgPercentage.toFixed(1),
      trend: trend > 0 ? 'Improving' : trend < 0 ? 'Declining' : 'Stable',
      trendValue: Math.abs(trend).toFixed(1),
      strongSubjects: ['Mathematics', 'Computer Science'],
      weakSubjects: ['Social Studies']
    };
  };

  const analysis = calculateAnalysis();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">
            Class {student.class}-{student.section} | Roll No: {student.rollNo} | {student.admissionNo}
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            Status: Active
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Personal Info */}
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Personal Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="font-medium">{student.dob}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">{student.gender}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Blood Group:</span>
                  <span className="font-medium">{student.bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Parent & Guardian Info */}
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" /> Parent / Guardian Details
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Father's Name:</span>
                  <span className="font-medium">{student.parent.fatherName}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Mother's Name:</span>
                  <span className="font-medium">{student.parent.motherName}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Guardian Name:</span>
                  <span className="font-medium">{student.parent.guardianName}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Relation:</span>
                  <span className="font-medium">{student.parent.guardianRelation}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Primary Phone:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {student.parent.primaryPhone}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Alternate Phone:</span>
                  <span className="font-medium">{student.parent.alternatePhone}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {student.parent.email}
                  </span>
                </div>
                <div className="col-span-2 text-sm">
                  <span className="text-muted-foreground block mb-1">Address:</span>
                  <span className="font-medium flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                    <span>{student.parent.address}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACADEMICS TAB */}
        {activeTab === 'academics' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="text-muted-foreground text-sm">Class & Section</p>
                <h3 className="text-2xl font-bold">{student.class}-{student.section}</h3>
              </div>
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="text-muted-foreground text-sm">Roll Number</p>
                <h3 className="text-2xl font-bold">{student.rollNo}</h3>
              </div>
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="text-muted-foreground text-sm">Admission Number</p>
                <h3 className="text-2xl font-bold">{student.admissionNo}</h3>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" /> Performance Analysis
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Overall Average</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.average}%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Trend</p>
                  <p className={`text-2xl font-bold flex items-center gap-1 ${analysis.trend === 'Improving' ? 'text-green-600' :
                      analysis.trend === 'Declining' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    {analysis.trend === 'Improving' ? <TrendingUp className="w-5 h-5" /> :
                      analysis.trend === 'Declining' ? <TrendingDown className="w-5 h-5" /> : null}
                    {analysis.trend}
                  </p>
                  <p className="text-xs text-muted-foreground">+{analysis.trendValue}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Strong Subjects</p>
                  <p className="text-sm font-medium text-purple-600">{analysis.strongSubjects.join(', ')}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Needs Improvement</p>
                  <p className="text-sm font-medium text-orange-600">{analysis.weakSubjects.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === 'results' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Exams: FA1, FA2, SA1, SA2 */}
            <div>
              <h3 className="text-lg font-bold mb-4">Formative & Summative Assessments</h3>
              {EXAM_RESULTS.map((exam) => (
                <div key={exam.id} className="bg-card rounded-xl border shadow-sm overflow-hidden mb-4">
                  <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{exam.exam}</h3>
                      <p className="text-sm text-muted-foreground">{exam.date} • Rank: #{exam.rank}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{exam.percentage}%</div>
                      <p className="text-xs text-muted-foreground">Total: {exam.obtained}/{exam.total}</p>
                    </div>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-muted-foreground">Subject</th>
                          <th className="px-4 py-2 text-right font-medium text-muted-foreground">Max</th>
                          <th className="px-4 py-2 text-right font-medium text-muted-foreground">Obtained</th>
                          <th className="px-4 py-2 text-right font-medium text-muted-foreground">Grade</th>
                          <th className="px-4 py-2 text-right font-medium text-muted-foreground">Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {exam.subjects.sort((a, b) => b.marks - a.marks).map((sub, idx) => (
                          <tr key={idx} className="hover:bg-muted/30">
                            <td className="px-4 py-2 font-medium">{sub.name}</td>
                            <td className="px-4 py-2 text-right">{sub.max}</td>
                            <td className="px-4 py-2 text-right">{sub.marks}</td>
                            <td className={`px-4 py-2 text-right font-bold ${sub.grade.startsWith('A') ? 'text-green-600' :
                                sub.grade.startsWith('B') ? 'text-blue-600' : 'text-orange-600'
                              }`}>
                              {sub.grade}
                            </td>
                            <td className={`px-4 py-2 text-right font-medium ${sub.improvement > 0 ? 'text-green-600' :
                                sub.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                              {sub.improvement > 0 ? '+' : ''}{sub.improvement}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {exam.subjects.some(s => (s.marks / s.max) * 100 < 35) && (
                      <div className="p-4 bg-red-50 border-t border-red-100 text-red-700 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Failed Subjects: {exam.subjects.filter(s => (s.marks / s.max) * 100 < 35).map(s => s.name).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Tests */}
            <div>
              <h3 className="text-lg font-bold mb-4">Weekly Test Results</h3>
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Week</th>
                      <th className="px-4 py-3 text-left font-medium">Subject</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-right font-medium">Marks</th>
                      <th className="px-4 py-3 text-right font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {WEEKLY_TESTS.map(test => (
                      <tr key={test.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{test.week}</td>
                        <td className="px-4 py-3">{test.subject}</td>
                        <td className="px-4 py-3 text-muted-foreground">{test.date}</td>
                        <td className="px-4 py-3 text-right font-mono">{test.marks}/{test.max}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${test.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {test.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FEES TAB */}
        {activeTab === 'fees' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="text-muted-foreground text-sm">Payment Status</p>
                <h3 className={`text-2xl font-bold ${student.fees.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {student.fees.status}
                </h3>
              </div>
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="text-muted-foreground text-sm">Due Amount</p>
                <h3 className="text-2xl font-bold">₹{student.fees.dueAmount}</h3>
              </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b font-bold">Payment History</div>
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Description</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {student.fees.history.map(rec => (
                    <tr key={rec.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">{rec.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{rec.date}</td>
                      <td className="px-4 py-3 text-right font-mono">₹{rec.amount}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Student Documents</h3>
              {!isSuperAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {student.documents.map(doc => (
                <div key={doc.id} className="flex p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4 h-fit">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1" title={doc.name}>{doc.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{doc.type} • {doc.size}</p>
                    <p className="text-xs text-muted-foreground mb-3">Uploaded on {doc.date}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="flex-1 text-xs border py-1.5 rounded hover:bg-muted transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="flex-1 text-xs bg-primary/10 text-primary py-1.5 rounded hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="text-muted-foreground text-sm">Attendance Percentage</p>
                <h3 className={`text-3xl font-bold ${student.attendance.percentage >= 75 ? 'text-green-600' : 'text-orange-600'}`}>
                  {student.attendance.percentage}%
                </h3>
              </div>
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="text-muted-foreground text-sm">Total Days Present</p>
                <h3 className="text-3xl font-bold">{student.attendance.present} <span className="text-lg text-muted-foreground font-normal">/ {student.attendance.total}</span></h3>
              </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b font-bold">Recent History</div>
              <div className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {student.attendance.history.map((day, idx) => (
                    <div key={idx} className={`w-14 h-16 rounded-lg flex flex-col items-center justify-center border ${day.status === 'Present' ? 'bg-green-50 border-green-200 text-green-700' :
                        day.status === 'Absent' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      }`}>
                      <span className="text-xs font-medium">{day.date.split('-')[2]}</span>
                      <span className="text-[10px] uppercase">{day.status.substring(0, 3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Document Type</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Birth Certificate</option>
                  <option>Transfer Certificate</option>
                  <option>Aadhar Card</option>
                  <option>Marksheet</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Select File</label>
                <input type="file" className="w-full p-2 border rounded-md" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted">
                  Cancel
                </button>
                <button onClick={handleUploadDocument} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocViewer && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedDoc.name}</h2>
              <button onClick={() => setShowDocViewer(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-muted/30 min-h-[400px]">
              <div className="text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Document Preview</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedDoc.type} • {selectedDoc.size}</p>
                <button
                  onClick={() => handleDownloadDocument(selectedDoc)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto"
                >
                  <Download className="w-4 h-4" /> Download Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
