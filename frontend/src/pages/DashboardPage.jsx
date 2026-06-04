/**
 * @file DashboardPage.jsx
 * @description Workspace dashboard screen displaying analytics, greetings, and recent tasks.
 */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES, TASK_STATUS, TASK_PRIORITY } from '../utils/constants';
import { getPriorityColor, getStatusColor, formatDate } from '../utils/helpers';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_STATS = {
  [ROLES.ADMIN]: [
    { label: 'Total Users',       value: 12,  icon: '👥', color: 'text-indigo-400' },
    { label: 'Active Users',      value: 10,  icon: '✓',  color: 'text-emerald-400' },
    { label: 'Inactive Users',    value: 2,   icon: '⏸',  color: 'text-zinc-400' },
    { label: 'Pending Resets',    value: 3,   icon: '🔐', color: 'text-amber-400' },
  ],
  [ROLES.PROJECT_MANAGER]: [
    { label: 'Total Tasks',       value: 24,  icon: '📋', color: 'text-indigo-400' },
    { label: 'In Progress',       value: 8,   icon: '⚡', color: 'text-amber-400' },
    { label: 'Completed',         value: 14,  icon: '✓',  color: 'text-emerald-400' },
    { label: 'Overdue',           value: 2,   icon: '⚠',  color: 'text-rose-400' },
  ],
  [ROLES.COLLABORATOR]: [
    { label: 'My Tasks',          value: 6,   icon: '📋', color: 'text-indigo-400' },
    { label: 'In Progress',       value: 2,   icon: '⚡', color: 'text-amber-400' },
    { label: 'Completed',         value: 3,   icon: '✓',  color: 'text-emerald-400' },
    { label: 'Due This Week',     value: 1,   icon: '📅', color: 'text-rose-400' },
  ],
};

const RECENT_TASKS = [
  { _id: 't1', title: 'Design API schema',          status: 'In Progress', priority: 'High',   dueDate: '2026-06-10' },
  { _id: 't2', title: 'Implement auth middleware',   status: 'To Do',      priority: 'High',   dueDate: '2026-06-07' },
  { _id: 't3', title: 'Deploy to Azure',             status: 'To Do',      priority: 'Medium', dueDate: '2026-06-15' },
  { _id: 't4', title: 'Setup Docker containers',     status: 'Completed',  priority: 'Low',    dueDate: '2026-06-03' },
  { _id: 't5', title: 'Write Swagger docs',          status: 'In Progress', priority: 'Medium', dueDate: '2026-06-12' },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className="card p-5 flex items-center gap-4 group hover:border-zinc-700 transition-all">
      <div className={`text-2xl w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-100 tabular-nums">{value}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Main landing screen containing role-based stat grids and summary metrics.
 */
export default function DashboardPage() {
  const { user, role } = useAuth();
  const stats = MOCK_STATS[role] ?? MOCK_STATS[ROLES.COLLABORATOR];

  return (
    <div className="space-y-8 animate-in">
      {/* Welcome banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <div className="text-[11px] text-zinc-600 hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent tasks table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold text-zinc-200">Recent Tasks</h3>
          <span className="text-[11px] text-zinc-500">Last 5 tasks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-light)' }}>
                {['Task', 'Status', 'Priority', 'Due Date'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[11px] font-medium text-zinc-500 tracking-wide uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_TASKS.map((t, i) => (
                <tr
                  key={t._id}
                  className="border-b last:border-0 hover:bg-zinc-800/30 transition-colors"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <td className="px-5 py-3.5 text-zinc-200 font-medium">{t.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400 text-xs">{formatDate(t.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
