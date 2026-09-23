import { Code2, HardDrive, Keyboard, Moon, ShieldCheck, UserX, WifiOff, Zap } from "lucide-react";

const features = [
  { icon: Code2, title: "Open source", body: "MIT licensed. Fork it, extend it, self-host it." },
  { icon: HardDrive, title: "Local first", body: "Favorites, palettes and tokens live in IndexedDB on your device." },
  { icon: UserX, title: "No login", body: "No accounts, no email, no paywall. Open the tab and work." },
  {
    icon: ShieldCheck,
    title: "No backend",
    body: "Nothing you make leaves your browser. There is no server to leak it.",
  },
  { icon: WifiOff, title: "Offline first", body: "Color, type scale and export tools work without a connection." },
  {
    icon: Keyboard,
    title: "Keyboard first",
    body: "⌘K for everything, G-shortcuts to jump, space to shuffle palettes.",
  },
  { icon: Zap, title: "Production ready", body: "Exports drop straight into CSS, SCSS, Tailwind v4 and React." },
  { icon: Moon, title: "Dark & light", body: "Carefully tuned themes that respect your system preference." },
];

export function Features() {
  return (
    <section aria-labelledby="features-title" className="border-y bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 md:py-24">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle-foreground">Principles</p>
          <h2 id="features-title" className="text-3xl font-medium md:text-4xl">
            Built like the tools you already love.
          </h2>
          <p className="text-muted-foreground">
            Fast, quiet and respectful of your data - inspired by Linear, Raycast and Vercel.
          </p>
        </div>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-2">
              <span className="flex size-8 items-center justify-center rounded-md border bg-background">
                <Icon className="size-4 text-brand" aria-hidden />
              </span>
              <h3 className="pt-2 text-sm font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
