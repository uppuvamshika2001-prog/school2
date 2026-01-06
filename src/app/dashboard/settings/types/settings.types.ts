// Settings Type Definitions

export interface GeneralSettings {
  // Personal Information
  firstName: string;
  lastName: string;
  personalEmail: string;
  personalPhone: string;
  profilePicture?: string;
  
  // Organization Information
  organizationName: string;
  organizationLogo?: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  timezone: string;
  currency: string;
}

export interface AcademicSettings {
  academicYear: string;
  language: string;
  
  // Grading System
  gradeScale: 'letter' | 'percentage' | 'gpa';
  passingGrade: number;
  gradeCalculation: 'average' | 'weighted' | 'best';
  
  // Terms/Semesters
  numberOfTerms: number;
  termStartDate?: string;
  termEndDate?: string;
  
  // Attendance
  minimumAttendance: number;
  lateArrivalGrace: number; // minutes
  absenceNotification: boolean;
  
  // Academic Preferences
  showGradesToStudents: boolean;
}

export interface NotificationSettings {
  // Channels
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  
  // Categories
  attendanceAlerts: boolean;
  gradeUpdates: boolean;
  announcements: boolean;
  feeReminders: boolean;
  examSchedules: boolean;
  emergencyAlerts: boolean;
  
  // Advanced
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm format
  quietHoursEnd: string; // HH:mm format
  notificationFrequency: 'instant' | 'daily' | 'weekly';
  doNotDisturb: boolean;
}

export interface SecuritySettings {
  // Password Policy
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  passwordExpiry: number; // days
  passwordHistory: number; // prevent reuse
  
  // Two-Factor Authentication
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'app';
  
  // Session Management
  sessionTimeout: number; // minutes
  maxConcurrentSessions: number;
  forceLogoutOnPasswordChange: boolean;
  
  // Login Security
  maxFailedAttempts: number;
  lockoutDuration: number; // minutes
  ipWhitelist: string[];
  ipBlacklist: string[];
}

export interface AppearanceSettings {
  // Theme
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  
  // Layout
  sidebarCollapsed: boolean;
  sidebarAlwaysExpanded: boolean;
  sidebarAutoHide: boolean;
  cardSize: 'compact' | 'normal' | 'large';
  
  // Typography
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  lineHeight: number;
  letterSpacing: number;
  
  // Localization
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  firstDayOfWeek: 'sunday' | 'monday';
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.' | ' ';
}

export interface AllSettings {
  general: GeneralSettings;
  academic: AcademicSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
}

// Default Settings
export const defaultGeneralSettings: GeneralSettings = {
  firstName: '',
  lastName: '',
  personalEmail: '',
  personalPhone: '',
  organizationName: 'Springfield High School',
  address: '742 Evergreen Terrace, Springfield',
  contactPhone: '+1 (555) 0123-4567',
  contactEmail: 'admin@springfieldhigh.edu',
  website: 'www.springfieldhigh.edu',
  timezone: 'UTC-5 (Eastern Time)',
  currency: 'USD',
};

export const defaultAcademicSettings: AcademicSettings = {
  academicYear: '2024-2025',
  language: 'English',
  gradeScale: 'letter',
  passingGrade: 60,
  gradeCalculation: 'average',
  numberOfTerms: 2,
  minimumAttendance: 75,
  lateArrivalGrace: 15,
  absenceNotification: true,
  showGradesToStudents: true,
};

export const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  inAppNotifications: true,
  attendanceAlerts: true,
  gradeUpdates: true,
  announcements: true,
  feeReminders: true,
  examSchedules: true,
  emergencyAlerts: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  notificationFrequency: 'instant',
  doNotDisturb: false,
};

export const defaultSecuritySettings: SecuritySettings = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  passwordExpiry: 90,
  passwordHistory: 5,
  twoFactorEnabled: false,
  twoFactorMethod: 'email',
  sessionTimeout: 30,
  maxConcurrentSessions: 3,
  forceLogoutOnPasswordChange: true,
  maxFailedAttempts: 5,
  lockoutDuration: 15,
  ipWhitelist: [],
  ipBlacklist: [],
};

export const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'light',
  primaryColor: '#3b82f6',
  accentColor: '#8b5cf6',
  sidebarCollapsed: false,
  sidebarAlwaysExpanded: false,
  sidebarAutoHide: true,
  cardSize: 'normal',
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineHeight: 1.5,
  letterSpacing: 0,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  firstDayOfWeek: 'sunday',
  decimalSeparator: '.',
  thousandsSeparator: ',',
};
