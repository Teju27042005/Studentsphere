
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../services/db';
import { Student } from '../types';
import { Search, UploadCloud, Download, Plus, User, MoreVertical, CheckSquare, FileSpreadsheet, X, Save, Calendar, MapPin, Phone, Briefcase } from 'lucide-react';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await db.getStudents();
    setStudents(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setLoading(true);

    // Simulate processing a CSV/Excel file
    setTimeout(async () => {
      const newStudents: Student[] = [
        { id: Date.now().toString(), name: 'Vikram Singh', usn: `1CR21EC${106 + Math.floor(Math.random() * 50)}`, semester: '5th', department: 'ECE', email: 'vikram@uni.edu', cgpa: 7.5, attendance: 82, phone: '9876543220', guardian: 'Father Singh', dob: '2003-01-01' },
        { id: (Date.now() + 1).toString(), name: 'Ananya Das', usn: `1CR21EC${106 + Math.floor(Math.random() * 50)}`, semester: '5th', department: 'ECE', email: 'ananya@uni.edu', cgpa: 8.8, attendance: 91, phone: '9876543221', guardian: 'Mother Das', dob: '2003-02-02' },
      ];

      await db.addStudentsBulk(newStudents);
      await fetchData();
      setLoading(false);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  const openAddModal = () => {
    setCurrentStudent({
      name: '', usn: '', semester: '5th', department: 'Electronics & Communication', email: '', cgpa: 0, attendance: 0,
      phone: '', guardian: '', dob: '', address: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setCurrentStudent({ ...student });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.name || !currentStudent.usn) return;

    if (isEditing && currentStudent.id) {
      await db.updateStudent(currentStudent as Student);
    } else {
      await db.addStudent({
        ...currentStudent,
        id: Date.now().toString(),
        // Defaults if missing
        cgpa: currentStudent.cgpa || 0,
        attendance: currentStudent.attendance || 0
      } as Student);
    }

    setIsModalOpen(false);
    fetchData();
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Students</h1>
          <p className="text-slate-500">Manage student enrollments and comprehensive details.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            {loading ? 'Processing...' : <><UploadCloud size={18} className="mr-2 text-blue-600" /> Upload List</>}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv,.xlsx,.xls" 
            onChange={handleFileUpload}
          />
          
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" /> Add Student
          </button>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <Search className="text-slate-400 ml-3 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Name, USN, or Email..." 
            className="w-full p-2 bg-transparent outline-none text-slate-700"
          />
        </div>
        <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
           <div>
             <p className="text-xs text-indigo-500 font-bold uppercase">Total Students</p>
             <p className="text-xl font-bold text-indigo-900">{students.length}</p>
           </div>
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
             <User size={20} />
           </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isUploading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center animate-pulse">
          <div className="mr-4">
            <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          </div>
          <div>
             <h3 className="text-blue-800 font-medium">Uploading Student Data...</h3>
             <p className="text-sm text-blue-600">Parsing file and updating database.</p>
          </div>
        </div>
      )}

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4">Name / USN</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4 text-center">CGPA</th>
                <th className="px-6 py-4 text-center">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => openEditModal(student)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-3 border border-slate-200">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{student.usn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {student.department} - {student.semester}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex flex-col text-xs">
                      <span className="mb-1">{student.email}</span>
                      {student.phone && <span className="text-slate-400">{student.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    <span className={student.cgpa >= 9 ? 'text-green-600' : student.cgpa >= 7.5 ? 'text-blue-600' : 'text-slate-600'}>
                      {student.cgpa}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                       student.attendance >= 75 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                     }`}>
                       {student.attendance}%
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? 'Edit Student Details' : 'Add New Student'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="studentForm" onSubmit={handleSaveStudent} className="space-y-6">
                
                {/* Section 1: Academic Info */}
                <div>
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center">
                    <Briefcase size={16} className="mr-2" /> Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Full Name *</label>
                      <input 
                        required
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.name}
                        onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})}
                        placeholder="e.g. Rahul Verma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">USN (Student ID) *</label>
                      <input 
                        required
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.usn}
                        onChange={e => setCurrentStudent({...currentStudent, usn: e.target.value})}
                        placeholder="e.g. 1CR21EC098"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                      <select 
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                        value={currentStudent.department}
                        onChange={e => setCurrentStudent({...currentStudent, department: e.target.value})}
                      >
                        <option>Electronics & Communication</option>
                        <option>Computer Science</option>
                        <option>Mechanical</option>
                        <option>Electrical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Semester</label>
                      <select 
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                        value={currentStudent.semester}
                        onChange={e => setCurrentStudent({...currentStudent, semester: e.target.value})}
                      >
                        <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                        <option>5th</option><option>6th</option><option>7th</option><option>8th</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">CGPA</label>
                      <input 
                        type="number" step="0.01" max="10"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.cgpa}
                        onChange={e => setCurrentStudent({...currentStudent, cgpa: parseFloat(e.target.value)})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Attendance (%)</label>
                      <input 
                        type="number" max="100"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.attendance}
                        onChange={e => setCurrentStudent({...currentStudent, attendance: parseFloat(e.target.value)})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 2: Contact & Personal */}
                <div>
                  <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center">
                    <User size={16} className="mr-2" /> Personal & Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email Address</label>
                      <input 
                        type="email"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.email}
                        onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})}
                        placeholder="student@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone Number</label>
                      <input 
                        type="tel"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.phone}
                        onChange={e => setCurrentStudent({...currentStudent, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Date of Birth</label>
                      <input 
                        type="date"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.dob}
                        onChange={e => setCurrentStudent({...currentStudent, dob: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Guardian Name</label>
                      <input 
                        type="text"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={currentStudent.guardian}
                        onChange={e => setCurrentStudent({...currentStudent, guardian: e.target.value})}
                        placeholder="Parent / Guardian Name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Residential Address</label>
                      <textarea 
                        rows={2}
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
                        value={currentStudent.address}
                        onChange={e => setCurrentStudent({...currentStudent, address: e.target.value})}
                        placeholder="Full address with pincode"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="studentForm"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm flex items-center"
              >
                <Save size={18} className="mr-2" /> {isEditing ? 'Update Details' : 'Save Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
