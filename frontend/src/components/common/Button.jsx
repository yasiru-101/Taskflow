/**
 * @file Button.jsx
 * @description Modular button component supporting variants, loading state indicators, and sizes.
 */
import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Base Button component.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading - shows a spinner and disables interaction
 * @param {boolean} iconOnly - removes horizontal padding for icon-only buttons
 */
/**
 * Button wrapper component providing standard interactive controls, loading states, and custom variants.
 *
 * @param {React.ReactNode} props.children - Label or content inside button
 * @param {'primary'|'secondary'|'ghost'|'danger'} props.variant - Visual variant style
 * @param {'sm'|'md'|'lg'} props.size - Size variant mapping height and padding
 * @param {boolean} props.loading - Shows loading spinner and disables action
 * @param {boolean} props.iconOnly - Adjusts padding for purely icon buttons
 * @param {string} props.className - Overriding classnames
 * @param {boolean} props.disabled - Toggles user interaction
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  iconOnly = false,
  className,
  disabled,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus-ring select-none disabled:opacity-40 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 shadow-sm',
    secondary:
      'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700',
    ghost:
      'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 active:bg-zinc-700',
    danger:
      'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/20',
  };

  const sizes = {
    sm: cn('text-xs h-7',  iconOnly ? 'w-7'  : 'px-3'),
    md: cn('text-sm h-9',  iconOnly ? 'w-9'  : 'px-4'),
    lg: cn('text-sm h-11', iconOnly ? 'w-11' : 'px-5'),
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size={size === 'lg' ? 16 : 14} />
          {!iconOnly && <span>Loading…</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
