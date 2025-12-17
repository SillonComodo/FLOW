import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Calendar, CheckCircle2, Circle, GraduationCap, AlertTriangle } from 'lucide-react';
import { Task } from '../types';
import { initGapi, initTokenClient, triggerAuth, fetchClassroomData } from '../services/classroomService';

interface TasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isConnected, setIsConnected] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    // Initialize Google API Client on mount
    initGapi().catch(console.error);
    
    // Initialize Token Client
    initTokenClient((response) => {
        setIsConnected(true);
        setAuthError(false);
        setLoading(false); // Stop loading if it was triggered by connect button
        handleFetchData();
    });
  }, []);

  const handleConnect = () => {
    setLoading(true);
    // Set a timeout to reset loading if the user closes the popup or gets stuck
    setTimeout(() => {
       if (!isConnected) setLoading(false);
    }, 5000); 
    
    try {
        triggerAuth();
    } catch (e) {
        setLoading(false);
        setAuthError(true);
    }
  };

  const handleFetchData = async () => {
    setLoading(true);
    try {
        const classroomTasks = await fetchClassroomData();
        
        setTasks(prev => {
            // Merge tasks avoiding duplicates
            const existingIds = new Set(prev.map(t => t.id));
            const newTasks = classroomTasks.filter(t => !existingIds.has(t.id));
            return [...prev, ...newTasks];
        });
    } catch (error) {
        console.error("Failed to fetch tasks", error);
        setAuthError(true);
    } finally {
        setLoading(false);
    }
  };

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Gestión de Tareas</h1>
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-sm text-textMuted flex items-center gap-2">
                {isConnected ? (
                    <span className="flex items-center gap-2 text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Conectado a Google Classroom
                    </span>
                ) : (
                    <span className="text-textMuted">Conecta tu cuenta para ver tareas reales</span>
                )}
            </p>
            {authError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Error de conexión. Verifica tu Client ID (debe ser tipo Web).
                </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {!isConnected ? (
              <button 
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#fbbc04]/10 hover:bg-[#fbbc04]/20 text-[#fbbc04] border border-[#fbbc04]/50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <GraduationCap size={18} />}
                {loading ? 'Conectando...' : 'Conectar Classroom'}
              </button>
          ) : (
            <button 
                onClick={handleFetchData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-textMain rounded-lg text-sm font-medium transition-colors"
            >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Sincronizando...' : 'Actualizar'}
            </button>
          )}
          
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Kanban-ish / List Controls */}
      <div className="flex gap-4 mb-6 border-b border-surfaceHighlight pb-2">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`pb-2 text-sm font-medium capitalize ${
              filter === f ? 'text-primary border-b-2 border-primary' : 'text-textMuted hover:text-textMain'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 text-textMuted">
            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay tareas en esta vista.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                task.status === 'completed' 
                  ? 'bg-surface/50 border-surfaceHighlight opacity-60' 
                  : 'bg-surface border-surfaceHighlight hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleStatus(task.id)}
                  className={`text-textMuted hover:text-primary transition-colors`}
                >
                  {task.status === 'completed' ? <CheckCircle2 className="text-green-500" /> : <Circle />}
                </button>
                <div>
                  <h3 className={`font-medium text-textMain ${task.status === 'completed' ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-textMuted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {task.dueDate}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded border ${
                      task.source === 'Classroom' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                      task.source === 'Calendar' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                      'border-gray-500/30 text-gray-400 bg-gray-500/10'
                    }`}>
                      {task.source}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;