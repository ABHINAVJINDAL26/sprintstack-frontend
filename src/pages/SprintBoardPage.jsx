import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSprintById, getSprintProgress } from '../services/sprintService';
import { getTasks, updateTask } from '../services/taskService';

const COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-800' },
  { id: 'todo', label: 'To Do', color: 'bg-blue-900/40' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-amber-900/30 text-amber-500' },
  { id: 'review', label: 'Review', color: 'bg-purple-900/30 text-purple-400' },
  { id: 'done', label: 'Done', color: 'bg-emerald-900/30 text-emerald-400' },
];

const SprintBoardPage = () => {
  const [searchParams] = useSearchParams();
  const sprintId = searchParams.get('sprintId');
  const projectId = searchParams.get('projectId');

  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!sprintId || !projectId) {
      setLoading(false);
      return;
    }
    fetchBoardData();
  }, [sprintId, projectId]);

  const fetchBoardData = async () => {
    try {
      const [{ data: sprintData }, { data: tasksData }, { data: progressData }] = await Promise.all([
        getSprintById(sprintId),
        getTasks({ projectId, sprintId }),
        getSprintProgress(sprintId)
      ]);
      setSprint(sprintData.sprint);
      setTasks(tasksData.tasks);
      setProgress(progressData);
    } catch (error) {
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus, currentStatus) => {
    // Basic optimistic UI
    const originalTasks = [...tasks];
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      await updateTask(taskId, { status: newStatus });
      toast.success(`Task moved to ${newStatus}`);
      fetchBoardData(); // Refresh progress stats
    } catch (error) {
      setTasks(originalTasks);
      toast.error(error.response?.data?.message || 'Invalid transition');
    }
  };

  if (!sprintId || !projectId) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold mb-3">Sprint Board</h1>
        <p className="text-slate-400 mb-6">Select a sprint from a project to open its board.</p>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20">Loading Board...</div>;

  return (
    <div className="animate-fade-in min-h-[calc(100vh-140px)] flex flex-col">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 mb-1">
            <Link to={`/projects/${projectId}`} className="hover:text-blue-400 uppercase tracking-widest font-bold">
              {sprint.projectId.name}
            </Link>
            <span>/</span>
            <span className="text-slate-300 font-semibold">{sprint.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            Sprint Board
            {progress && (
              <div className="flex items-center gap-2 text-xs font-normal">
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${progress.progressPercent}%` }}></div>
                </div>
                <span className="text-emerald-400 font-bold">{progress.progressPercent}% Done</span>
              </div>
            )}
          </h1>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link to={`/tasks/create?projectId=${projectId}&sprintId=${sprintId}`} className="btn btn-primary w-full md:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Task
          </Link>
        </div>
      </header>

      <div className="flex-1 flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-[280px] sm:w-80 flex flex-col">
            <div className={`px-4 py-3 rounded-t-xl ${col.color} border-x border-t border-slate-800 flex justify-between items-center`}>
              <span className="text-xs font-bold uppercase tracking-widest">{col.label}</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            <div className="flex-1 bg-slate-900/50 border-x border-b border-slate-800 rounded-b-xl p-3 space-y-3 overflow-y-auto">
              {tasks.filter(t => t.status === col.id).map(task => (
                <BoardTaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div className="text-center py-10 opacity-20 italic text-xs">Empty</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BoardTaskCard = ({ task, onStatusChange }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="glass-card !p-4 !rounded-xl cursor-pointer"
      onClick={() => setShowActions(!showActions)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold tracking-tighter ${task.priority === 'high' ? 'text-rose-500' :
            task.priority === 'medium' ? 'text-amber-500' : 'text-slate-500'
          }`}>
          {task.priority || 'No'} Priority
        </span>
        {task.storyPoints > 0 && (
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold">
            {task.storyPoints} pts
          </span>
        )}
      </div>
      <h4 className="text-sm font-semibold text-slate-200 mb-3 leading-snug line-clamp-2">
        {task.title}
      </h4>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            <div
              className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[8px] font-bold text-blue-400"
              title={task.assignedTo.name}
            >
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border border-dashed border-slate-600"></div>
          )}
          <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        </div>
        <Link
          to={`/tasks/${task._id}/edit`}
          className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </Link>
      </div>

      {showActions && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2 animate-fade-in" onClick={e => e.stopPropagation()}>
          <p className="w-full text-[8px] uppercase text-slate-600 font-bold mb-1">Move to:</p>
          {COLUMNS.filter(c => c.id !== task.status).map(col => (
            <button
              key={col.id}
              onClick={() => onStatusChange(task._id, col.id, task.status)}
              className="text-[9px] font-bold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors uppercase border border-slate-700"
            >
              {col.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SprintBoardPage;
