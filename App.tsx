import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Workspace from './pages/Workspace';
import MailPage from './pages/Mail';
import { ViewState, Task } from './types';

function App() {
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Shared state for demo purposes (usually would be in Context or Store)
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Leer documentación de React', source: 'Manual', dueDate: '2023-11-15', status: 'pending', priority: 'high' },
    { id: '2', title: 'Entrega de avance Tesis', source: 'Classroom', dueDate: '2023-11-18', status: 'pending', priority: 'high' },
    { id: '3', title: 'Reunión de grupo de estudio', source: 'Calendar', dueDate: '2023-11-16', status: 'completed', priority: 'medium' },
  ]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard tasks={tasks} setView={setView} />;
      case ViewState.TASKS:
        return <Tasks tasks={tasks} setTasks={setTasks} />;
      case ViewState.WORKSPACE:
        return <Workspace />;
      case ViewState.MAIL:
        return <MailPage />;
      default:
        return <Dashboard tasks={tasks} setView={setView} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-textMain overflow-hidden">
      <Sidebar currentView={currentView} setView={setView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top bar for mobile or breadcrumbs */}
        <div className="md:hidden h-14 border-b border-surfaceHighlight flex items-center px-4 bg-surface">
           <span className="font-bold">UniDevOS</span>
        </div>

        <div className="flex-1 overflow-auto relative">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;