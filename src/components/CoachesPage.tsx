import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, MoreVertical, User, Mail, Phone } from 'lucide-react';
import { useGAS } from '../hooks/useGAS';
import CoachModal from './CoachModal';

const CoachesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState<any>(null);
  const [newCoach, setNewCoach] = useState<any>({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: '',
    experiencia: '',
    certificaciones: '',
    activo: true
  });

  // Use Google Sheets hook
  const {
    coaches,
    loading,
    error,
    isConnected,
    loadCoaches,
    addCoach,
    updateCoach,
    deleteCoach
  } = useGAS();

  // Load coaches from localStorage
  useEffect(() => {
    // Data loading is now handled automatically by the hook
    // But we can trigger a refresh if needed
    if (coaches.length === 0) {
      loadCoaches();
    }
  }, []);

  // Filter coaches based on search term
  const filteredCoaches = coaches.filter(coach =>
    coach.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new coach
  const handleAddCoach = () => {
    if (newCoach.nombre && newCoach.email) {
      const coachData = {
        nombre: newCoach.nombre || '',
        email: newCoach.email || '',
        telefono: newCoach.telefono || '',
        especialidad: newCoach.especialidad || '',
        experiencia: newCoach.experiencia || '',
        certificaciones: newCoach.certificaciones || '',
        activo: newCoach.activo ?? true
      };

      addCoach(coachData);

      setNewCoach({
        nombre: '',
        email: '',
        telefono: '',
        especialidad: '',
        experiencia: '',
        certificaciones: '',
        activo: true
      });
      setShowAddModal(false);
    }
  };

  // Edit coach
  const handleEditCoach = () => {
    if (editingCoach) {
      updateCoach(editingCoach.id, editingCoach);
      setEditingCoach(null);
    }
  };

  // Delete coach
  const handleDeleteCoach = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este coach?')) {
      deleteCoach(id);
    }
  };

  // Toggle coach active status
  const toggleCoachStatus = async (id: string) => {
    const coach = coaches.find(c => c.id === id);
    if (coach) {
      updateCoach(id, { activo: !coach.activo });
    }
  };

  // Handler functions for modal
  const handleNewCoachChange = (field: string, value: string | boolean) => {
    setNewCoach((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditCoachChange = (field: string, value: string | boolean) => {
    setEditingCoach((prev: any) => prev ? { ...prev, [field]: value } : null);
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
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Coaches</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="wonder-gradient hover:shadow-lg text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 font-semibold"
            >
              <Plus size={16} />
              <span>Añadir Coach</span>
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
              placeholder="Buscar coaches..."
            />
          </div>
        </div>

        {/* Coaches Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Coach</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Especialidad</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Experiencia</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Certificaciones</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wide">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCoaches.map((coach) => (
                  <tr key={coach.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="text-green-600" size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{coach.nombre}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail size={12} className="mr-1" />
                            {coach.email}
                          </div>
                          {coach.telefono && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone size={12} className="mr-1" />
                              {coach.telefono}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{coach.especialidad}</td>
                    <td className="px-6 py-4 text-gray-700">{coach.experiencia}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">{coach.certificaciones}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleCoachStatus(coach.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${coach.activo
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                      >
                        {coach.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setEditingCoach(coach)}
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
                              onClick={() => handleDeleteCoach(coach.id)}
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

          {filteredCoaches.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No se encontraron coaches</p>
              <p className="text-gray-400">Intenta con otro término de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Coach Modal */}
      {showAddModal && (
        <CoachModal
          coach={newCoach}
          onSave={handleAddCoach}
          onClose={() => setShowAddModal(false)}
          title="Añadir Nuevo Coach"
          onCoachChange={handleNewCoachChange}
        />
      )}

      {/* Edit Coach Modal */}
      {editingCoach && (
        <CoachModal
          coach={editingCoach}
          onSave={handleEditCoach}
          onClose={() => setEditingCoach(null)}
          title="Editar Coach"
          onCoachChange={handleEditCoachChange}
        />
      )}
    </div>
  );
};

export default CoachesPage;