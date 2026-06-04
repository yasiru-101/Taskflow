/**
 * @file ForbiddenPage.jsx
 * @description Access Denied (HTTP 403) page.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

/**
 * Renders an Access Denied error screen when users attempt to load route components 
 * restricted by system RBAC rules.
 */
export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center space-y-4 animate-in">
        <div className="text-6xl">🚫</div>
        <h1 className="text-2xl font-bold text-zinc-100">Access Denied</h1>
        <p className="text-sm text-zinc-500 max-w-sm">
          You don't have permission to view this page. Contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm">Go to Dashboard</Button>
          </Link>
        </div>
        <p className="text-xs text-zinc-700">HTTP 403 — Forbidden</p>
      </div>
    </div>
  );
}
