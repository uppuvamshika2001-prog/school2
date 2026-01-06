// ===========================================
// 🌱 DATABASE SEED FILE
// Populates database with dummy data for development
// ===========================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.timetable.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.classSubject.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.classTeacher.deleteMany();
  await prisma.studentGuardian.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.section.deleteMany();
  await prisma.class.deleteMany();
  await prisma.term.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Create Tenant (School)
  console.log('🏫 Creating school tenant...');
  const tenant = await prisma.tenant.create({
    data: {
      code: 'DEMO001',
      name: 'Demo High School',
      slug: 'demo-high-school',
      email: 'admin@demo-school.edu',
      phone: '+91 9876543210',
      address: '123 Education Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      subscriptionPlan: 'PREMIUM',
      isActive: true,
      maxStudents: 1000,
      maxTeachers: 100,
    },
  });

  // Create Super Admin
  console.log('👤 Creating super admin...');
  const superAdminPassword = await bcrypt.hash('SuperAdmin@123!', 10);
  await prisma.user.create({
    data: {
      email: 'superadmin@schoolerp.com',
      passwordHash: superAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      isEmailVerified: true,
    },
  });

  // Create School Admin
  console.log('👤 Creating school admin...');
  const adminPassword = await bcrypt.hash('SchoolAdmin@123!', 10);
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@demo-school.edu',
      passwordHash: adminPassword,
      firstName: 'School',
      lastName: 'Admin',
      phone: '+91 9876543210',
      role: 'SCHOOL_ADMIN',
      isActive: true,
      isEmailVerified: true,
    },
  });

  // Create Academic Year
  console.log('📅 Creating academic year...');
  const academicYear = await prisma.academicYear.create({
    data: {
      tenantId: tenant.id,
      name: '2024-2025',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      isCurrent: true,
      isActive: true,
    },
  });

  // Create Terms
  console.log('📆 Creating terms...');
  await prisma.term.createMany({
    data: [
      {
        academicYearId: academicYear.id,
        name: 'Term 1',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-09-30'),
        isCurrent: true,
      },
      {
        academicYearId: academicYear.id,
        name: 'Term 2',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2025-03-31'),
        isCurrent: false,
      },
    ],
  });

  // Create Classes
  console.log('🏫 Creating classes...');
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        tenantId: tenant.id,
        name: 'Class 8',
        code: 'C8',
        level: 8,
        description: 'Eighth Standard',
        isActive: true,
      },
    }),
    prisma.class.create({
      data: {
        tenantId: tenant.id,
        name: 'Class 9',
        code: 'C9',
        level: 9,
        description: 'Ninth Standard',
        isActive: true,
      },
    }),
    prisma.class.create({
      data: {
        tenantId: tenant.id,
        name: 'Class 10',
        code: 'C10',
        level: 10,
        description: 'Tenth Standard',
        isActive: true,
      },
    }),
  ]);

  // Create Sections
  console.log('📚 Creating sections...');
  const sections = [];
  for (const cls of classes) {
    for (const sectionName of ['A', 'B']) {
      const section = await prisma.section.create({
        data: {
          tenantId: tenant.id,
          classId: cls.id,
          name: sectionName,
          capacity: 40,
          roomNumber: `${cls.code}-${sectionName}`,
          isActive: true,
        },
      });
      sections.push(section);
    }
  }

  // Create Subjects
  console.log('📖 Creating subjects...');
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        tenantId: tenant.id,
        name: 'Mathematics',
        code: 'MATH',
        description: 'Mathematics and Numerical Skills',
        subjectType: 'CORE',
        isActive: true,
      },
    }),
    prisma.subject.create({
      data: {
        tenantId: tenant.id,
        name: 'Science',
        code: 'SCI',
        description: 'General Science',
        subjectType: 'CORE',
        isActive: true,
      },
    }),
    prisma.subject.create({
      data: {
        tenantId: tenant.id,
        name: 'English',
        code: 'ENG',
        description: 'English Language and Literature',
        subjectType: 'CORE',
        isActive: true,
      },
    }),
    prisma.subject.create({
      data: {
        tenantId: tenant.id,
        name: 'Hindi',
        code: 'HIN',
        description: 'Hindi Language',
        subjectType: 'LANGUAGE',
        isActive: true,
      },
    }),
    prisma.subject.create({
      data: {
        tenantId: tenant.id,
        name: 'Social Studies',
        code: 'SST',
        description: 'History, Geography, Civics',
        subjectType: 'CORE',
        isActive: true,
      },
    }),
    prisma.subject.create({
      data: {
        tenantId: tenant.id,
        name: 'Computer Science',
        code: 'CS',
        description: 'Computer Applications',
        subjectType: 'ELECTIVE',
        isActive: true,
      },
    }),
  ]);

  // Link subjects to classes
  console.log('🔗 Linking subjects to classes...');
  for (const cls of classes) {
    for (const subject of subjects) {
      await prisma.classSubject.create({
        data: {
          classId: cls.id,
          subjectId: subject.id,
          isCompulsory: subject.subjectType === 'CORE',
          weeklyPeriods: 5,
        },
      });
    }
  }

  // Create Teachers
  console.log('👨‍🏫 Creating teachers...');
  const teachersData = [
    {
      employeeId: 'T001',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      gender: 'MALE',
      email: 'rajesh.kumar@demo-school.edu',
      phone: '+91 9876543211',
      qualification: 'M.Sc Mathematics, B.Ed',
      specialization: 'Mathematics',
      experience: 10,
      designation: 'Senior Teacher',
      department: 'Mathematics',
      subject: 'Mathematics',
    },
    {
      employeeId: 'T002',
      firstName: 'Priya',
      lastName: 'Sharma',
      gender: 'FEMALE',
      email: 'priya.sharma@demo-school.edu',
      phone: '+91 9876543212',
      qualification: 'M.Sc Physics, B.Ed',
      specialization: 'Science',
      experience: 8,
      designation: 'Senior Teacher',
      department: 'Science',
      subject: 'Science',
    },
    {
      employeeId: 'T003',
      firstName: 'Amit',
      lastName: 'Patel',
      gender: 'MALE',
      email: 'amit.patel@demo-school.edu',
      phone: '+91 9876543213',
      qualification: 'M.A English, B.Ed',
      specialization: 'English',
      experience: 12,
      designation: 'HOD English',
      department: 'Languages',
      subject: 'English',
    },
    {
      employeeId: 'T004',
      firstName: 'Sunita',
      lastName: 'Verma',
      gender: 'FEMALE',
      email: 'sunita.verma@demo-school.edu',
      phone: '+91 9876543214',
      qualification: 'M.A Hindi, B.Ed',
      specialization: 'Hindi',
      experience: 7,
      designation: 'Teacher',
      department: 'Languages',
      subject: 'Hindi',
    },
    {
      employeeId: 'T005',
      firstName: 'Vikram',
      lastName: 'Singh',
      gender: 'MALE',
      email: 'vikram.singh@demo-school.edu',
      phone: '+91 9876543215',
      qualification: 'M.A History, B.Ed',
      specialization: 'Social Studies',
      experience: 9,
      designation: 'Senior Teacher',
      department: 'Social Science',
      subject: 'Social Studies',
    },
    {
      employeeId: 'T006',
      firstName: 'Neha',
      lastName: 'Gupta',
      gender: 'FEMALE',
      email: 'neha.gupta@demo-school.edu',
      phone: '+91 9876543216',
      qualification: 'MCA, B.Ed',
      specialization: 'Computer Science',
      experience: 5,
      designation: 'Teacher',
      department: 'Computer Science',
      subject: 'Computer Science',
    },
  ];

  const teachers = [];
  for (const teacherData of teachersData) {
    const teacher = await prisma.teacher.create({
      data: {
        tenantId: tenant.id,
        employeeId: teacherData.employeeId,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        gender: teacherData.gender,
        email: teacherData.email,
        phone: teacherData.phone,
        qualification: teacherData.qualification,
        specialization: teacherData.specialization,
        experience: teacherData.experience,
        designation: teacherData.designation,
        department: teacherData.department,
        joiningDate: new Date('2020-04-01'),
        employmentType: 'FULL_TIME',
        salary: 50000,
        isActive: true,
      },
    });
    teachers.push({ ...teacher, subjectName: teacherData.subject });

    // Create user account for teacher
    const teacherPassword = await bcrypt.hash('Teacher@123', 10);
    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        teacherId: teacher.id,
        email: teacherData.email,
        passwordHash: teacherPassword,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        phone: teacherData.phone,
        role: 'TEACHER',
        isActive: true,
        isEmailVerified: true,
      },
    });
  }

  // Link teachers to subjects
  console.log('🔗 Linking teachers to subjects...');
  for (const teacher of teachers) {
    const subject = subjects.find((s) => s.name === teacher.subjectName);
    if (subject) {
      await prisma.teacherSubject.create({
        data: {
          teacherId: teacher.id,
          subjectId: subject.id,
          isPrimary: true,
        },
      });
    }
  }

  // Create Students
  console.log('👨‍🎓 Creating students...');
  const studentsData = [
    {
      admissionNumber: 'STU001',
      firstName: 'Aarav',
      lastName: 'Sharma',
      gender: 'MALE',
      dateOfBirth: new Date('2010-05-15'),
      phone: '+91 9876543221',
      email: 'aarav.sharma@demo-school.edu',
      bloodGroup: 'A_POSITIVE',
      class: 'Class 10',
      section: 'A',
    },
    {
      admissionNumber: 'STU002',
      firstName: 'Ananya',
      lastName: 'Patel',
      gender: 'FEMALE',
      dateOfBirth: new Date('2010-08-22'),
      phone: '+91 9876543222',
      email: 'ananya.patel@demo-school.edu',
      bloodGroup: 'B_POSITIVE',
      class: 'Class 10',
      section: 'A',
    },
    {
      admissionNumber: 'STU003',
      firstName: 'Arjun',
      lastName: 'Kumar',
      gender: 'MALE',
      dateOfBirth: new Date('2010-03-10'),
      phone: '+91 9876543223',
      email: 'arjun.kumar@demo-school.edu',
      bloodGroup: 'O_POSITIVE',
      class: 'Class 10',
      section: 'B',
    },
    {
      admissionNumber: 'STU004',
      firstName: 'Diya',
      lastName: 'Singh',
      gender: 'FEMALE',
      dateOfBirth: new Date('2010-11-05'),
      phone: '+91 9876543224',
      email: 'diya.singh@demo-school.edu',
      bloodGroup: 'AB_POSITIVE',
      class: 'Class 10',
      section: 'B',
    },
    {
      admissionNumber: 'STU005',
      firstName: 'Rohan',
      lastName: 'Verma',
      gender: 'MALE',
      dateOfBirth: new Date('2011-01-20'),
      phone: '+91 9876543225',
      email: 'rohan.verma@demo-school.edu',
      bloodGroup: 'A_NEGATIVE',
      class: 'Class 9',
      section: 'A',
    },
    {
      admissionNumber: 'STU006',
      firstName: 'Isha',
      lastName: 'Gupta',
      gender: 'FEMALE',
      dateOfBirth: new Date('2011-06-18'),
      phone: '+91 9876543226',
      email: 'isha.gupta@demo-school.edu',
      bloodGroup: 'B_NEGATIVE',
      class: 'Class 9',
      section: 'A',
    },
    {
      admissionNumber: 'STU007',
      firstName: 'Kabir',
      lastName: 'Mehta',
      gender: 'MALE',
      dateOfBirth: new Date('2011-09-12'),
      phone: '+91 9876543227',
      email: 'kabir.mehta@demo-school.edu',
      bloodGroup: 'O_NEGATIVE',
      class: 'Class 9',
      section: 'B',
    },
    {
      admissionNumber: 'STU008',
      firstName: 'Myra',
      lastName: 'Joshi',
      gender: 'FEMALE',
      dateOfBirth: new Date('2011-12-25'),
      phone: '+91 9876543228',
      email: 'myra.joshi@demo-school.edu',
      bloodGroup: 'AB_NEGATIVE',
      class: 'Class 9',
      section: 'B',
    },
    {
      admissionNumber: 'STU009',
      firstName: 'Vihaan',
      lastName: 'Reddy',
      gender: 'MALE',
      dateOfBirth: new Date('2012-04-08'),
      phone: '+91 9876543229',
      email: 'vihaan.reddy@demo-school.edu',
      bloodGroup: 'A_POSITIVE',
      class: 'Class 8',
      section: 'A',
    },
    {
      admissionNumber: 'STU010',
      firstName: 'Saanvi',
      lastName: 'Nair',
      gender: 'FEMALE',
      dateOfBirth: new Date('2012-07-30'),
      phone: '+91 9876543230',
      email: 'saanvi.nair@demo-school.edu',
      bloodGroup: 'B_POSITIVE',
      class: 'Class 8',
      section: 'A',
    },
  ];

  const students = [];
  for (const studentData of studentsData) {
    const student = await prisma.student.create({
      data: {
        tenantId: tenant.id,
        admissionNumber: studentData.admissionNumber,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        gender: studentData.gender,
        dateOfBirth: studentData.dateOfBirth,
        phone: studentData.phone,
        email: studentData.email,
        bloodGroup: studentData.bloodGroup,
        nationality: 'Indian',
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, Mumbai`,
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        admissionDate: new Date('2024-04-01'),
        status: 'ACTIVE',
      },
    });
    students.push({ ...student, className: studentData.class, sectionName: studentData.section });

    // Create user account for student
    const studentPassword = await bcrypt.hash('Student@123', 10);
    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        studentId: student.id,
        email: studentData.email,
        passwordHash: studentPassword,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        phone: studentData.phone,
        role: 'STUDENT',
        isActive: true,
        isEmailVerified: true,
      },
    });
  }

  // Create Enrollments
  console.log('📝 Creating enrollments...');
  for (const student of students) {
    const cls = classes.find((c) => c.name === student.className);
    const section = sections.find(
      (s) => s.classId === cls?.id && s.name === student.sectionName
    );

    if (cls && section) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          academicYearId: academicYear.id,
          sectionId: section.id,
          rollNumber: student.admissionNumber.replace('STU', ''),
          enrollmentDate: new Date('2024-04-01'),
        },
      });
    }
  }

  // Create Timetable
  console.log('📅 Creating timetable...');
  const periods = [
    { number: 1, startTime: '08:00', endTime: '08:45' },
    { number: 2, startTime: '08:45', endTime: '09:30' },
    { number: 3, startTime: '09:30', endTime: '10:15' },
    { number: 4, startTime: '10:30', endTime: '11:15' },
    { number: 5, startTime: '11:15', endTime: '12:00' },
    { number: 6, startTime: '12:00', endTime: '12:45' },
    { number: 7, startTime: '13:30', endTime: '14:15' },
  ];

  // Create timetable for Class 10 Section A
  const class10 = classes.find((c) => c.name === 'Class 10');
  const section10A = sections.find((s) => s.classId === class10?.id && s.name === 'A');

  if (class10 && section10A) {
    const timetableEntries = [
      // Monday
      { day: 'MONDAY', period: 1, subject: 'Mathematics', teacher: 'Rajesh' },
      { day: 'MONDAY', period: 2, subject: 'Science', teacher: 'Priya' },
      { day: 'MONDAY', period: 3, subject: 'English', teacher: 'Amit' },
      { day: 'MONDAY', period: 4, subject: 'Hindi', teacher: 'Sunita' },
      { day: 'MONDAY', period: 5, subject: 'Social Studies', teacher: 'Vikram' },
      { day: 'MONDAY', period: 6, subject: 'Computer Science', teacher: 'Neha' },
      
      // Tuesday
      { day: 'TUESDAY', period: 1, subject: 'Science', teacher: 'Priya' },
      { day: 'TUESDAY', period: 2, subject: 'Mathematics', teacher: 'Rajesh' },
      { day: 'TUESDAY', period: 3, subject: 'Social Studies', teacher: 'Vikram' },
      { day: 'TUESDAY', period: 4, subject: 'English', teacher: 'Amit' },
      { day: 'TUESDAY', period: 5, subject: 'Computer Science', teacher: 'Neha' },
      { day: 'TUESDAY', period: 6, subject: 'Hindi', teacher: 'Sunita' },
      
      // Wednesday
      { day: 'WEDNESDAY', period: 1, subject: 'English', teacher: 'Amit' },
      { day: 'WEDNESDAY', period: 2, subject: 'Hindi', teacher: 'Sunita' },
      { day: 'WEDNESDAY', period: 3, subject: 'Mathematics', teacher: 'Rajesh' },
      { day: 'WEDNESDAY', period: 4, subject: 'Science', teacher: 'Priya' },
      { day: 'WEDNESDAY', period: 5, subject: 'Social Studies', teacher: 'Vikram' },
      { day: 'WEDNESDAY', period: 6, subject: 'Computer Science', teacher: 'Neha' },
      
      // Thursday
      { day: 'THURSDAY', period: 1, subject: 'Mathematics', teacher: 'Rajesh' },
      { day: 'THURSDAY', period: 2, subject: 'English', teacher: 'Amit' },
      { day: 'THURSDAY', period: 3, subject: 'Science', teacher: 'Priya' },
      { day: 'THURSDAY', period: 4, subject: 'Computer Science', teacher: 'Neha' },
      { day: 'THURSDAY', period: 5, subject: 'Hindi', teacher: 'Sunita' },
      { day: 'THURSDAY', period: 6, subject: 'Social Studies', teacher: 'Vikram' },
      
      // Friday
      { day: 'FRIDAY', period: 1, subject: 'Social Studies', teacher: 'Vikram' },
      { day: 'FRIDAY', period: 2, subject: 'Mathematics', teacher: 'Rajesh' },
      { day: 'FRIDAY', period: 3, subject: 'Hindi', teacher: 'Sunita' },
      { day: 'FRIDAY', period: 4, subject: 'English', teacher: 'Amit' },
      { day: 'FRIDAY', period: 5, subject: 'Science', teacher: 'Priya' },
      { day: 'FRIDAY', period: 6, subject: 'Computer Science', teacher: 'Neha' },
    ];

    for (const entry of timetableEntries) {
      const subject = subjects.find((s) => s.name === entry.subject);
      const teacher = teachers.find((t) => t.firstName === entry.teacher);
      const period = periods.find((p) => p.number === entry.period);

      if (subject && teacher && period) {
        await prisma.timetable.create({
          data: {
            tenantId: tenant.id,
            academicYearId: academicYear.id,
            sectionId: section10A.id,
            subjectId: subject.id,
            teacherId: teacher.id,
            dayOfWeek: entry.day,
            periodNumber: period.number,
            startTime: period.startTime,
            endTime: period.endTime,
            roomNumber: section10A.roomNumber,
            isActive: true,
          },
        });
      }
    }
  }

  console.log('\n✅ Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Tenants: 1`);
  console.log(`   - Users: ${2 + teachers.length + students.length}`);
  console.log(`   - Classes: ${classes.length}`);
  console.log(`   - Sections: ${sections.length}`);
  console.log(`   - Subjects: ${subjects.length}`);
  console.log(`   - Teachers: ${teachers.length}`);
  console.log(`   - Students: ${students.length}`);
  console.log(`   - Timetable entries: 30`);
  console.log('\n🔑 Login Credentials:');
  console.log('   Super Admin: superadmin@schoolerp.com / SuperAdmin@123!');
  console.log('   School Admin: admin@demo-school.edu / SchoolAdmin@123!');
  console.log('   Teachers: <teacher-email> / Teacher@123');
  console.log('   Students: <student-email> / Student@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
