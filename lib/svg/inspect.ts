import { makeAbsolute, parseSVG } from "svg-path-parser";

export type PathCommandSummary = { code: string; label: string; values: string };

export type PathReport = {
  commands: PathCommandSummary[];
  counts: Record<string, number>;
  subpaths: number;
  bounds: { x: number; y: number; width: number; height: number } | null;
  error?: string;
};

const round = (value: number) => Math.round(value * 100) / 100;

/** Command-level breakdown of path data, powered by svg-path-parser. */
export function inspectPath(d: string): PathReport {
  try {
    const parsed = parseSVG(d);
    const absolute = makeAbsolute(parseSVG(d));
    const counts: Record<string, number> = {};
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    absolute.forEach((command) => {
      counts[command.command] = (counts[command.command] ?? 0) + 1;
      const points: [number, number][] = [[command.x, command.y]];
      if ("x1" in command) points.push([command.x1, command.y1]);
      if ("x2" in command) points.push([command.x2, command.y2]);
      points.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });
    const commands = parsed.map((command) => {
      const values = Object.entries(command)
        .filter(([key]) => key !== "code" && key !== "command" && key !== "relative")
        .map(([, value]) => (typeof value === "number" ? round(value) : value ? 1 : 0))
        .join(" ");
      return { code: command.code, label: command.command, values };
    });
    return {
      commands,
      counts,
      subpaths: parsed.filter((command) => command.code === "M" || command.code === "m").length,
      // Control points are included, so this is a safe outer bound rather than the tight curve bounds.
      bounds: Number.isFinite(minX)
        ? { x: round(minX), y: round(minY), width: round(maxX - minX), height: round(maxY - minY) }
        : null,
    };
  } catch (error) {
    return {
      commands: [],
      counts: {},
      subpaths: 0,
      bounds: null,
      error: error instanceof Error ? error.message : "Invalid path",
    };
  }
}
