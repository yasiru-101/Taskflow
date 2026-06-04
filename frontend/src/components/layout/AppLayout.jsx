/**
 * @file AppLayout.jsx
 * @description Structure template displaying the sidebar and top navigation bars.
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { cn } from '../../utils/helpers';

/**
 * Core template component that sets up layout width sizing constraints, sidebar state configurations,
 * and sets up the router workspace grid.
 */
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sideW = collapsed ? 60 : 240;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Main area offset by sidebar width */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sideW }}
      >
        <TopBar />

        <main className="flex-1 p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
