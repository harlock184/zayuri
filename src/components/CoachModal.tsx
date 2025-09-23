import React from 'react';

interface Coach {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  experiencia: string;
  certificaciones: string;
  activo: boolean;
}

interface CoachModalProps {
  coach: Partial<Coach>;
  onSave: () => void;
  onClose: () => void;
  title: string;
  onCoachChange: (field: string, value: string | boolean) => void;
}

const CoachModal: React.FC<CoachModalProps> = ({ 
  coach, 
  onSave, 
  onClose, 
  title, 
  onCoachChange 
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
              value={coach.nombre || ''}
              onChange={(e) => onCoachChange('nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="Nombre completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={coach.email || ''}
              onChange={(e) => onCoachChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="email@wondergym.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={coach.telefono || ''}
              onChange={(e) => onCoachChange('telefono', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="555-0000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidad</label>
            <input
              type="text"
              value={coach.especialidad || ''}
              onChange={(e) => onCoachChange('especialidad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="Entrenamiento de Fuerza"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Experiencia</label>
            <input
              type="text"
              value={coach.experiencia || ''}
              onChange={(e) => onCoachChange('experiencia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              placeholder="5 años"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
            <select
              value={coach.activo ? 'true' : 'false'}
              onChange={(e) => onCoachChange('activo', e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Certificaciones</label>
          <textarea
            value={coach.certificaciones || ''}
            onChange={(e) => onCoachChange('certificaciones', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none"
            rows={3}
            placeholder="NASM-CPT, CSCS, etc..."
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

export default CoachModal;