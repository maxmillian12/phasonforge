import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Package, Sprout, FlaskConical } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SERVICES } from "@/lib/content";

export const Route = createFileRoute("/agricultural-supplies")({
  head: () => ({
    meta: [
      { title: "Agricultural & Industrial Supplies — Phason Engineering" },
      { name: "description", content: "Reliable supply of sulphur, fertilisers, packaging and industrial materials across Tanzania." },
      { property: "og:title", content: "Agricultural & Industrial Supplies" },
      { property: "og:description", content: "Quality supplies for agriculture and industry." },
    ],
  }),
  component: SuppliesPage,
});

const PRODUCTS = [
  { Icon: Sprout, title: "Urea Nitrogen 46-0-0", tag: "N · Leaf & Growth", desc: "High-grade nitrogen fertiliser for vigorous vegetative growth." },
  { Icon: Leaf, title: "NPK 19-19-19", tag: "P₂O₅ · Root & Flower", desc: "Balanced nutrient blend ideal for flowering and fruiting crops." },
  { Icon: Sprout, title: "DAP 18-46-0", tag: "K₂O · Fruit & Yield", desc: "Phosphorus-rich starter fertiliser supporting strong root systems." },
  { Icon: FlaskConical, title: "Industrial & Agricultural Sulphur", tag: "Bulk Supply", desc: "Granular and powdered sulphur in customised order sizes." },
  { Icon: Package, title: "Duty Bags & Packaging", tag: "Wholesale", desc: "Heavy-duty sacks and customised packaging for agri & industry." },
  { Icon: Package, title: "Pesticides & Inputs", tag: "Sourcing", desc: "Sourcing of approved pesticides, fungicides and farm inputs." },
];

function SuppliesPage() {
  const supplyServices = SERVICES.filter((s) => s.category === "Supply");

  return (
    <>
      <PageHero
        eyebrow="Agricultural & Industrial Supplies"
        title={<>Reliable supply, <span className="lime-underline text-[var(--primary)]">delivered.</span></>}
        subtitle="A trusted supplier of high-quality agricultural inputs and industrial materials — supporting farmers, exporters and businesses with efficient, cost-effective solutions."
      />

      <section className="py-24 bg-background">
        <div className="container-x">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow mb-4">Featured Products</div>
            <h2 className="section-title">Essential nutrients <span className="lime-underline">powering</span> our food</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map(({ Icon, title, tag, desc }) => (
              <div key={title} className="bg-card border border-border p-7 card-hover">
                <div className="h-14 w-14 mb-5 hex-clip bg-[var(--primary)] grid place-items-center text-[var(--ink)]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{tag}</div>
                <h3 className="font-display uppercase text-xl mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="container-x">
          <div className="mb-12">
            <div className="eyebrow mb-4">All Supply Services</div>
            <h2 className="section-title">More than <span className="lime-underline">products</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {supplyServices.map((s) => (
              <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }}
                className="bg-card border border-border p-6 card-hover">
                <h3 className="font-display uppercase text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--primary)] text-[var(--primary-foreground)] py-16">
        <div className="container-x flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display uppercase text-3xl md:text-4xl font-extrabold">Need a custom quote?</h3>
            <p className="mt-2 max-w-xl">Tell us your volumes, delivery point and timeline — we'll come back fast.</p>
          </div>
          <Link to="/contact" className="btn-ghost-dark">Request a Quote <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
