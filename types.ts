
export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string; // Changed from semester
  employeeId: string; // Changed from studentId
  bio: string;
  imageUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  usn: string; // University Seat Number / ID
  semester: string;
  department: string;
  email: string;
  cgpa: number;
  attendance: number;
  // New Detailed Fields
  phone?: string;
  guardian?: string;
  dob?: string;
  address?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  description: string;
}

export interface Mark {
  id: string;
  subject: string;
  score: number;
  total: number;
  testName: string;
  date: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  email: string;
  specialization: string;
  image?: string;
}

export interface LabSession {
  id: string;
  subject: string;
  topic: string;
  time: string;
  room: string;
  instructor: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  subject: string;
  totalClasses: number;
  attendedClasses: number;
  lastUpdated: string;
}
