/**
 * @file TaskTable.jsx
 * @description Spreadsheet table listing tasks, statuses, assigning agents, and actions.
 */
import React from 'react';
import { getPriorityColor, getStatusColor, formatDate, getInitials, isOverdue, cn } from '../../utils/helpers';
import { ROLES, TASK_STATUS_LIST } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

/**
 * Tabular task list view.
 * @param {object[]} tasks
 * @param {Function} onEdit(task) - PM only
 * @param {Function} onDelete(taskId) - PM only
 * @param {Function} onStatusChange(taskId, newStatus)
 * @param {Function} onCreateNew - PM only, opens create modal
 */
/**
 * Renders a spreadsheet list layout for tasks. Includes inline status selectors,
 * assignees, due date urgency flags, and action triggers for PM roles.
 *
 * @param {object[]} props.tasks - Flat list arrays of tasks
 * @param {Function} props.onEdit - Task edit handler
 * @param {Function} props.onDelete - Task delete handler
 * @param {Function} props.onStatusChange - Quick status change dispatcher
 * @param {Function} props.onCreateNew - Create task callback
 */
export default function TaskTable({ tasks, onEdit, onDelete, onStatusChange, onCreateNew }) {
  const { role } = useAuth();
  const isPM = role === ROLES.PROJECT_MANAGER;

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No tasks found"
        description={isPM ? 'Create your first task to get the team moving.' : 'No tasks have been assigned to you yet.'}
        action={
          isPM && (
            <Button variant="primary" size="sm" onClick={onCreateNew}>
              + New Task
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="card overflow-hidden animate-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              {['Title', 'Status', 'Priority', 'Assigned To', 'Due Date', ...(isPM ? ['Actions'] : [])].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-[11px] font-medium text-zinc-500 tracking-wide uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const overdue = isOverdue(task.dueDate);
              return (
                <tr
                  key={task._id}
                  className="border-b last:border-0 hover:bg-zinc-800/30 transition-colors group"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  {/* Title */}
                  <td className="px-5 py-3.5 font-medium text-zinc-100 max-w-[280px]">
                    <p className="truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-[11px] text-zinc-600 truncate mt-0.5">{task.description}</p>
                    )}
                  </td>

                  {/* Status (interactive for all roles) */}
                  <td className="px-5 py-3.5">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange?.(task._id, e.target.value)}
                      className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer outline-none transition-colors focus-ring',
                        getStatusColor(task.status),
                        'bg-transparent'
                      )}
                    >
                      {TASK_STATUS_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Priority (read-only for Collaborator) */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>

                  {/* Assignees */}
                  <td className="px-5 py-3.5">
                    <div className="flex -space-x-1.5">
                      {(task.assignees ?? []).slice(0, 4).map((u) => (
                        <div
                          key={u._id}
                          title={u.name}
                          className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-semibold ring-2 ring-zinc-900"
                        >
                          {getInitials(u.name)}
                        </div>
                      ))}
                      {(task.assignees ?? []).length === 0 && (
                        <span className="text-[11px] text-zinc-600">—</span>
                      )}
                    </div>
                  </td>

                  {/* Due date */}
                  <td className="px-5 py-3.5">
                    <span className={cn('text-xs', overdue ? 'text-rose-400 font-medium' : 'text-zinc-400')}>
                      {overdue && '⚠ '}{formatDate(task.dueDate)}
                    </span>
                  </td>

                  {/* Actions (PM only) */}
                  {isPM && (
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit?.(task)}
                          className="text-zinc-500 hover:text-zinc-100 p-1.5 rounded hover:bg-zinc-700 transition-colors focus-ring"
                          aria-label="Edit task"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete?.(task._id)}
                          className="text-zinc-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-400/10 transition-colors focus-ring"
                          aria-label="Delete task"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
