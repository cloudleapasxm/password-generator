import type { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  children: ReactNode;
}

/**
 * Minimal CSS-only tooltip for hover-capable devices and keyboard focus.
 * The wrapped control keeps its own accessible name; the tooltip is
 * decorative (`aria-hidden`) and hidden entirely on touch devices.
 */
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span aria-hidden="true" className="sp-tooltip">
        {label}
      </span>
    </span>
  );
}
