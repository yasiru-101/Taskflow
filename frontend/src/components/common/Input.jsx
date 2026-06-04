/**
 * @file Input.jsx
 * @description Customized text input and textarea component with validation warnings.
 */
import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

/**
 * Controlled Input / Textarea with floating label and error state.
 *
 * @param {'text'|'email'|'password'|'date'|'search'|'textarea'} type
 * @param {string}  label
 * @param {string}  error      - Error message to show below input
 * @param {string}  hint       - Helper text below input
 * @param {ReactNode} leftIcon - Rendered inside the left inset
 * @param {ReactNode} rightIcon- Rendered inside the right inset
 */
/**
 * Custom text inputs or textareas featuring inline warning banners, hints, and icon placements.
 *
 * @param {string} props.label - Floating title header for input
 * @param {string} props.error - Optional validation error string
 * @param {string} props.hint - Small info label text below the field
 * @param {string} props.type - Element type (text, email, password, textarea, etc.)
 * @param {React.ReactNode} props.leftIcon - Inline decorative left icon
 * @param {React.ReactNode} props.rightIcon - Inline decorative right icon
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    type = 'text',
    leftIcon,
    rightIcon,
    className,
    id,
    rows = 3,
    ...rest
  },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;
  const isTextarea = type === 'textarea';

  const baseInput = cn(
    'w-full bg-zinc-900 border text-sm text-zinc-100 rounded-lg outline-none transition-colors focus-ring placeholder:text-zinc-600',
    error
      ? 'border-rose-500/60 focus:border-rose-500'
      : 'border-zinc-700/50 focus:border-indigo-500',
    leftIcon  ? 'pl-10' : 'pl-3.5',
    rightIcon ? 'pr-10' : 'pr-3.5',
    isTextarea ? 'py-2.5 resize-none' : 'h-10',
    className
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-zinc-400 tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {leftIcon}
          </span>
        )}

        {isTextarea ? (
          <textarea id={inputId} ref={ref} rows={rows} className={baseInput} {...rest} />
        ) : (
          <input id={inputId} type={type} ref={ref} className={baseInput} {...rest} />
        )}

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-zinc-600">{hint}</p>
      )}
    </div>
  );
});

export default Input;
