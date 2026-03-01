import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { getProjectById } from '../services/projectService';
import { getProjectMessages, sendProjectMessage } from '../services/chatService';

const ACCEPTED_ATTACHMENT_TYPES = [
  'image/*',
  'video/*',
  '.zip',
  '.rar',
  '.7z',
  '.pdf',
  '.txt',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
].join(',');

const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

const getApiBase = () => import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getSocketBase = () => getApiBase().replace(/\/api\/?$/, '');
const getAssetUrl = (value = '') => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${getSocketBase()}${value.startsWith('/') ? value : `/${value}`}`;
};

const getFileKind = (attachment) => {
  if (attachment?.kind) return attachment.kind;
  if (attachment?.mimeType?.startsWith('image/')) return 'image';
  if (attachment?.mimeType?.startsWith('video/')) return 'video';
  if (attachment?.mimeType?.includes('zip') || attachment?.mimeType?.includes('rar') || attachment?.mimeType?.includes('7z')) return 'archive';
  return 'file';
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const ProjectChatPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const listEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);

  const groupedCount = useMemo(() => messages.length, [messages]);

  const fetchMessages = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const [{ data: projectData }, { data: chatData }] = await Promise.all([
        getProjectById(projectId),
        getProjectMessages(projectId, { limit: 120 }),
      ]);

      setProject(projectData.project);
      setMessages(chatData.messages || []);
    } catch (error) {
      if (!silent) {
        toast.error(error.response?.data?.message || 'Failed to load project chat');
        navigate('/dashboard');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [projectId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketUrl = getSocketBase();

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 800,
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_project', projectId, (response) => {
        if (!response?.ok) {
          toast.error(response?.message || 'Failed to join project chat room');
        }
      });
    });

    socket.on('project_message:new', ({ message }) => {
      const incomingProjectId =
        typeof message?.projectId === 'string'
          ? message.projectId
          : message?.projectId?._id;

      if (!message || incomingProjectId !== projectId) return;

      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socket.on('connect_error', () => {
      toast.info('Realtime reconnecting...');
    });

    return () => {
      socket.off('project_message:new');
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupedCount]);

  const handleSend = async (event) => {
    event.preventDefault();
    const message = text.trim();
    if ((!message && attachments.length === 0) || sending) return;

    setSending(true);

    try {
      const { data } = await sendProjectMessage(projectId, {
        message,
        attachments,
      });

      if (data?.message?._id) {
        setMessages((prev) => {
          if (prev.some((msg) => msg._id === data.message._id)) return prev;
          return [...prev, data.message];
        });
      }

      setText('');
      setAttachments([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSelectAttachments = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const next = [...attachments];

    for (const file of files) {
      if (next.length >= MAX_ATTACHMENTS) {
        toast.info(`Only ${MAX_ATTACHMENTS} attachments allowed per message`);
        break;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${file.name} is larger than 20 MB`);
        continue;
      }

      next.push(file);
    }

    setAttachments(next);
    event.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_item, currentIndex) => currentIndex !== index));
  };

  if (loading) return <div className="text-center py-20">Loading chat...</div>;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <header className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Project Room</div>
          <h1 className="text-2xl font-bold">{project?.name} Chat</h1>
          <p className="text-sm text-slate-400">Premium team room for updates, blockers, and instant file sharing.</p>
        </div>
        <Link to={`/projects/${projectId}`} className="btn btn-secondary w-full sm:w-auto">
          Back to Project
        </Link>
      </header>

      <div className="glass-card !p-0 overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900/70 via-slate-950/70 to-slate-950/95">
        <div className="h-[56vh] sm:h-[58vh] overflow-y-auto p-4 sm:p-5 space-y-3 bg-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">
              No messages yet. Start the project discussion.
            </div>
          ) : (
            messages.map((msg) => {
              const mine = msg.senderId?._id === user?._id;
              const messageAttachments = msg.attachments || [];
              return (
                <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`message-pop max-w-[92%] sm:max-w-[72%] rounded-2xl px-4 py-3 border shadow-lg ${mine
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-100'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                    }`}>
                    <div className="text-[11px] mb-1 opacity-80 uppercase tracking-wide">
                      {mine ? 'You' : `${msg.senderId?.name || 'Member'} • ${msg.senderId?.role || 'user'}`}
                    </div>
                    {msg.message && <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>}

                    {messageAttachments.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {messageAttachments.map((attachment) => {
                          const fileKind = getFileKind(attachment);
                          const href = getAssetUrl(attachment.url);

                          if (fileKind === 'image') {
                            return (
                              <a
                                key={attachment.fileName}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl overflow-hidden border border-slate-700 hover:border-blue-400 transition-colors"
                              >
                                <img
                                  src={href}
                                  alt={attachment.originalName}
                                  className="w-full h-32 object-cover"
                                />
                              </a>
                            );
                          }

                          if (fileKind === 'video') {
                            return (
                              <a
                                key={attachment.fileName}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl overflow-hidden border border-slate-700 hover:border-blue-400 transition-colors"
                              >
                                <video
                                  src={href}
                                  controls
                                  className="w-full h-32 object-cover bg-black"
                                />
                              </a>
                            );
                          }

                          return (
                            <a
                              key={attachment.fileName}
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 hover:border-blue-400 transition-colors"
                            >
                              <span className="truncate text-xs font-medium">{attachment.originalName}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">{formatFileSize(attachment.size)}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    <div className="text-[10px] mt-1 opacity-60">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={listEndRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-slate-800 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 bg-slate-900/60">
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
            <span>Attach image, video, zip, or files</span>
            <span>{attachments.length}/{MAX_ATTACHMENTS}</span>
          </div>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={`${file.name}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5">
                  <span className="truncate text-xs">{file.name}</span>
                  <span className="text-[10px] text-slate-500">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-slate-500 hover:text-rose-400"
                    aria-label="Remove attachment"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_ATTACHMENT_TYPES}
              onChange={handleSelectAttachments}
              className="hidden"
            />

            <button
              type="button"
              className="btn btn-secondary w-full sm:w-auto shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              Attach Files
            </button>

            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type your message..."
              maxLength={1000}
            />

            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto shrink-0"
              disabled={sending || (!text.trim() && attachments.length === 0)}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectChatPage;
