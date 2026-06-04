/**
 * @file NotFoundPage.jsx
 * @description Resource Not Found (HTTP 404) fallback screen.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center space-y-4 animate-in">
        <div className="text-6xl">🌌</div>
        <h1 className="text-2xl font-bold text-zinc-100">Page Not Found</h1>
        <p className="text-sm text-zinc-500 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm">Go to Dashboard</Button>
          </Link>
        </div>
        <p className="text-xs text-zinc-700">HTTP 404 — Not Found</p>
      </div>
    </div>
  );
}
