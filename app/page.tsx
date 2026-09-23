import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-4 p-8">
      <h1 className="text-4xl font-semibold tracking-tight">DesignHub</h1>
      <p className="text-muted-foreground">Stop opening 15 design websites. Open one.</p>
      <Button>Get started</Button>
    </main>
  );
}
