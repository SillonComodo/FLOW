import React from 'react';
import { Clock, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { ViewState, Task } from '../types';

interface DashboardProps {
  tasks: Task[];
  setView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, setView }) => {
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-textMain">Bienvenido, Estudiante</h1>
        <p className="text-textMuted mt-2">Aquí está el resumen de tu entorno de desarrollo académico.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface border border-surfaceHighlight p-6 rounded-xl hover:border-primary transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Clock className="text-blue-500" size={24} />
            </div>
            <span className="text-2xl font-bold text-textMain">{pendingCount}</span>
          </div>
          <h3 className="text-textMuted text-sm font-medium">Tareas Pendientes</h3>
        </div>

        <div className="bg-surface border border-surfaceHighlight p-6 rounded-xl hover:border-red-500 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <span className="text-2xl font-bold text-textMain">{highPriorityCount}</span>
          </div>
          <h3 className="text-textMuted text-sm font-medium">Prioridad Alta</h3>
        </div>

        <div 
          onClick={() => setView(ViewState.WORKSPACE)}
          className="bg-surface border border-surfaceHighlight p-6 rounded-xl hover:border-violet-500 transition-colors group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
              <BookOpen className="text-violet-500" size={24} />
            </div>
            <span className="text-2xl font-bold text-textMain">+</span>
          </div>
          <h3 className="text-textMuted text-sm font-medium">Nuevo Proyecto</h3>
        </div>

        <div className="bg-surface border border-surfaceHighlight p-6 rounded-xl hover:border-emerald-500 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
            <span className="text-2xl font-bold text-textMain">85%</span>
          </div>
          <h3 className="text-textMuted text-sm font-medium">Productividad Semanal</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-surfaceHighlight rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-textMain">Próximas Entregas (N8N Feed)</h2>
            <button 
              onClick={() => setView(ViewState.TASKS)}
              className="text-xs text-primary hover:underline"
            >
              Ver todo
            </button>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-surfaceHighlight">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-textMain">{task.title}</p>
                    <p className="text-xs text-textMuted">{task.source} • {task.dueDate}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-textMuted text-sm">No hay tareas pendientes.</p>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface to-surfaceHighlight/50 border border-surfaceHighlight rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <h2 className="text-lg font-bold text-textMain mb-2">Workspace Inteligente</h2>
      <p className="text-textMuted text-sm mb-6 max-w-sm">
        Carga tus apuntes o código y usa OpenAI (GPT-4o-mini) para analizar, resumir o generar nuevas ideas.
      </p>
            <button 
                onClick={() => setView(ViewState.WORKSPACE)}
                className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
                Abrir Editor
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;