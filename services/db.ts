
import { Note, Assignment, Mark, FacultyMember, LabSession, Achievement, ContactSubmission, AttendanceRecord, UserProfile, Student } from '../types';

const STORAGE_KEYS = {
  NOTES: 'studentsphere_notes',
  ASSIGNMENTS: 'studentsphere_assignments',
  MARKS: 'studentsphere_marks',
  FACULTY: 'studentsphere_faculty',
  LABS: 'studentsphere_labs',
  ACHIEVEMENTS: 'studentsphere_achievements',
  CONTACTS: 'studentsphere_contacts',
  ATTENDANCE: 'studentsphere_attendance',
  PROFILE: 'studentsphere_profile',
  STUDENTS: 'studentsphere_students',
};

// Helper to generate 40 students
const generateStudents = (): Student[] => {
  const students: Student[] = [];
  const names = [
    "Aditya Kumar", "Priya Sharma", "Rahul Verma", "Sneha Gupta", "Vikram Singh", "Ananya Das", "Rohan Mehta", "Kavya Iyer", "Arjun Nair", "Meera Reddy",
    "Siddharth Rao", "Nisha Patel", "Varun Chopra", "Ishita Malhotra", "Karan Johar", "Pooja Hegde", "Manoj Bajpayee", "Kiara Advani", "Ranbir Kapoor", "Alia Bhatt",
    "Shahrukh Khan", "Deepika P", "Ranveer Singh", "Katrina Kaif", "Salman Khan", "Aamir Khan", "Hrithik Roshan", "Kangana R", "Akshay Kumar", "Twinkle K",
    "Ajay Devgn", "Kajol D", "Saif Ali Khan", "Kareena K", "Shahid Kapoor", "Mira Rajput", "Vicky Kaushal", "Katrina Turquotte", "Kartik Aaryan", "Sara Ali Khan"
  ];

  for (let i = 0; i < 40; i++) {
    const id = (i + 1).toString();
    const usnSuffix = (i + 1).toString().padStart(3, '0');
    const usn = `1CR21EC${usnSuffix}`;
    
    students.push({
      id: id,
      name: names[i] || `Student ${i + 1}`,
      usn: usn,
      semester: '5th',
      department: 'Electronics & Communication',
      email: `${names[i]?.split(' ')[0].toLowerCase()}${usnSuffix}@sambhram.edu`,
      cgpa: parseFloat((Math.random() * (9.8 - 6.0) + 6.0).toFixed(2)),
      attendance: Math.floor(Math.random() * (100 - 60) + 60),
      phone: `98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      guardian: `Parent of ${names[i]?.split(' ')[0]}`,
      dob: `2003-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
      address: `${Math.floor(Math.random() * 100) + 1}, Street ${Math.floor(Math.random() * 10)}, Bangalore`
    });
  }
  return students;
};

const SEED_DATA = {
  NOTES: [
    { id: '1', title: 'Digital Signal Processing', content: 'The Nyquist-Shannon sampling theorem states that a signal can be perfectly reconstructed if sampled at twice its highest frequency.', date: '2023-10-05', tags: ['Electronics', 'DSP'] },
    { id: '2', title: 'Industrial Automation', content: 'PLCs (Programmable Logic Controllers) use ladder logic for controlling manufacturing processes. Key components: Input, CPU, Output.', date: '2023-10-08', tags: ['Automation', 'Control'] },
  ],
  ASSIGNMENTS: [
    { id: '1', subject: 'DSP', title: 'DSP Assignment 1', dueDate: '2023-11-15', status: 'PENDING', description: 'Solve circuit problems 1-10 in Chapter 4.' },
    { id: '2', subject: 'VLSI', title: 'VLSI Lab Report', dueDate: '2023-11-10', status: 'COMPLETED', description: 'Analyze the frequency spectrum of the audio signal.' },
    { id: '3', subject: 'Digital Communication', title: 'DC Assignment', dueDate: '2023-11-20', status: 'IN_PROGRESS', description: 'Design a traffic light controller using ladder logic.' },
  ],
  MARKS: [
    { id: '1', subject: 'Network Analysis', score: 85, total: 100, testName: 'Midterm 1', date: '2023-09-15' },
    { id: '2', subject: 'DSP', score: 78, total: 100, testName: 'Quiz 1', date: '2023-09-20' },
    { id: '3', subject: 'Automation', score: 92, total: 100, testName: 'Unit Test', date: '2023-10-01' },
    { id: '4', subject: 'Network Analysis', score: 88, total: 100, testName: 'Midterm 2', date: '2023-10-25' },
    { id: '5', subject: 'Digital Communication', score: 70, total: 100, testName: 'Theory Exam', date: '2023-10-15' },
  ],
  FACULTY: [
    { id: '1', name: 'Dr. Roopa', department: 'Basic Electronics', email: 'roopa@uni.std', specialization: 'Semiconductors', image: 'https://picsum.photos/200/200?random=1' },
    { id: '2', name: 'Prof. Savitha', department: 'Network Analysis', email: 'savitha0@uni.std', specialization: 'Circuit Theory', image: 'https://picsum.photos/200/200?random=2' },
    { id: '3', name: 'Dr. Ramesh', department: 'Control Systems', email: 'ramesh@uni.std', specialization: 'Automation', image: 'https://picsum.photos/200/200?random=3' },
  ],
  LABS: [
    { id: '1', subject: 'VLSI', topic: 'CMOS Inverter Design', time: 'Tue 02:00 PM', room: 'Lab 301', instructor: 'Dr. Shreesha' },
    { id: '2', subject: 'MATLAB', topic: 'Digital Signal Processing', time: 'Thu 10:00 AM', room: 'Comp Lab 2', instructor: 'Prof. Rao' },
  ],
  ACHIEVEMENTS: [
    { id: '1', title: 'Dean\'s List', date: '2023-05-20', description: 'Awarded for GPA > 3.8', icon: '🏆' },
    { id: '2', title: 'Hackathon Winner', date: '2023-09-10', description: 'First place in Campus Hackathon', icon: '💻' },
  ],
  ATTENDANCE: [
    { id: '1', subject: 'Network Analysis', totalClasses: 30, attendedClasses: 26, lastUpdated: '2023-10-28' },
    { id: '2', subject: 'DSP', totalClasses: 28, attendedClasses: 20, lastUpdated: '2023-10-27' },
    { id: '3', subject: 'Automation', totalClasses: 25, attendedClasses: 24, lastUpdated: '2023-10-26' },
    { id: '4', subject: 'Digital Communication', totalClasses: 22, attendedClasses: 16, lastUpdated: '2023-10-25' },
    { id: '5', subject: 'VLSI', totalClasses: 15, attendedClasses: 15, lastUpdated: '2023-10-24' },
  ],
  PROFILE: {
    id: '1',
    name: 'Dr. Shreesha',
    email: 'shreesha@sambhram.org',
    department: 'Electronics & Communication',
    designation: 'Professor & HOD',
    employeeId: 'FAC-EC-001',
    bio: 'Passionate about embedded systems, signal processing, and mentoring the next generation of engineers.',
    imageUrl: 'https://sambhramit.com/wp-content/uploads/2022/03/sambhram-logo.png'
  },
  STUDENTS: generateStudents() // Initial 40 students
};

// Helper to simulate async database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic LocalStorage Helper
const getCollection = <T>(key: string, seed: any[] = []): T[] => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

const getObject = <T>(key: string, seed: any): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

const setCollection = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const setObject = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
  // Notes
  getNotes: async (): Promise<Note[]> => {
    await delay(200);
    return getCollection<Note>(STORAGE_KEYS.NOTES, SEED_DATA.NOTES);
  },
  addNote: async (note: Note): Promise<void> => {
    await delay(200);
    const notes = getCollection<Note>(STORAGE_KEYS.NOTES);
    setCollection(STORAGE_KEYS.NOTES, [note, ...notes]);
  },
  deleteNote: async (id: string): Promise<void> => {
    await delay(200);
    const notes = getCollection<Note>(STORAGE_KEYS.NOTES);
    setCollection(STORAGE_KEYS.NOTES, notes.filter(n => n.id !== id));
  },

  // Assignments
  getAssignments: async (): Promise<Assignment[]> => {
    await delay(200);
    return getCollection<Assignment>(STORAGE_KEYS.ASSIGNMENTS, SEED_DATA.ASSIGNMENTS);
  },
  updateAssignment: async (updated: Assignment): Promise<void> => {
    await delay(200);
    const items = getCollection<Assignment>(STORAGE_KEYS.ASSIGNMENTS);
    const index = items.findIndex(i => i.id === updated.id);
    if (index !== -1) {
      items[index] = updated;
      setCollection(STORAGE_KEYS.ASSIGNMENTS, items);
    }
  },

  // Marks
  getMarks: async (): Promise<Mark[]> => {
    await delay(200);
    return getCollection<Mark>(STORAGE_KEYS.MARKS, SEED_DATA.MARKS);
  },

  // Faculty
  getFaculty: async (): Promise<FacultyMember[]> => {
    await delay(200);
    return getCollection<FacultyMember>(STORAGE_KEYS.FACULTY, SEED_DATA.FACULTY);
  },

  // Labs
  getLabs: async (): Promise<LabSession[]> => {
    await delay(200);
    return getCollection<LabSession>(STORAGE_KEYS.LABS, SEED_DATA.LABS);
  },
  addLab: async (lab: LabSession): Promise<void> => {
    await delay(200);
    const labs = getCollection<LabSession>(STORAGE_KEYS.LABS);
    setCollection(STORAGE_KEYS.LABS, [lab, ...labs]);
  },

  // Achievements
  getAchievements: async (): Promise<Achievement[]> => {
    await delay(200);
    return getCollection<Achievement>(STORAGE_KEYS.ACHIEVEMENTS, SEED_DATA.ACHIEVEMENTS);
  },

  // Attendance
  getAttendance: async (): Promise<AttendanceRecord[]> => {
    await delay(200);
    return getCollection<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE, SEED_DATA.ATTENDANCE);
  },

  // Students (New)
  getStudents: async (): Promise<Student[]> => {
    await delay(200);
    return getCollection<Student>(STORAGE_KEYS.STUDENTS, SEED_DATA.STUDENTS);
  },
  addStudent: async (student: Student): Promise<void> => {
    await delay(200);
    const list = getCollection<Student>(STORAGE_KEYS.STUDENTS);
    setCollection(STORAGE_KEYS.STUDENTS, [student, ...list]);
  },
  updateStudent: async (updated: Student): Promise<void> => {
    await delay(200);
    const list = getCollection<Student>(STORAGE_KEYS.STUDENTS);
    const index = list.findIndex(s => s.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
      setCollection(STORAGE_KEYS.STUDENTS, list);
    }
  },
  addStudentsBulk: async (students: Student[]): Promise<void> => {
    await delay(500);
    const list = getCollection<Student>(STORAGE_KEYS.STUDENTS);
    setCollection(STORAGE_KEYS.STUDENTS, [...students, ...list]);
  },

  // Contact
  saveContact: async (submission: ContactSubmission): Promise<void> => {
    await delay(500);
    const contacts = getCollection<ContactSubmission>(STORAGE_KEYS.CONTACTS, []);
    setCollection(STORAGE_KEYS.CONTACTS, [...contacts, submission]);
  },

  // Profile
  getUserProfile: async (): Promise<UserProfile> => {
    await delay(200);
    return getObject<UserProfile>(STORAGE_KEYS.PROFILE, SEED_DATA.PROFILE);
  },
  updateUserProfile: async (profile: UserProfile): Promise<void> => {
    await delay(300);
    setObject(STORAGE_KEYS.PROFILE, profile);
  },
  // Get a single student profile (mocking login for student)
  getStudentProfile: async (usn: string): Promise<Student | undefined> => {
     await delay(300);
     const students = getCollection<Student>(STORAGE_KEYS.STUDENTS, SEED_DATA.STUDENTS);
     // For demo purposes, if USN is "demo", return the first student
     if (usn === 'demo') return students[0];
     return students.find(s => s.usn.toLowerCase() === usn.toLowerCase());
  }
};
