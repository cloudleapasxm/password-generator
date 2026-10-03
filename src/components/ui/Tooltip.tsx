import type { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  children: ReactNode;
}

/**
 * Minimal CSS-only tooltip for desktop hover. The wrapped control keeps its
 * own accessible name; the tooltip is decorative (`aria-hidden`).
 */
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-zinc-100 opacity-0 shadow-sm transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 dark:bg-zinc-100 dark:text-zinc-900 motion-reduce:transition-none"
      >
        {label}
      </span>
    </span>
  );
}
