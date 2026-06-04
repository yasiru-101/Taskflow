/**
 * @file TaskCard.jsx
 * @description Mini dashboard task card displaying details, due alerts, priority indicators, and statuses.
 */
import React from 'react';
import { getPriorityColor, getStatusColor, formatDate, getInitials, isOverdue, cn } from '../../utils/helpers';
import { ROLES, TASK_STATUS_LIST } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

/**
 * Compact task card for the Kanban board.
 * @param {object} task
 * @param {Function} onStatusChange
 * @param {Function} onClick - open detail/edit panel
 * @param {Function} onDelete - PM only
 */
/**
 * Compact presentation item for individual tasks. Triggers details dialogs 
 * and contains inline quick status selection drops.
 *
 * @param {object} props.task - Main task configuration structure
 * @param {Function} props.onStatusChange - Inline status modification handler
 * @param {Function} props.onClick - Click detail popover trigger
 * @param {Function} props.onDelete - Handler to remove task item
 */
export default function TaskCard({ task, onStatusChange, onClick, onDelete }) {
  const { role } = useAuth();
  const isPM = role === ROLES.PROJECT_MANAGER;
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className="card p-4 space-y-3 cursor-pointer group hover:border-indigo-500/30"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Priority + delete */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {isPM && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(task._id); }}
            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all p-1 rounded hover:bg-rose-400/10 focus-ring"
            aria-label="Delete task"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-2">{task.title}</p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        {/* Assignees */}
        <div className="flex -space-x-1.5">
          {(task.assignees ?? []).slice(0, 3).map((u) => (
            <div
              key={u._id}
              title={u.name}
              className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-semibold ring-2 ring-zinc-900"
            >
              {getInitials(u.name)}
            </div>
          ))}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <span className={cn('text-[10px] font-medium', overdue ? 'text-rose-400' : 'text-zinc-500')}>
            {overdue ? '⚠ ' : ''}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Status changer (always visible; PM full list, Collaborator same) */}
      <div onClick={(e) => e.stopPropagation()}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange?.(task._id, e.target.value)}
          className="w-full text-[10px] font-medium px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50 text-zinc-300 cursor-pointer focus-ring outline-none"
          aria-label="Change task status"
        >
          {TASK_STATUS_LIST.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
