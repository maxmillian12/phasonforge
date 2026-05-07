import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { NAV, SITE } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 bg-[var(--ink)] text-[var(--ink-foreground)] border-b border-white/5">
      <div className="container-x flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoMark} alt="Phason Engineering" width={40} height={40} className="h-10 w-10" />
          <div className="leading-none">
            <div className="font-display font-extrabold text-base lg:text-lg uppercase tracking-wide">
              Phason <span className="text-[var(--primary)]">Engineering</span>
            </div>
            <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase mt-0.5">
              Works Limited
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 font-display uppercase text-sm tracking-wider transition-colors ${
                  active ? "text-[var(--primary)]" : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-2 text-sm font-mono text-white/70 hover:text-[var(--primary)]">
            <Phone className="h-4 w-4" /> {SITE.phone}
          </a>
          <Link to="/contact" className="btn-primary py-2 px-4 text-xs">Get a Quote</Link>
        </div>

        <button className="lg:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[var(--ink)]">
          <nav className="container-x py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`py-2.5 font-display uppercase tracking-wider ${
                  pathname === item.to ? "text-[var(--primary)]" : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-3 justify-center">
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
