import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

/** Neutral content section: hairline border, flat surface, compact heading. */
export function SectionCard({ title, description, children, className = '', labelledBy }: SectionCardProps) {
  const titleId = labelledBy ?? `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <section
      aria-labelledby={titleId}
      className={`rounded-xl border border-line bg-raised p-5 transition-colors duration-200 motion-reduce:transition-none sm:p-6 ${className}`}
    >
      <h2 id={titleId} className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
        {title}
      </h2>
      {description ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
