import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AppLayout({ title, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <nav className="nav">
        <strong>SprintStack</strong>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects/create">Create Project</Link>
          <Link to="/tasks/create">Create Task</Link>
          <Link to="/sprints/board">Sprint Board</Link>
          <Link to="/profile">Profile</Link>
          <button type="button" onClick={logout} className="btn secondary">
            Logout
          </button>
        </div>
      </nav>

      <main className="container">
        <header className="page-header">
          <h2>{title}</h2>
          {user ? <p>Signed in as {user.name || user.email}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
