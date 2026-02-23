import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '../components/AppLayout';
import { taskService } from '../services/taskService';
import { getErrorMessage } from '../utils/errorHandler';

const columns = ['backlog', 'todo', 'in-progress', 'review', 'done'];

function SprintBoardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    taskService
      .getTasks()
      .then((data) => setTasks(data?.tasks || data || []))
      .catch((error) => toast.error(getErrorMessage(error, 'Unable to load sprint board')))
      .finally(() => setIsLoading(false));
  }, []);

  const groupedTasks = useMemo(() => {
    const map = Object.fromEntries(columns.map((column) => [column, []]));
    tasks.forEach((task) => {
      if (map[task.status]) {
        map[task.status].push(task);
      }
    });
    return map;
  }, [tasks]);

  return (
    <AppLayout title="Sprint Board">
      {isLoading ? (
        <p>Loading board...</p>
      ) : (
        <div className="board-grid">
          {columns.map((column) => (
            <section key={column} className="card">
              <h3>{column}</h3>
              {(groupedTasks[column] || []).map((task) => (
                <article key={task._id || task.id} className="task-item">
                  <strong>{task.title}</strong>
                  <p>{task.priority || 'medium'} priority</p>
                </article>
              ))}
            </section>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

export default SprintBoardPage;
