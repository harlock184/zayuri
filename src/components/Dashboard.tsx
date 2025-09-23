import React from 'react';
import { Users, Dumbbell, Calendar, TrendingUp, Clock, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Alumnos',
      value: '24',
      change: '+3 este mes',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Planes Activos',
      value: '18',
      change: '+2 esta semana',
      icon: Dumbbell,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Sesiones Hoy',
      value: '12',
      change: '8 completadas',
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Progreso Promedio',
      value: '78%',
      change: '+5% vs mes anterior',
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentActivities = [
    {
      student: 'Sofía Rodríguez',
      action: 'Completó rutina de piernas',
      time: 'Hace 2 horas',
      type: 'workout'
    },
    {
      student: 'Carlos Pérez',
      action: 'Nuevo plan asignado',
      time: 'Hace 4 horas',
      type: 'plan'
    },
    {
      student: 'Laura García',
      action: 'Sesión de cardio completada',
      time: 'Hace 6 horas',
      type: 'cardio'
    },
    {
      student: 'Diego Martínez',
      action: 'Evaluación de progreso',
      time: 'Ayer',
      type: 'evaluation'
    }
  ];

  const upcomingSessions = [
    {
      time: '09:00',
      student: 'Isabel López',
      type: 'Entrenamiento de fuerza',
      duration: '60 min'
    },
    {
      time: '10:30',
      student: 'Carlos Pérez',
      type: 'Cardio intensivo',
      duration: '45 min'
    },
    {
      time: '14:00',
      student: 'Sofía Rodríguez',
      type: 'Rutina completa',
      duration: '90 min'
    },
    {
      time: '16:30',
      student: 'Laura García',
      type: 'Evaluación mensual',
      duration: '30 min'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido de vuelta, Coach Zayuri</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 text-white`} style={{ color: stat.color.replace('bg-', '').replace('-500', '') }} />
                  </div>
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="mr-2 text-red-600" size={20} />
              Actividad Reciente
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    {activity.type === 'workout' && <Dumbbell className="text-red-600" size={16} />}
                    {activity.type === 'plan' && <Target className="text-red-600" size={16} />}
                    {activity.type === 'cardio' && <TrendingUp className="text-red-600" size={16} />}
                    {activity.type === 'evaluation' && <Calendar className="text-red-600" size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{activity.student}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="mr-2 text-red-600" size={20} />
              Próximas Sesiones
            </h2>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-red-600">{session.time}</span>
                    <span className="text-xs text-gray-500">{session.duration}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{session.student}</p>
                  <p className="text-xs text-gray-600">{session.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-center">
              <Users className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="font-semibold text-gray-600">Añadir Nuevo Alumno</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-center">
              <Dumbbell className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="font-semibold text-gray-600">Crear Plan de Entrenamiento</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-center">
              <Calendar className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="font-semibold text-gray-600">Programar Sesión</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;