/**
 * @file Modal.jsx
 * @description Accessible popover dialogue overlay with backdrop lock, focus-trap, and Escape dismiss.
 */
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

/**
 * Accessible Modal with focus trap, Escape key close, and backdrop click close.
 *
 * @param {boolean}  open
 * @param {Function} onClose
 * @param {string}   title
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {ReactNode} footer - override default footer
 */
/**
 * Overlay container dialog component. Handles document body scrolling lockouts, Focus trapping, and accessibility tags.
 *
 * @param {boolean} props.open - State flag to display modal
 * @param {Function} props.onClose - Callback triggered to close dialog
 * @param {string} props.title - Dialogue top header title
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Width restriction mapping
 * @param {React.ReactNode} props.children - Main dialogue body contents
 * @param {React.ReactNode} props.footer - Override element for action buttons
 */
export default function Modal({ open, onClose, title, size = 'md', children, footer }) {
  const overlayRef = useRef(null);
  const dialogRef  = useRef(null);

  // ── Escape key ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // ── Focus trap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  // ── Lock body scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`w-full ${sizeMap[size]} scale-in card flex flex-col max-h-[90vh] outline-none`}
        style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/70">
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded-md hover:bg-zinc-700/50 focus-ring"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">{children}</div>

        {/* Footer */}
        {footer !== undefined ? (
          footer && <div className="px-5 py-4 border-t border-zinc-800/70">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
