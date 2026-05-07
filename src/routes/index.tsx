import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, CheckCircle2, HardHat, ClipboardCheck, Building2, Zap, ShieldCheck, Lightbulb, Award, Users, Quote } from "lucide-react";
import heroImg from "@/assets/hero-construction.jpg";
import { Counter } from "@/components/site/Counter";
import { SERVICES, PROJECTS, STATS, TESTIMONIALS, POSTS } from "@/lib/content";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Phason Engineering Works Limited — Civil, Electrical & Building Contractors in Tanzania" },
      { name: "description", content: "Leading civil, structural and electrical engineering firm in Dar es Salaam delivering roads, buildings, water and supply solutions across Tanzania." },
      { property: "og:title", content: "Phason Engineering Works Limited" },
      { property: "og:description", content: "Structures That Stand The Test Of Time." },
    ],
  }),
  component: Home,
});

const ICONS: Record<string, typeof HardHat> = {
  HardHat, ClipboardCheck, Building2, Zap,
};

function Home() {
  const engineering = SERVICES.filter((s) => s.category === "Engineering");
  const supplies = SERVICES.filter((s) => s.category === "Supply");

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center bg-[var(--ink)] text-[var(--ink-foreground)] overflow-hidden">
        <img
          src={heroImg}
          alt="Construction site at golden hour"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/80 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="container-x relative py-24">
          <div className="max-w-3xl">
            <div className="eyebrow text-white/70 mb-6 animate-fade-up">Phason Engineering Works Ltd</div>
            <h1 className="font-display font-extrabold uppercase text-5xl md:text-7xl lg:text-8xl leading-[0.9] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Structures<br />
              That Stand <br />
              <span className="lime-underline text-[var(--primary)]">The Test Of Time</span>
            </h1>
            <p className="mt-8 text-white/80 max-w-xl text-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Civil, electrical and building contracting plus diversified supply solutions —
              engineered for Tanzania, built to last generations.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/services" className="btn-primary">Our Services <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/contact" className="btn-ghost-light">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[var(--ink)]/70 backdrop-blur-sm">
          <div className="container-x grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="py-6 px-4 text-center">
                <div className="font-display text-3xl md:text-4xl text-[var(--primary)] font-extrabold">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/60 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SNAPSHOT */}
      <section className="py-24 bg-background">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow mb-5">About Phason</div>
            <h2 className="section-title mb-6">
              A leading <span className="lime-underline">engineering &amp; supply</span> partner in Tanzania
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Phason Engineering Works Limited specialises in civil, electrical and
              building contracting alongside diversified supply solutions. Established
              with a mission to deliver superior-quality construction, we have built a solid
              reputation for excellence, innovation and customer satisfaction.
            </p>
            <ul className="space-y-3 mb-8">
              {["Government and private sector experience", "Owned heavy equipment fleet", "Skilled in-house engineering team"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[var(--primary)] mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-ghost-dark">Learn More <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-[var(--ink)] relative overflow-hidden">
              <img src={heroImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[var(--primary)] text-[var(--primary-foreground)] p-6 max-w-[260px] hidden md:block">
              <div className="font-display text-5xl font-extrabold leading-none"><Counter value={10} suffix="+" /></div>
              <div className="mt-2 font-mono text-xs uppercase tracking-widest">Years engineering Tanzania's infrastructure</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-secondary">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="eyebrow mb-4">What We Do</div>
              <h2 className="section-title max-w-2xl">Engineering services <span className="lime-underline">built for scale</span></h2>
            </div>
            <Link to="/services" className="btn-ghost-dark self-start">All Services <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {engineering.map((s) => {
              const Icon = ICONS[s.icon] ?? HardHat;
              return (
                <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }}
                  className="group bg-card border border-border p-7 card-hover">
                  <div className="h-14 w-14 mb-6 hex-clip bg-[var(--primary)] grid place-items-center text-[var(--ink)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display uppercase text-xl mb-2 group-hover:text-[var(--ink)]">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{s.short}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-[var(--ink)]">
                    Explore <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-[var(--ink)] text-[var(--ink-foreground)] relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container-x relative">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow text-white/60 mb-4">Why Choose Us</div>
            <h2 className="section-title">Engineered for <span className="lime-underline">trust</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: ShieldCheck, title: "Quality & Safety", desc: "Strict QA, HSE protocols and a culture of zero compromise." },
              { Icon: Lightbulb, title: "Innovation", desc: "Modern construction methods adapted to Tanzanian conditions." },
              { Icon: Award, title: "Proven Delivery", desc: "Government and private sector projects delivered on time." },
              { Icon: Users, title: "Skilled Team", desc: "80+ engineers, surveyors, foremen and operators in-house." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="border border-white/10 p-7 hover:border-[var(--primary)] transition-colors">
                <Icon className="h-8 w-8 text-[var(--primary)] mb-5" />
                <h3 className="font-display uppercase text-lg mb-2">{title}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24 bg-background">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="eyebrow mb-4">Implemented Projects</div>
              <h2 className="section-title max-w-2xl">Selected <span className="lime-underline">recent work</span></h2>
            </div>
            <Link to="/projects" className="btn-ghost-dark self-start">All Projects <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS.slice(0, 6).map((p) => (
              <Link key={p.slug} to="/projects" className="group block relative aspect-[4/5] overflow-hidden bg-[var(--ink)]">
                <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest bg-[var(--primary)] text-[var(--ink)] px-2 py-1">{p.category}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1">{p.location} · {p.year}</div>
                  <h3 className="font-display uppercase text-xl">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPLY MARQUEE */}
      <section className="py-12 bg-[var(--primary)] text-[var(--ink)] overflow-hidden border-y-4 border-[var(--ink)]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...supplies, ...supplies].map((s, i) => (
            <div key={i} className="mx-12 flex items-center gap-4 font-display uppercase text-2xl md:text-3xl font-extrabold">
              <span className="h-2 w-2 bg-[var(--ink)] rotate-45" />
              {s.title}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-secondary">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow mb-4 justify-center" style={{ display: "inline-flex" }}>Client Trust</div>
            <h2 className="section-title">What our <span className="lime-underline">clients say</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card border border-border p-8 relative">
                <Quote className="h-8 w-8 text-[var(--primary)] mb-4" />
                <p className="text-foreground/80 leading-relaxed mb-6">"{t.message}"</p>
                <div className="border-t border-border pt-4">
                  <div className="font-display uppercase font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-24 bg-background">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="eyebrow mb-4">Insights</div>
              <h2 className="section-title">Latest from <span className="lime-underline">the field</span></h2>
            </div>
            <Link to="/blog" className="btn-ghost-dark self-start">All Articles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {POSTS.map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                <div className="aspect-[16/10] overflow-hidden bg-secondary mb-5">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <h3 className="font-display uppercase text-xl group-hover:text-[var(--ink)] mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--ink)] text-[var(--ink-foreground)] relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[var(--primary)]/10" />
        <div className="container-x relative py-20 lg:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow text-white/60 mb-4">Let's Build</div>
            <h2 className="section-title">Ready to build? <br /><span className="lime-underline text-[var(--primary)]">Let's talk.</span></h2>
          </div>
          <div className="md:text-right">
            <p className="text-white/70 mb-6 md:max-w-md md:ml-auto">
              Tell us about your project — roads, buildings, water systems, electrical or supply.
              We'll get back to you within one business day.
            </p>
            <div className="flex flex-wrap md:justify-end gap-4">
              <Link to="/contact" className="btn-primary">Start a Project <ArrowRight className="h-4 w-4" /></Link>
              <a href={`tel:${SITE.phoneRaw}`} className="btn-ghost-light">Call {SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
