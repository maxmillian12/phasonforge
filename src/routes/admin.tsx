import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, FileText, Briefcase, Users, MessageSquare, Settings } from "lucide-react";
import { SERVICES, PROJECTS, POSTS } from "@/lib/content";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const u = sessionStorage.getItem("phason_admin");
    if (!u) {
      navigate({ to: "/admin/login" });
    } else {
      setUser(u);
    }
  }, [navigate]);

  if (!user) return null;

  const logout = () => {
    sessionStorage.removeItem("phason_admin");
    navigate({ to: "/admin/login" });
  };

  const stats = [
    { label: "Services", count: SERVICES.length, icon: Briefcase },
    { label: "Projects", count: PROJECTS.length, icon: FileText },
    { label: "Blog Posts", count: POSTS.length, icon: MessageSquare },
    { label: "Team Members", count: 58, icon: Users },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-muted/30">
      <div className="bg-[var(--ink)] text-white">
        <div className="container-x flex items-center justify-between py-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display uppercase text-3xl font-extrabold">
              Admin <span className="text-[var(--primary)]">Dashboard</span>
            </h1>
            <p className="text-sm font-mono text-white/60 mt-1">
              Welcome back, <span className="text-[var(--primary)]">{user}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-[var(--primary)] hover:text-[var(--primary)] font-display uppercase text-sm tracking-wider transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="container-x py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-6 border-l-4 border-[var(--primary)]">
              <s.icon className="h-6 w-6 text-[var(--ink)] mb-3" />
              <div className="font-display text-4xl font-extrabold text-[var(--ink)]">
                {s.count}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <ManageCard title="Services" desc="Edit service offerings & details" to="/services" />
          <ManageCard title="Projects" desc="Manage portfolio entries" to="/projects" />
          <ManageCard title="Blog" desc="Publish insights & articles" to="/blog" />
          <ManageCard title="Team" desc="Update personnel records" to="/about" />
          <ManageCard title="Inquiries" desc="View contact submissions" to="/contact" />
          <ManageCard title="Site Settings" desc="Company info & branding" to="/" icon={Settings} />
          <ManageCard title="System Status" desc="Verify forms, auth & storage" to="/admin/status" icon={Settings} />
          <ManageCard title="Deploy Verify" desc="SSR wiring & endpoint health checks" to="/admin/deploy-verify" icon={Settings} />
        </div>
      </div>
    </div>
  );
}

function ManageCard({
  title,
  desc,
  to,
  icon: Icon = Settings,
}: {
  title: string;
  desc: string;
  to: string;
  icon?: typeof Settings;
}) {
  return (
    <Link
      to={to}
      className="block bg-white p-6 border border-border hover:border-[var(--primary)] hover:shadow-lg transition-all group"
    >
      <Icon className="h-6 w-6 text-[var(--primary)] mb-3" />
      <h3 className="font-display uppercase text-lg font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </Link>
  );
}
