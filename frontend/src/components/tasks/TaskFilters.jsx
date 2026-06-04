/**
 * @file TaskFilters.jsx
 * @description Horizontal workspace toolbar containing search inputs and status drop downs.
 */
import React from 'react';
import Input from '../common/Input';
import { TASK_STATUS_LIST, TASK_PRIORITY_LIST } from '../../utils/constants';

/**
 * Filter/search bar for the task workspace.
 * @param {object} filters - { search, status, priority }
 * @param {Function} onChange(name, value)
 */
/**
 * Filters component for searching and categorizing tasks.
 *
 * @param {object} props.filters - Active filters config state
 * @param {Function} props.onChange - Trigger signaling active criteria shifts
 */
export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="flex-1 min-w-[180px] max-w-xs">
        <Input
          id="task-search"
          type="search"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          leftIcon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          }
        />
      </div>

      {/* Status filter — includes a virtual "Overdue" option */}
      <select
        value={filters.status}
        onChange={(e) => onChange('status', e.target.value)}
        className={`h-10 px-3 pr-8 rounded-lg bg-zinc-900 border text-sm outline-none transition-colors cursor-pointer
          ${filters.status === 'Overdue'
            ? 'border-rose-500/60 text-rose-400 focus:border-rose-500'
            : 'border-zinc-700/50 text-zinc-300 focus:border-indigo-500'}`}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {TASK_STATUS_LIST.map((s) => <option key={s}>{s}</option>)}
        {/* Virtual filter — not a real DB status; handled in parent via isOverdue() */}
        <option value="Overdue">⚠ Overdue</option>
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority}
        onChange={(e) => onChange('priority', e.target.value)}
        className="h-10 px-3 pr-8 rounded-lg bg-zinc-900 border border-zinc-700/50 text-sm text-zinc-300 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        {TASK_PRIORITY_LIST.map((p) => <option key={p}>{p}</option>)}
      </select>

      {/* Clear filters */}
      {(filters.search || filters.status || filters.priority) && (
        <button
          onClick={() => { onChange('search', ''); onChange('status', ''); onChange('priority', ''); }}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 h-10 rounded-lg hover:bg-zinc-800"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
