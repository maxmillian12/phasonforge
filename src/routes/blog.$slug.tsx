import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { POSTS } from "@/lib/content";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const p = POSTS.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: `${p?.title ?? "Article"} — Phason Engineering` },
        { name: "description", content: p?.excerpt ?? "" },
        { property: "og:title", content: p?.title ?? "Article" },
        { property: "og:description", content: p?.excerpt ?? "" },
        ...(p?.image ? [{ property: "og:image", content: p.image as unknown as string }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="section-title mb-4">Article not found</h1>
      <Link to="/blog" className="btn-ghost-dark">Back to insights</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-x py-32 text-center">
      <h1 className="section-title mb-4">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <article className="bg-background">
      <div className="aspect-[21/9] overflow-hidden bg-[var(--ink)]">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover opacity-80" />
      </div>
      <div className="container-x max-w-3xl py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground mb-8 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to insights
        </Link>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </div>
        <h1 className="font-display uppercase text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{post.title}</h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
        <div className="prose prose-lg max-w-none text-foreground leading-relaxed">
          {post.body.split("\n").map((para, i) => <p key={i} className="mb-4">{para}</p>)}
        </div>
      </div>
    </article>
  );
}
