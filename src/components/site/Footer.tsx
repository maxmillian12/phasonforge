import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--ink-foreground)]">
      <div className="container-x py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2 max-w-md">
          <div className="flex items-center gap-3 mb-5">
            <img src={logoMark} alt="" width={48} height={48} className="h-12 w-12" />
            <div>
              <div className="font-display font-extrabold text-lg uppercase">
                Phason <span className="text-[var(--primary)]">Engineering</span>
              </div>
              <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                Works Limited
              </div>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            {SITE.tagline}. Civil, structural and electrical engineering, plus diversified
            supply solutions across Tanzania.
          </p>
          <div className="flex gap-2">
            {[
              { Icon: Facebook, href: SITE.social.facebook },
              { Icon: Instagram, href: SITE.social.instagram },
              { Icon: Linkedin, href: SITE.social.linkedin },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} className="h-10 w-10 grid place-items-center border border-white/15 hover:bg-[var(--primary)] hover:text-[var(--ink)] hover:border-[var(--primary)] transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display uppercase text-sm tracking-widest text-[var(--primary)] mb-4">Navigate</h4>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-white/70 hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase text-sm tracking-widest text-[var(--primary)] mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[var(--primary)]" />
              <span>{SITE.addressLines.join(", ")}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-[var(--primary)]" />
              <a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-[var(--primary)]" />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/40 font-mono uppercase tracking-widest">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Structures That Stand The Test Of Time</span>
        </div>
      </div>
    </footer>
  );
}
