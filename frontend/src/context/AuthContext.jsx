/**
 * @file AuthContext.jsx
 * @description Context provider managing authentication states, tokens, and role variables.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

// ─── Demo / Mock Credentials ──────────────────────────────────────────────────
// These allow full UI testing before the backend is ready.
// Remove MOCK_USERS entirely once the real API is live.
const MOCK_USERS = {
  'admin@taskflow.dev': {
    _id: 'mock-admin-001',
    name: 'James O\'Brien',
    email: 'admin@taskflow.dev',
    role: 'Admin',
    mustResetPassword: false,
    isActive: true,
  },
  'pm@taskflow.dev': {
    _id: 'mock-pm-001',
    name: 'Priya Patel',
    email: 'pm@taskflow.dev',
    role: 'Project Manager',
    mustResetPassword: false,
    isActive: true,
  },
  'collab@taskflow.dev': {
    _id: 'mock-collab-001',
    name: 'Sarah Johnson',
    email: 'collab@taskflow.dev',
    role: 'Collaborator',
    mustResetPassword: false,
    isActive: true,
  },
  // First-login demo — triggers mandatory password reset flow
  'new@taskflow.dev': {
    _id: 'mock-new-001',
    name: 'Liam Torres',
    email: 'new@taskflow.dev',
    role: 'Collaborator',
    mustResetPassword: true,
    isActive: true,
  },
};

const MOCK_PASSWORDS = {
  'admin@taskflow.dev':  'Admin@1234',
  'pm@taskflow.dev':     'Manager@1234',
  'collab@taskflow.dev': 'Collab@1234',
  'new@taskflow.dev':    'Temp@1234',
};

const SESSION_KEY = 'tf_demo_user';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
/**
 * Top-level context provider that wraps the app and handles login requests, token refreshes, 
 * session cache management, and mock accounts.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On mount: restore session (real API first, then demo session) ───────────
  useEffect(() => {
    authService
      .me()
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        // Fall back to persisted demo session
        try {
          const stored = sessionStorage.getItem(SESSION_KEY);
          if (stored) setUser(JSON.parse(stored));
        } catch {}
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Token expiry → force logout ─────────────────────────────────────────────
  useEffect(() => {
    const handle = () => {
      setUser(null);
      sessionStorage.removeItem(SESSION_KEY);
    };
    window.addEventListener('auth:expired', handle);
    return () => window.removeEventListener('auth:expired', handle);
  }, []);

  // ── Login: tries real API, falls back to mock credentials ──────────────────
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authService.login(email, password);
      setUser(data.user);
      return data.user;
    } catch (apiErr) {
      // ── Mock login fallback ──────────────────────────────────────────────
      const mockUser = MOCK_USERS[email.toLowerCase()];
      const mockPass = MOCK_PASSWORDS[email.toLowerCase()];

      if (mockUser && mockPass === password) {
        setUser(mockUser);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));
        return mockUser;
      }

      // Neither real nor mock — re-throw so LoginPage shows the error
      throw apiErr;
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      // Keep demo session in sync
      if (sessionStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    mustResetPassword: user?.mustResetPassword ?? false,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
