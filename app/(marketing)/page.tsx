import { AuthCta } from "@/components/auth-cta";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <SplitText as="h1" className="text-4xl font-semibold tracking-tight">
          Next Template
        </SplitText>
        <Reveal immediate delay={0.3}>
          <p className="text-muted-foreground">
            Next.js · Clerk · Supabase · shadcn/ui · GSAP
          </p>
        </Reveal>
        <Reveal immediate delay={0.45} className="h-9">
          <AuthCta />
        </Reveal>
      </div>
    </main>
  );
}
