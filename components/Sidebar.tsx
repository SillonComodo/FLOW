import React from 'react';
import { LayoutDashboard, CheckSquare, Code2, Mail, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { id: ViewState.TASKS, icon: CheckSquare, label: 'Pendientes' },
    { id: ViewState.WORKSPACE, icon: Code2, label: 'Workspace' },
    { id: ViewState.MAIL, icon: Mail, label: 'Correo' },
  ];

  return (
    <div className="w-16 md:w-64 flex-shrink-0 bg-surface border-r border-surfaceHighlight flex flex-col h-screen transition-all duration-300">
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-surfaceHighlight">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
          U
        </div>
        <span className="hidden md:block ml-3 font-bold text-lg text-textMain tracking-wide">
          UniDevOS
        </span>
      </div>

      <nav className="flex-1 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors relative ${
                isActive 
                  ? 'text-primary bg-surfaceHighlight/50' 
                  : 'text-textMuted hover:text-textMain hover:bg-surfaceHighlight/30'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
              )}
              <Icon size={20} className={isActive ? 'text-primary' : ''} />
              <span className="hidden md:block ml-3 font-medium text-sm">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surfaceHighlight">
        <button className="flex items-center text-textMuted hover:text-textMain w-full">
          <Settings size={20} />
          <span className="hidden md:block ml-3 text-sm">Configuración</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;