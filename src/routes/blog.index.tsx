import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { POSTS } from "@/lib/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Insights — Phason Engineering Works" },
      { name: "description", content: "Articles and insights on engineering, construction and supply across Tanzania." },
      { property: "og:title", content: "Insights — Phason Engineering" },
      { property: "og:description", content: "Field insights from East Africa's engineering frontline." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={<>Field notes &amp; <span className="lime-underline text-[var(--primary)]">technical</span> writing</>}
        subtitle="Articles on engineering, construction methods and supply across East Africa."
      />
      <section className="py-20 bg-background">
        <div className="container-x grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-secondary mb-5">
                <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <h3 className="font-display uppercase text-2xl mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
