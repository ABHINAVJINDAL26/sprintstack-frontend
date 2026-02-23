import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppLayout from '../components/AppLayout';
import { projectService } from '../services/projectService';
import { getErrorMessage } from '../utils/errorHandler';

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    projectService
      .getProjectById(projectId)
      .then((data) => setProject(data?.project || data))
      .catch((error) => toast.error(getErrorMessage(error, 'Unable to load project')))
      .finally(() => setIsLoading(false));
  }, [projectId]);

  return (
    <AppLayout title="Project Details">
      {isLoading ? <p>Loading project...</p> : <pre className="card">{JSON.stringify(project, null, 2)}</pre>}
    </AppLayout>
  );
}

export default ProjectDetailsPage;
