/**
 * @file UserManagementPage.jsx
 * @description Admin control board managing users, roles, and profiles.
 */
import React, { useState } from 'react';
import UserTable, { UserFormModal } from '../components/users/UserTable';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

/**
 * Main administrative page that encapsulates searches, filters, and renders user grids.
 */
export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-5 animate-in">
      {/* Page actions */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            id="user-search"
            type="search"
            placeholder="Search by name, email, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            }
          />
        </div>

        <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
          + Add User
        </Button>
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        <UserTable search={search} />
      </div>

      {/* Standalone create modal (when called from header button) */}
      <UserFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        user={null}
        onSaved={() => {}}
      />
    </div>
  );
}
