import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { PageHeader } from "@/components/ui/page-header";

const swatches = ["background", "surface", "card", "muted", "border-strong", "brand", "success", "warning", "destructive"];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-8 p-8">
      <PageHeader eyebrow="Design system" title="DesignHub" description="Stop opening 15 design websites. Open one." />
      <div className="flex flex-wrap items-center gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Badge variant="brand">Brand</Badge>
        <Kbd>⌘K</Kbd>
      </div>
      <Input placeholder="Search fonts, colors, icons..." />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
        {swatches.map((name) => (
          <div key={name} className="flex flex-col gap-1">
            <div className="h-12 rounded-md border" style={{ background: `var(--${name})` }} />
            <span className="text-[11px] text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>12px radius, 8px spacing rhythm.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">Inter for UI, Space Grotesk for display.</CardContent>
      </Card>
    </main>
  );
}
