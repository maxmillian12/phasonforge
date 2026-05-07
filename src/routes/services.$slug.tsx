import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SERVICES } from "@/lib/content";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const s = SERVICES.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: `${s?.title ?? "Service"} — Phason Engineering` },
        { name: "description", content: s?.short ?? "" },
        { property: "og:title", content: s?.title ?? "Service" },
        { property: "og:description", content: s?.short ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="section-title mb-4">Service not found</h1>
      <Link to="/services" className="btn-ghost-dark">Back to services</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-x py-32 text-center">
      <h1 className="section-title mb-4">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const related = SERVICES.filter((s) => s.category === service.category && s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={service.category + " Service"}
        title={<><span className="lime-underline text-[var(--primary)]">{service.title}</span></>}
        subtitle={service.short}
      />

      <section className="py-20 bg-background">
        <div className="container-x grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="section-title text-3xl mb-6">What we deliver</h2>
            <ul className="space-y-4">
              {service.features.map((f: string) => (
                <li key={f} className="flex gap-3 items-start border-b border-border pb-4">
                  <CheckCircle2 className="h-5 w-5 text-[var(--primary)] mt-1 shrink-0" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 bg-secondary p-8 border-l-4 border-[var(--primary)]">
              <h3 className="font-display uppercase text-xl mb-3">Engineered for Tanzania</h3>
              <p className="text-muted-foreground">
                Every {service.title.toLowerCase()} engagement starts with site conditions, regulatory requirements
                and your operational goals — and ends with a result that performs in real-world East African conditions.
              </p>
            </div>
          </div>

          <aside>
            <div className="bg-[var(--ink)] text-[var(--ink-foreground)] p-8 sticky top-24">
              <div className="eyebrow text-white/60 mb-4">Get Started</div>
              <h3 className="font-display uppercase text-2xl mb-4">Discuss your project</h3>
              <p className="text-white/70 text-sm mb-6">
                Tell us your scope and timeline. We'll respond within one business day.
              </p>
              <Link to="/contact" className="btn-primary w-full justify-center">Request a Quote <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 bg-secondary">
          <div className="container-x">
            <h2 className="section-title mb-10">Related <span className="lime-underline">services</span></h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.slug} to="/services/$slug" params={{ slug: r.slug }}
                  className="bg-card border border-border p-6 card-hover">
                  <h3 className="font-display uppercase text-lg mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.short}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
