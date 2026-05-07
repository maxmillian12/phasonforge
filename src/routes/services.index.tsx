import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, HardHat, ClipboardCheck, Building2, Zap, FlaskConical, Package, Boxes, Truck, Workflow } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SERVICES } from "@/lib/content";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Phason Engineering Works" },
      { name: "description", content: "Civil, structural, electrical engineering and supply services delivered across Tanzania." },
      { property: "og:title", content: "Services — Phason Engineering" },
      { property: "og:description", content: "Engineering and supply solutions, end to end." },
    ],
  }),
  component: ServicesIndex,
});

const ICONS = { HardHat, ClipboardCheck, Building2, Zap, FlaskConical, Package, Boxes, Truck, Workflow } as const;

function ServicesIndex() {
  const eng = SERVICES.filter((s) => s.category === "Engineering");
  const sup = SERVICES.filter((s) => s.category === "Supply");

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={<>Engineering &amp; <span className="lime-underline text-[var(--primary)]">supply</span> solutions</>}
        subtitle="From road construction and electrical installations to industrial sulphur and equipment hire — a full-service partner you can rely on."
      />

      {(["Engineering", "Supply"] as const).map((cat) => {
        const items = cat === "Engineering" ? eng : sup;
        return (
          <section key={cat} className={cat === "Engineering" ? "py-24 bg-background" : "py-24 bg-secondary"}>
            <div className="container-x">
              <div className="mb-12">
                <div className="eyebrow mb-4">{cat === "Engineering" ? "Core Disciplines" : "Supply Division"}</div>
                <h2 className="section-title">{cat} <span className="lime-underline">services</span></h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((s) => {
                  const Icon = (ICONS as any)[s.icon] ?? HardHat;
                  return (
                    <Link
                      key={s.slug}
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="group bg-card border border-border p-7 card-hover"
                    >
                      <div className="h-14 w-14 mb-6 hex-clip bg-[var(--primary)] grid place-items-center text-[var(--ink)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display uppercase text-xl mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mb-5">{s.short}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest">
                        Learn more <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
