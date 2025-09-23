import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, MoreVertical, Calendar, User, ArrowRight } from 'lucide-react';
import { useGAS } from '../hooks/useGAS';
import StudentModal from './StudentModal';

interface Student {
  id: string;
  nombre: string;
  diasEntrenamiento: string;
  coachAsignado: string;
  fechaInicio: string;
  fechaFin: string;
  email?: string;
  telefono?: string;
  nivel?: string;
  objetivos?: string;
}

interface StudentsPageProps {
  onSelectStudent: (student: Student) => void;
}

const StudentsPage: React.FC<StudentsPageProps> = ({ onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    nombre: '',
    diasEntrenamiento: '',
    coachAsignado: '',
    fechaInicio: '',
    fechaFin: '',
    email: '',
    telefono: '',
    nivel: 'Principiante',
    objetivos: ''
  });

  // Use Google Sheets hook
  const {
    students,
    coaches,
    loading,
    error,
    isConnected,
    loadStudents,
    loadCoaches,
    addStudent,
    updateStudent,
    deleteStudent
  } = useGAS();

  // Load students from localStorage
  useEffect(() => {
    // Data loading is now handled automatically by the hook
    // But we can trigger a refresh if needed
    if (students.length === 0) {
      loadStudents();
    }
    if (coaches.length === 0) {
      loadCoaches();
    }
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.coachAsignado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get active coaches for dropdown
  const activeCoaches = coaches.filter(coach => coach.activo);
  // Add new student
  const handleAddStudent = () => {
    if (newStudent.nombre && newStudent.coachAsignado) {
      const studentData = {
        nombre: newStudent.nombre || '',
        diasEntrenamiento: newStudent.diasEntrenamiento || '',
        coachAsignado: newStudent.coachAsignado || '',
        fechaInicio: newStudent.fechaInicio || '',
        fechaFin: newStudent.fechaFin || '',
        email: newStudent.email || '',
        telefono: newStudent.telefono || '',
        nivel: newStudent.nivel || 'Principiante',
        objetivos: newStudent.objetivos || ''
      };

      addStudent(studentData);

      setNewStudent({
        nombre: '',
        diasEntrenamiento: '',
        coachAsignado: '',
        fechaInicio: '',
        fechaFin: '',
        email: '',
        telefono: '',
        nivel: 'Principiante',
        objetivos: ''
      });
      setShowAddModal(false);
    }
  };

  // Edit student
  const handleEditStudent = () => {
    if (editingStudent) {
      updateStudent(editingStudent.id, editingStudent);
      setEditingStudent(null);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
      deleteStudent(id);
    }
  };

  // Handler functions for modal
  const handleNewStudentChange = (field: string, value: string) => {
    setNewStudent((prev: Partial<Student>) => ({ ...prev, [field]: value }));
  };

  const handleEditStudentChange = (field: string, value: string) => {
    setEditingStudent((prev: Student | null) => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          {/* Connection Status */}
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ {error}
              </p>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Conectado a Google Sheets' : 'Usando almacenamiento local'}
              </span>
            </div>
            {loading && (
              <div className="text-sm text-gray-500">Cargando...</div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Alumnos</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="wonder-gradient hover:shadow-lg text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 font-semibold"
            >
              <Plus size={16} />
              <span>Añadir Alumno</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="Buscar alumnos..."
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Días de Entrenamiento</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Coach Asignado</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Fecha de Inicio</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Fecha de Fin</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="text-red-600" size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{student.nombre}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{student.diasEntrenamiento}</td>
                    <td className="px-6 py-4 text-gray-700">{student.coachAsignado}</td>
                    <td className="px-6 py-4 text-gray-700">{student.fechaInicio}</td>
                    <td className="px-6 py-4 text-gray-700">{student.fechaFin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver Plan"
                        >
                          <ArrowRight size={16} />
                        </button>
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <div className="relative group">
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No se encontraron alumnos</p>
              <p className="text-gray-400">Intenta con otro término de búsqueda</p>
            </div>
          )}
        </div>

      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <StudentModal
          student={newStudent}
          onSave={handleAddStudent}
          onClose={() => setShowAddModal(false)}
          title="Añadir Nuevo Alumno"
          coaches={activeCoaches}
          onStudentChange={handleNewStudentChange}
        />
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <StudentModal
          student={editingStudent}
          onSave={handleEditStudent}
          onClose={() => setEditingStudent(null)}
          title="Editar Alumno"
          coaches={activeCoaches}
          onStudentChange={handleEditStudentChange}
        />
      )}
    </div>
  );
};

export default StudentsPage;