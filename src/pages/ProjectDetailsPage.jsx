import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProjectById, addTeamMember } from '../services/projectService';
import { getSprintsByProject, createSprint } from '../services/sprintService';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');

  const [sprintData, setSprintData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    goal: ''
  });

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [{ data: projectData }, { data: sprintsData }] = await Promise.all([
        getProjectById(projectId),
        getSprintsByProject(projectId)
      ]);
      setProject(projectData.project);
      setSprints(sprintsData.sprints);
    } catch (error) {
      toast.error('Failed to load project details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await addTeamMember(projectId, memberEmail);
      toast.success('Member added successfully!');
      setMemberEmail('');
      setShowMemberModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      await createSprint({ ...sprintData, projectId });
      toast.success('Sprint created!');
      setSprintData({ name: '', startDate: '', endDate: '', goal: '' });
      setShowSprintModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create sprint');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  const uniqueTeamMembers = (project?.teamMembers || []).filter(
    (member, index, members) =>
      members.findIndex((candidate) => candidate._id === member._id) === index
  );

  return (
    <div>
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{project.name}</h1>
            <span className={`badge ${project.status === 'active' ? 'badge-emerald' : 'badge-amber'}`}>
              {project.status}
            </span>
          </div>
          <p className="text-slate-400 max-w-2xl">{project.description}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowMemberModal(true)} className="btn btn-secondary">
            Manage Team
          </button>
          <button onClick={() => setShowSprintModal(true)} className="btn btn-primary">
            Plan Sprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-6">Active & Upcoming Sprints</h2>
            {sprints.length === 0 ? (
              <div className="glass-card text-center py-12 text-slate-500">
                No sprints planned yet.
              </div>
            ) : (
              <div className="space-y-4">
                {sprints.map((sprint) => (
                  <div key={sprint._id} className="glass-card flex justify-between items-center group">
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors uppercase tracking-wide">
                        {sprint.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {new Date(sprint.startDate).toLocaleDateString()} — {new Date(sprint.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`badge text-[10px] ${sprint.status === 'active' ? 'badge-emerald' :
                          sprint.status === 'completed' ? 'badge-blue' : 'badge-amber'
                        }`}>
                        {sprint.status}
                      </span>
                      <Link to={`/sprints/board?sprintId=${sprint._id}&projectId=${projectId}`} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="glass-card !border-slate-800 bg-slate-900/40">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">
              Team Members
            </h2>
            <div className="space-y-4">
              {uniqueTeamMembers.map((member) => (
                <div key={member._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold uppercase">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 py-6 overflow-y-auto">
          <div className="glass-card w-full max-w-md animate-fade-in !bg-slate-900 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">Invite Team Member</h3>
            <form onSubmit={handleAddMember} className="form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowMemberModal(false)} className="btn btn-secondary flex-1">Close</button>
                <button type="submit" className="btn btn-primary flex-1">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sprint Modal */}
      {showSprintModal && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 py-6 overflow-y-auto">
          <div className="glass-card w-full max-w-md animate-fade-in !bg-slate-900 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">Plan New Sprint</h3>
            <form onSubmit={handleCreateSprint} className="form">
              <div className="form-group">
                <label className="form-label">Sprint Name</label>
                <input
                  type="text"
                  value={sprintData.name}
                  onChange={(e) => setSprintData({ ...sprintData, name: e.target.value })}
                  placeholder="Sprint 1"
                  required
                />
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    value={sprintData.startDate}
                    onChange={(e) => setSprintData({ ...sprintData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    value={sprintData.endDate}
                    onChange={(e) => setSprintData({ ...sprintData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Sprint Goal</label>
                <textarea
                  value={sprintData.goal}
                  onChange={(e) => setSprintData({ ...sprintData, goal: e.target.value })}
                  placeholder="Primary objective..."
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowSprintModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Create Sprint</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
