import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { PROJECTS } from "@/lib/content";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Phason Engineering Works" },
      { name: "description", content: "Selected civil, building and water projects delivered by Phason Engineering Works in Tanzania." },
      { property: "og:title", content: "Projects — Phason Engineering" },
      { property: "og:description", content: "Roads, buildings, water and civil works." },
    ],
  }),
  component: ProjectsPage,
});

const CATEGORIES = ["All", "Roads", "Buildings", "Water", "Civil"] as const;

function ProjectsPage() {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>("All");
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <>
      <PageHero
        eyebrow="Implemented Projects"
        title={<>Built. Delivered. <span className="lime-underline text-[var(--primary)]">Operational.</span></>}
        subtitle="A selection of civil, building and water projects across Tanzania — from district roads to apartment buildings and rural water schemes."
      />

      <section className="py-12 bg-background border-b border-border">
        <div className="container-x flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`font-display uppercase tracking-wider text-sm px-5 py-2.5 border-2 transition-colors ${
                filter === c
                  ? "bg-[var(--ink)] text-[var(--ink-foreground)] border-[var(--ink)]"
                  : "bg-transparent border-border hover:border-[var(--ink)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-x grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article key={p.slug} className="group bg-card border border-border overflow-hidden card-hover">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest bg-[var(--primary)] text-[var(--ink)] px-2 py-1">{p.category}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{p.location} · {p.year}</span>
                </div>
                <h3 className="font-display uppercase text-xl mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="container-x text-center py-16 text-muted-foreground">No projects in this category yet.</div>
        )}
      </section>
    </>
  );
}
