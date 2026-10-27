import { AuthCta } from "@/components/auth-cta";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Hero>
        <h1 data-animate className="text-4xl font-semibold tracking-tight">
          Next Template
        </h1>
        <p data-animate className="text-muted-foreground">
          Next.js · Clerk · Supabase · shadcn/ui · GSAP
        </p>
        <div data-animate className="h-9">
          <AuthCta />
        </div>
      </Hero>
    </main>
  );
}
