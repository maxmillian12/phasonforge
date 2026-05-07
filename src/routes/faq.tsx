import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FAQS } from "@/lib/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Phason Engineering Works" },
      { name: "description", content: "Frequently asked questions about Phason Engineering Works' services, supply and operations." },
      { property: "og:title", content: "Frequently Asked Questions" },
      { property: "og:description", content: "Answers to common questions about our services." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={<>Questions, <span className="lime-underline text-[var(--primary)]">answered</span></>}
        subtitle="Quick answers about our services, equipment, supplies and how we work."
      />
      <section className="py-20 bg-background">
        <div className="container-x max-w-3xl">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-display uppercase text-lg md:text-xl">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[var(--primary)]" : ""}`} />
                </button>
                {isOpen && <div className="pb-6 text-muted-foreground leading-relaxed">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
