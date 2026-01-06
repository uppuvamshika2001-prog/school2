'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  User,
  Calendar,
  X,
  Coffee,
  Utensils
} from 'lucide-react';
import { toast } from 'sonner';

// Schedule Structure based on User Request
const scheduleStructure = [
  { id: 1, type: 'period', time: '09:00 - 09:45' },
  { id: 2, type: 'period', time: '09:45 - 10:30' },
  { id: 3, type: 'period', time: '10:30 - 11:15' },
  { id: 4, type: 'period', time: '11:15 - 12:30' },
  { id: 'lunch', type: 'break', time: '12:30 - 01:15', label: 'Lunch Break' },
  { id: 5, type: 'period', time: '01:15 - 02:00' },
  { id: 6, type: 'period', time: '02:00 - 02:45' },
  { id: 7, type: 'period', time: '02:45 - 03:30' },
  { id: 8, type: 'period', time: '03:30 - 04:15' },
];

// Grade-appropriate subjects based on Indian education standards
const getSubjectsForClass = (className: string): string[] => {
  const classNum = parseInt(className.replace('Class ', ''));
  
  if (classNum >= 1 && classNum <= 5) {
    // Primary Classes (1-5): Basic foundational subjects
    return ['English', 'Hindi', 'Maths', 'EVS', 'Drawing', 'Games', 'Library', 'GK'];
  } else if (classNum >= 6 && classNum <= 8) {
    // Middle Classes (6-8): Introduction to specialized subjects
    return ['English', 'Hindi', 'Telugu', 'Maths', 'Science', 'Social', 'Computer', 'Activities'];
  } else if (classNum >= 9 && classNum <= 10) {
    // Secondary Classes (9-10): Advanced curriculum
    return ['English', 'Hindi', 'Telugu', 'Maths', 'Science', 'Social', 'Computer', 'Library'];
  }
  
  // Default fallback
  return ['English', 'Hindi', 'Maths', 'Science', 'Social', 'Activities', 'Library', 'Computer'];
};

// Helper to generate a weekly schedule for a specific class and section
const generateWeeklySchedule = (className: string, sectionName: string) => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const schedule: any[] = [];
  
  // Get grade-appropriate subjects
  const subjects = getSubjectsForClass(className);
  
  days.forEach((day, dayIndex) => {
    // Rotate subjects for variety each day
    const dailySubjects = [...subjects];
    for (let i = 0; i < dayIndex; i++) {
      dailySubjects.push(dailySubjects.shift()!);
    }

    dailySubjects.forEach((subject, periodIndex) => {
      if (periodIndex < 8) { // Only 8 periods per day
        schedule.push({
          id: `${className}-${sectionName}-${day}-${periodIndex + 1}`,
          dayOfWeek: day,
          periodNumber: periodIndex + 1,
          subject: subject,
          teacher: `Teacher ${subject.substring(0, 3)}`,
          class: className,
          section: sectionName,
          room: subject.includes('Computer') || subject.includes('Lab') ? 'Computer Lab' : 
                subject === 'Library' ? 'Library' : 
                subject === 'Games' || subject === 'Activities' ? 'Ground' : '101',
          type: subject === 'Activities' || subject === 'Games' || subject === 'Library' || subject === 'Drawing' ? 'Activity' : 
                subject === 'Computer' ? 'Practical' : 'Theory'
        });
      }
    });
  });
  
  return schedule;
};

// Define all Classes (1-10) with their sections
const definedClasses = [
  { name: 'Class 1', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 2', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 3', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 4', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 5', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 6', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 7', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 8', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 9', sections: ['Section A', 'Section B', 'Section C'] },
  { name: 'Class 10', sections: ['Section A', 'Section B', 'Section C'] },
];

// Generate Full Dataset
const initialTimetables = definedClasses.flatMap(cls => 
  cls.sections.flatMap(sec => generateWeeklySchedule(cls.name, sec))
);




function TimetableContent() {
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const sectionParam = searchParams.get('section');

  const { user } = useAuthStore();
  const [timetables, setTimetables] = useState(initialTimetables);
  const [editMode, setEditMode] = useState<string | null>(null);
  
  const [selectedClass, setSelectedClass] = useState('Class 1');
  const [selectedSection, setSelectedSection] = useState('Section A');

  useEffect(() => {
    if (classParam) {
      setSelectedClass(decodeURIComponent(classParam));
    }
    if (sectionParam) {
      setSelectedSection(decodeURIComponent(sectionParam));
    }
  }, [classParam, sectionParam]);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const handleEdit = (id: string) => {
    setEditMode(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this period?')) {
      setTimetables(prev => prev.filter(t => t.id !== id));
      toast.success('Period removed successfully');
    }
  };

  const handleSave = (id: string, newSubject: string) => {
    setTimetables(prev => prev.map(t => t.id === id ? { ...t, subject: newSubject } : t));
    setEditMode(null);
    toast.success('Timetable updated successfully');
  };

  const handleAddPeriod = (day: string, periodNumber: number) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newPeriod = {
      id: newId,
      dayOfWeek: day,
      periodNumber,
      subject: 'New Subject',
      teacher: 'Select Teacher',
      class: selectedClass,
      section: selectedSection,
      room: 'TBD',
      type: 'Theory'
    };
    setTimetables([...timetables, newPeriod]);
    setEditMode(newId);
  };

  const getTimetableEntry = (day: string, period: number) => {
    return timetables.find(
      (t) => t.dayOfWeek === day && t.periodNumber === period && t.class === selectedClass && t.section === selectedSection
    );
  };

  const handleAutoGenerate = () => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    
    // Get grade-appropriate subjects
    const allSubjects = getSubjectsForClass(selectedClass);
    const coreSubjects = allSubjects.filter(s => !['Activities', 'Games', 'Library', 'Drawing'].includes(s));
    const activitySubjects = allSubjects.filter(s => ['Activities', 'Games', 'Library', 'Drawing'].includes(s));
    
    const newTimetable: any[] = [];
    
    days.forEach((day, dayIndex) => {
      // Rotate core subjects for variety
      const dailyCoreSubjects = [...coreSubjects];
      for (let i = 0; i < dayIndex; i++) {
        dailyCoreSubjects.push(dailyCoreSubjects.shift()!);
      }
      
      // Generate periods 1-6 (core subjects)
      for (let period = 1; period <= 6; period++) {
        const subjectIndex = (period - 1) % dailyCoreSubjects.length;
        const subject = dailyCoreSubjects[subjectIndex];
        
        newTimetable.push({
          id: `auto-${selectedClass}-${selectedSection}-${day}-${period}`,
          dayOfWeek: day,
          periodNumber: period,
          subject: subject,
          teacher: `Teacher ${subject.substring(0, 3)}`,
          class: selectedClass,
          section: selectedSection,
          room: subject === 'Computer' ? 'Computer Lab' : '101',
          type: subject === 'Computer' ? 'Practical' : 'Theory'
        });
      }
      
      // Generate periods 7-8 (activities)
      activitySubjects.slice(0, 2).forEach((subject, idx) => {
        newTimetable.push({
          id: `auto-${selectedClass}-${selectedSection}-${day}-${7 + idx}`,
          dayOfWeek: day,
          periodNumber: 7 + idx,
          subject: subject,
          teacher: subject === 'Library' ? 'Librarian' : subject === 'Drawing' ? 'Art Teacher' : 'PT Sir',
          class: selectedClass,
          section: selectedSection,
          room: subject === 'Library' ? 'Library' : subject === 'Drawing' ? 'Art Room' : 'Ground',
          type: 'Activity'
        });
      });
    });
    
    setTimetables(prev => [
      ...prev.filter(t => !(t.class === selectedClass && t.section === selectedSection)),
      ...newTimetable
    ]);
    
    toast.success(`AI-generated optimized timetable for ${selectedClass} - ${selectedSection}!`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Master Timetable</h1>
          <p className="text-muted-foreground mt-1">
            Manage Schedules for {selectedClass} - {selectedSection}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
           {/* Class Selector */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 3">Class 3</option>
            <option value="Class 4">Class 4</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>

           {/* Section Selector */}
           <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
          </select>

          <button
            onClick={handleAutoGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Clock className="w-5 h-5" />
            Auto-Generate
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold border-r w-24 sticky left-0 bg-muted/50 z-10">
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="px-3 py-2 text-center font-semibold border-r last:border-r-0"
                  >
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleStructure.map((slot) => {
                if (slot.type === 'break') {
                   return (
                     <tr key={`break-${slot.id}`} className="bg-yellow-50/50 dark:bg-yellow-900/10 border-b last:border-b-0">
                       <td className="px-3 py-1.5 border-r font-medium text-xs text-yellow-700 dark:text-yellow-500 sticky left-0 bg-yellow-50/50 dark:bg-yellow-900/10 z-10">
                          <div className="flex flex-col items-center">
                              <span>{slot.time}</span>
                          </div>
                       </td>
                       <td colSpan={days.length} className="px-3 py-1.5 text-center text-xs font-semibold text-yellow-700 dark:text-yellow-500 uppercase tracking-widest">
                           {slot.label === 'Lunch Break' ? (
                               <span className="flex items-center justify-center gap-2"><Utensils className="w-3 h-3"/> LUNCH BREAK</span>
                           ) : (
                               <span className="flex items-center justify-center gap-2"><Coffee className="w-3 h-3"/> SHORT BREAK</span>
                           )}
                       </td>
                     </tr>
                   );
                }
                
                return (
                  <tr key={slot.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 border-r bg-muted/30 sticky left-0 z-10">
                      <div className="text-center">
                        <p className="font-semibold text-sm">Period {slot.id}</p>
                        <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {slot.time}
                        </p>
                      </div>
                    </td>
                    {days.map((day) => {
                      const entry = getTimetableEntry(day, Number(slot.id));
                      const isEditing = editMode === entry?.id;

                      return (
                        <td
                          key={`${day}-${slot.id}`}
                          className="px-1 py-1 border-r last:border-r-0 hover:bg-muted/10 transition-colors align-top h-20"
                        >
                          {entry ? (
                            <div className="group relative h-full">
                              <div className={`
                                  h-full rounded p-1.5 border shadow-sm transition-all text-xs flex flex-col justify-between
                                  ${isEditing ? 'bg-background ring-1 ring-primary border-primary' : 'bg-card border-border hover:border-primary/50'}
                              `}>
                                {isEditing ? (
                                  <div className="space-y-1">
                                    <select
                                      value={entry.subject}
                                      onChange={(e) => handleSave(entry.id, e.target.value)}
                                      className="w-full px-1 py-0.5 text-xs font-bold border rounded bg-background"
                                      autoFocus
                                    >
                                      {getSubjectsForClass(selectedClass).map((subj: string) => (
                                        <option key={subj} value={subj}>{subj}</option>
                                      ))}
                                    </select>
                                    <div className="flex justify-end gap-1">
                                      <button onClick={() => setEditMode(null)} className="p-0.5 hover:bg-muted rounded"><X className="w-3 h-3" /></button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-start justify-between gap-0.5">
                                      <p className="font-bold truncate text-primary/90" title={entry.subject}>
                                        {entry.subject}
                                      </p>
                                    </div>
                                    <div className="space-y-0.5 mt-auto">
                                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <User className="w-2.5 h-2.5" />
                                        <span className="truncate">{entry.teacher.split(' ')[1] || entry.teacher}</span>
                                      </div>
                                       {entry.type && (
                                         <span className={`text-[9px] px-1 py-0.5 rounded-full inline-block w-fit
                                            ${entry.type === 'Theory' ? 'bg-blue-100 text-blue-700' : 
                                              entry.type === 'Lab' ? 'bg-purple-100 text-purple-700' :
                                              entry.type === 'Practical' ? 'bg-orange-100 text-orange-700' :
                                              'bg-green-100 text-green-700'}
                                         `}>
                                            {entry.type}
                                         </span>
                                       )}
                                    </div>
                                     <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 flex gap-0.5 bg-background/90 rounded border shadow-sm z-20">
                                        <button onClick={() => handleEdit(entry.id)} className="p-1 hover:bg-primary/10 text-primary rounded">
                                          <Edit className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => handleDelete(entry.id)} className="p-1 hover:bg-destructive/10 text-destructive rounded">
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddPeriod(day, Number(slot.id))}
                              className="w-full h-full flex items-center justify-center border border-dashed border-muted/50 rounded hover:border-primary/50 hover:bg-primary/5 transition-colors group opacity-30 hover:opacity-100"
                            >
                              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading timetable...</div>}>
      <TimetableContent />
    </Suspense>
  );
}
