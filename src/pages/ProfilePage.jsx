import AppLayout from '../components/AppLayout';
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <AppLayout title="Profile">
      <div className="card">
        <p><strong>Name:</strong> {user?.name || '-'}</p>
        <p><strong>Email:</strong> {user?.email || '-'}</p>
        <p><strong>Role:</strong> {user?.role || '-'}</p>
        <p><strong>Organization:</strong> {user?.organization || '-'}</p>
      </div>
    </AppLayout>
  );
}

export default ProfilePage;
