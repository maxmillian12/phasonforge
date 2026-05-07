import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: ReactNode; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative bg-[var(--ink)] text-[var(--ink-foreground)] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-20 -right-20 h-80 w-80 bg-[var(--primary)]/10 blur-3xl rounded-full" />
      <div className="container-x relative py-20 lg:py-28">
        {eyebrow && <div className="eyebrow mb-5 text-white/60">{eyebrow}</div>}
        <h1 className="font-display font-extrabold uppercase text-4xl md:text-6xl lg:text-7xl leading-[0.95]">
          {title}
        </h1>
        {subtitle && <p className="mt-6 text-white/70 max-w-2xl text-lg">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
