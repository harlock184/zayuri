import React from 'react';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentsPage from './components/StudentsPage';
import CoachesPage from './components/CoachesPage';
import WonderGymPlanner from './components/WonderGymPlanner';

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

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'students' | 'coaches' | 'planner' | 'settings'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('planner');
  };

  const handleBackToStudents = () => {
    setCurrentView('students');
    setSelectedStudent(null);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as any);
    setSelectedStudent(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="flex-1">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'students' && <StudentsPage onSelectStudent={handleSelectStudent} />}
        {currentView === 'coaches' && <CoachesPage />}
        {currentView === 'planner' && (
          <WonderGymPlanner 
            student={selectedStudent || undefined} 
            onBack={handleBackToStudents} 
          />
        )}
        {currentView === 'settings' && (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
            <p className="text-gray-600 mt-2">Ajustes del sistema - Próximamente</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;