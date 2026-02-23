import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '../components/AppLayout';
import { taskService } from '../services/taskService';
import { getErrorMessage } from '../utils/errorHandler';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    taskService
      .getTasks()
      .then((data) => setTasks(data?.tasks || data || []))
      .catch((error) => toast.error(getErrorMessage(error, 'Unable to load dashboard')))
      .finally(() => setIsLoading(false));
  }, []);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    const doneCount = tasks.filter((task) => task.status === 'done').length;
    return Math.round((doneCount / tasks.length) * 100);
  }, [tasks]);

  return (
    <AppLayout title="Dashboard">
      {isLoading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="card">
            <h3>Sprint Progress</h3>
            <p>{progress}% completed</p>
          </div>
          <div className="card">
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </div>
        </>
      )}
    </AppLayout>
  );
}

export default DashboardPage;
