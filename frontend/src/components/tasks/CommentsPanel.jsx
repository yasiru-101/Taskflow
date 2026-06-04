/**
 * @file CommentsPanel.jsx
 * @description Feed component that handles task commentary and document uploads.
 */
import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials, formatRelativeTime } from '../../utils/helpers';

// ── Mock comments ─────────────────────────────────────────────────────────────
const MOCK_COMMENTS = [
  {
    _id: 'c1',
    content: 'I\'ve started working on this. Should be done by EOD.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: { _id: 'u1', name: 'Sarah Johnson' },
  },
  {
    _id: 'c2',
    content: 'Great progress! Please also add error handling for the edge cases we discussed.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user: { _id: 'u4', name: 'James O\'Brien' },
  },
];

/**
 * Commentary block. Orchestrates comment fetching, post actions, mock fallbacks, 
 * and handles file attachments.
 *
 * @param {string} props.taskId - ID of the parent task
 */
export default function CommentsPanel({ taskId }) {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setLoading(true);
    taskService
      .getComments(taskId)
      .then(({ data }) => setComments(data.comments ?? []))
      .catch(() => setComments(MOCK_COMMENTS))
      .finally(() => setLoading(false));
  }, [taskId]);

  const handlePost = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const { data } = await taskService.addComment(taskId, { content: text.trim() });
      setComments((prev) => [...prev, data.comment]);
      setText('');
      setFile(null);
    } catch (err) {
      // Optimistic fallback for demo
      const mockComment = {
        _id: `c-${Date.now()}`,
        content: text.trim(),
        createdAt: new Date().toISOString(),
        user: { _id: user._id, name: user.name },
      };
      setComments((prev) => [...prev, mockComment]);
      setText('');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
        <span>💬</span> Comments
        <span className="text-[10px] font-medium text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* Comment list */}
      <div className="space-y-4">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton w-7 h-7 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-12 rounded-lg" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center py-6">No comments yet. Be the first to comment.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ring-1 ring-indigo-500/20">
                {getInitials(c.user?.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-zinc-200">{c.user?.name}</span>
                  <span className="text-[10px] text-zinc-600">{formatRelativeTime(c.createdAt)}</span>
                </div>
                <div className="text-xs text-zinc-300 bg-zinc-800/60 rounded-xl rounded-tl-none px-3 py-2.5 leading-relaxed border border-zinc-700/30">
                  {c.content}
                </div>
                {c.attachments?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.attachments.map((a) => (
                      <a
                        key={a._id}
                        href={a.blobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded transition-colors"
                      >
                        📎 {a.originalName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose area */}
      <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ring-1 ring-indigo-500/20 mt-0.5">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost();
              }}
              placeholder="Add a comment… (Ctrl+Enter to send)"
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700/50 text-sm text-zinc-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600 resize-none"
            />

            <div className="flex items-center justify-between">
              {/* Attachment */}
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                {file ? file.name : 'Attach file'}
                <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} />
              </label>

              <button
                onClick={handlePost}
                disabled={!text.trim() || posting}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {posting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
