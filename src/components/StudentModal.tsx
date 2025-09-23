import React from 'react';

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

interface Coach {
  id: string;
  nombre: string;
  especialidad: string;
  activo: boolean;
}

interface StudentModalProps {
  student: Partial<Student>;
  onSave: () => void;
  onClose: () => void;
  title: string;
  coaches: Coach[];
  onStudentChange: (field: string, value: string) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ 
  student, 
  onSave, 
  onClose, 
  title, 
  coaches,
  onStudentChange 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={student.nombre || ''}
              onChange={(e) => onStudentChange('nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="Nombre completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={student.email || ''}
              onChange={(e) => onStudentChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="email@ejemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={student.telefono || ''}
              onChange={(e) => onStudentChange('telefono', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="555-0000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Días de Entrenamiento</label>
            <input
              type="text"
              value={student.diasEntrenamiento || ''}
              onChange={(e) => onStudentChange('diasEntrenamiento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="3 días/semana"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Coach Asignado *</label>
            <select
              value={student.coachAsignado || ''}
              onChange={(e) => onStudentChange('coachAsignado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
            >
              <option value="">Seleccionar coach...</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.nombre}>
                  {coach.nombre} - {coach.especialidad}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nivel</label>
            <select
              value={student.nivel || 'Principiante'}
              onChange={(e) => onStudentChange('nivel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              value={student.fechaInicio || ''}
              onChange={(e) => onStudentChange('fechaInicio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Fin</label>
            <input
              type="date"
              value={student.fechaFin || ''}
              onChange={(e) => onStudentChange('fechaFin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Objetivos</label>
          <textarea
            value={student.objetivos || ''}
            onChange={(e) => onStudentChange('objetivos', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none"
            rows={3}
            placeholder="Objetivos del entrenamiento..."
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;