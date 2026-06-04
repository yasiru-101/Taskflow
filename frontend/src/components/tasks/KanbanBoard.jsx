/**
 * @file KanbanBoard.jsx
 * @description Task board organizer rendering columns for "To Do", "In Progress", and "Completed".
 */
import React from 'react';
import KanbanColumn from './KanbanColumn';
import { TASK_STATUS_LIST } from '../../utils/constants';

/**
 * Three-column Kanban board.
 * @param {object[]} tasks - flat task list
 * @param {Function} onStatusChange(taskId, newStatus)
 * @param {Function} onCardClick(task)
 * @param {Function} onDelete(taskId) - PM only, handled inside TaskCard
 */
/**
 * Container that clusters a flat collection of task elements into columns by status.
 *
 * @param {object[]} props.tasks - Flat arrays of tasks
 * @param {Function} props.onStatusChange - Callback changing task status values
 * @param {Function} props.onCardClick - Action when selecting a task card
 * @param {Function} props.onDelete - Action deleting task cards (exclusive to Project Managers)
 */
export default function KanbanBoard({ tasks, onStatusChange, onCardClick, onDelete }) {
  const grouped = TASK_STATUS_LIST.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in">
      {TASK_STATUS_LIST.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={grouped[status]}
          onStatusChange={onStatusChange}
          onCardClick={onCardClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
