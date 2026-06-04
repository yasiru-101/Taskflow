/**
 * @file KanbanColumn.jsx
 * @description Visual column structure for the Kanban dashboard layout.
 */
import React from 'react';
import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';
import { ROLES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const COLUMN_META = {
  'To Do':       { dot: 'bg-zinc-500',    label: 'To Do',       bg: 'bg-zinc-800/30' },
  'In Progress': { dot: 'bg-indigo-500',  label: 'In Progress', bg: 'bg-indigo-500/5' },
  'Completed':   { dot: 'bg-emerald-500', label: 'Completed',   bg: 'bg-emerald-500/5' },
};

/**
 * Column renderer mapping card arrays inside column categories. Displays total counts 
 * and presents empty states.
 *
 * @param {string} props.status - Status category of the column
 * @param {object[]} props.tasks - Filtered tasks belonging to column status
 * @param {Function} props.onStatusChange - Callback updating card status
 * @param {Function} props.onCardClick - Details popup launcher callback
 * @param {Function} props.onDelete - Card delete callback
 */
export default function KanbanColumn({ status, tasks, onStatusChange, onCardClick, onDelete }) {
  const meta = COLUMN_META[status] ?? COLUMN_META['To Do'];
  const { role } = useAuth();
  const isPM = role === ROLES.PROJECT_MANAGER;

  return (
    <div className={`flex flex-col rounded-xl ${meta.bg} border border-zinc-800/60 min-h-[400px] overflow-hidden`}>
      {/* Column header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60">
        <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
        <span className="text-xs font-semibold text-zinc-300">{meta.label}</span>
        <span className="ml-auto text-[10px] text-zinc-600 font-medium bg-zinc-800 px-1.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {tasks.length === 0 ? (
          <EmptyState
            icon={meta.dot === 'bg-emerald-500' ? '🎉' : '📭'}
            title={status === 'Completed' ? 'Nothing done yet' : 'Empty column'}
            description={
              status === 'To Do'
                ? isPM
                  ? 'Create a new task to get started.'
                  : 'No tasks assigned here yet.'
                : status === 'In Progress'
                ? 'Tasks being worked on will appear here.'
                : 'Completed tasks will show up here.'
            }
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
              onClick={() => onCardClick?.(task)}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
