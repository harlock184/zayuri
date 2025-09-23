import React from 'react';
import { Users, Settings, Home } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'students',
      label: 'Alumnos',
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      id: 'coaches',
      label: 'Coaches',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="/wondergym_logo.png"
            alt="Wonder Gym Logo"
            className="h-10 w-auto object-contain"
          />
          {/* <div>
            <h2 className="font-bold text-gray-800 text-lg">Wonder Gym</h2>
            <p className="text-sm text-gray-500">Digital Planner</p>
          </div> */}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${isActive
                    ? `${item.bgColor} ${item.color} font-semibold shadow-sm`
                    : `text-gray-600 ${item.hoverColor} hover:text-gray-800`
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-semibold text-sm">CA</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Coach Zayuri</p>
            <p className="text-xs text-gray-500">Entrenador Principal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;