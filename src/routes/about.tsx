import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Target, Heart, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Counter } from "@/components/site/Counter";
import { STATS, VALUES, EQUIPMENT, PERSONNEL } from "@/lib/content";
import equipImg from "@/assets/equipment.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Phason Engineering Works Limited" },
      { name: "description", content: "Our story, vision, mission and values. Meet the team and equipment behind Phason Engineering Works Limited in Tanzania." },
      { property: "og:title", content: "About Phason Engineering Works" },
      { property: "og:description", content: "Engineering Tanzania's infrastructure with integrity, innovation and excellence." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={<>Engineering <span className="lime-underline text-[var(--primary)]">Tanzania's</span> infrastructure</>}
        subtitle="A leading civil, electrical and building contracting company specialising in superior-quality construction and diversified supply solutions."
      />

      <section className="py-24 bg-background">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow mb-5">Our Story</div>
            <h2 className="section-title mb-6">Built on <span className="lime-underline">excellence</span></h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Phason Engineering Works Limited is a Tanzanian-registered company specialising in
                civil, electrical and building contracting services alongside diversified supply solutions.
              </p>
              <p>
                Established with the mission to deliver superior-quality construction solutions, we have
                built a solid reputation for excellence, innovation and customer satisfaction. With a
                strong foundation in industry expertise and an unwavering commitment to quality, the
                company has successfully executed numerous projects across diverse sectors.
              </p>
              <p>
                From government infrastructure to private-sector buildings, water systems and renewable
                energy installations, we bring the same disciplined approach to every site.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-secondary">
            <img src={equipImg} alt="Heavy equipment on site" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* VVV */}
      <section className="py-24 bg-secondary">
        <div className="container-x grid md:grid-cols-3 gap-6">
          {[
            { Icon: Eye, title: "Our Vision", body: "To be a leading construction and engineering firm recognised for innovative solutions, exceptional quality and commitment to sustainability." },
            { Icon: Target, title: "Our Mission", body: "To deliver outstanding civil, electrical and building contracting services that exceed client expectations, foster long-term relationships and contribute to the growth of our communities." },
            { Icon: Heart, title: "Our Values", body: "Integrity & Honesty · Innovation · Quality & Excellence · Professionalism." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="bg-card border border-border p-8 card-hover">
              <div className="h-14 w-14 hex-clip bg-[var(--primary)] grid place-items-center mb-6">
                <Icon className="h-6 w-6 text-[var(--ink)]" />
              </div>
              <h3 className="font-display uppercase text-2xl mb-3">{title}</h3>
              <p className="text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES STRIP */}
      <section className="py-24 bg-background">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow mb-4" style={{ display: "inline-flex" }}>What Drives Us</div>
            <h2 className="section-title">Our core <span className="lime-underline">values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <div key={v.title} className="border-l-2 border-[var(--primary)] pl-6 py-2">
                <div className="font-mono text-xs text-[var(--primary)] mb-2">0{i + 1}</div>
                <h3 className="font-display uppercase text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-[var(--ink)] text-[var(--ink-foreground)]">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-display text-5xl md:text-6xl font-extrabold text-[var(--primary)]">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-white/60 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPMENT + PERSONNEL */}
      <section className="py-24 bg-background">
        <div className="container-x grid lg:grid-cols-2 gap-12">
          <div>
            <div className="eyebrow mb-4">Personnel</div>
            <h3 className="section-title mb-8">Our <span className="lime-underline">team</span></h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {PERSONNEL.map(([name, n]) => (
                <li key={name} className="flex justify-between border-b border-border py-2">
                  <span className="text-sm">{name}</span>
                  <span className="font-mono text-sm text-[var(--ink)] font-bold">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-4">Equipment</div>
            <h3 className="section-title mb-8">Owned <span className="lime-underline">fleet</span></h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {EQUIPMENT.map(([name, n]) => (
                <li key={name} className="flex justify-between border-b border-border py-2">
                  <span className="text-sm">{name}</span>
                  <span className="font-mono text-sm text-[var(--ink)] font-bold">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[var(--primary)] text-[var(--primary-foreground)] py-16">
        <div className="container-x flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="font-display uppercase text-3xl md:text-4xl font-extrabold">Want to work with us?</h3>
          <Link to="/contact" className="btn-ghost-dark">Get in Touch <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
