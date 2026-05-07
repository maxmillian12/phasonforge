import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Phason Engineering Works" },
      { name: "description", content: "Get in touch with Phason Engineering Works in Dar es Salaam, Tanzania. Phone, email and contact form." },
      { property: "og:title", content: "Contact Phason Engineering" },
      { property: "og:description", content: "Reach our team in Dar es Salaam, Tanzania." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const errs: Record<string, string> = {};
    if (!name || name.length > 100) errs.name = "Please enter your name (max 100).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email.";
    if (!message || message.length > 1500) errs.message = "Message required (max 1500).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let's <span className="lime-underline text-[var(--primary)]">build</span> together</>}
        subtitle="Tell us about your project. Our team responds to every enquiry within one business day."
      />

      <section className="py-20 bg-background">
        <div className="container-x grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-card border border-border p-8 md:p-10">
            <h2 className="section-title text-3xl mb-2">Send us a message</h2>
            <p className="text-muted-foreground mb-8">All fields marked with an asterisk are required.</p>

            {sent ? (
              <div className="flex items-center gap-3 p-6 bg-[var(--primary)]/15 border border-[var(--primary)]">
                <CheckCircle2 className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-display uppercase font-bold">Message sent</div>
                  <p className="text-sm text-muted-foreground">Thank you — we'll be in touch shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Full name *" name="name" error={errors.name} />
                  <Field label="Email *" name="email" type="email" error={errors.email} />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Phone" name="phone" type="tel" />
                  <Field label="Subject" name="subject" />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest mb-2">Message *</label>
                  <textarea name="message" rows={6} maxLength={1500}
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-[var(--primary)]" />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-primary">
                  Send Message <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <InfoCard Icon={MapPin} title="Head Office">
              {SITE.addressLines.map((l) => <div key={l}>{l}</div>)}
            </InfoCard>
            <InfoCard Icon={Phone} title="Phone">
              <a href={`tel:${SITE.phoneRaw}`} className="hover:text-[var(--ink)]">{SITE.phone}</a>
            </InfoCard>
            <InfoCard Icon={Mail} title="Email">
              <a href={`mailto:${SITE.email}`} className="hover:text-[var(--ink)] break-all">{SITE.email}</a>
            </InfoCard>
          </aside>
        </div>
      </section>

      <section className="bg-secondary">
        <iframe
          title="Office location"
          src="https://www.google.com/maps?q=Alfa+Plaza+Ada+Estate+Dar+es+Salaam&output=embed"
          width="100%"
          height="420"
          loading="lazy"
          className="block grayscale contrast-110"
        />
      </section>
    </>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="block font-mono text-xs uppercase tracking-widest mb-2">{label}</label>
      <input
        name={name}
        type={type}
        maxLength={255}
        className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
      />
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

function InfoCard({ Icon, title, children }: { Icon: typeof Mail; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--ink)] text-[var(--ink-foreground)] p-7">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 hex-clip bg-[var(--primary)] grid place-items-center text-[var(--ink)] shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="font-display uppercase text-sm tracking-widest text-[var(--primary)] mb-2">{title}</div>
          <div className="text-white/80 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
