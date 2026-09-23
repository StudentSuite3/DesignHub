import { makeAbsolute, parseSVG, type CommandMadeAbsolute } from "svg-path-parser";

type Point = [number, number];

function roundTo(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/** Shortest textual form of a number: no trailing zeros, no leading "0" before the decimal point. */
export function formatNumber(value: number, precision: number): string {
  const rounded = roundTo(value, precision);
  if (Object.is(rounded, -0) || rounded === 0) return "0";
  return String(rounded).replace(/^(-?)0\./, "$1.");
}

/** Joins numbers with the fewest separators: "-" and a second "." both start a new number on their own. */
function joinNumbers(values: string[]): string {
  let out = "";
  for (const value of values) {
    if (!out) {
      out = value;
      continue;
    }
    const previousHasDot = /\.\d*$/.test(out.split(/[\s,-]/).pop() ?? "");
    const needsSpace = !(value.startsWith("-") || (value.startsWith(".") && previousHasDot));
    out += needsSpace ? ` ${value}` : value;
  }
  return out;
}

type Segment = { absolute: string; relative: string; code: string };

/**
 * Re-serializes path data at the given precision. Every coordinate is rounded once in absolute
 * space and relative values are derived from the *rounded* pen position, so errors never accumulate.
 * Each segment uses whichever of the absolute or relative form is shorter.
 */
export function optimizePathData(d: string, precision: number): string {
  let commands: CommandMadeAbsolute[];
  try {
    commands = makeAbsolute(parseSVG(d));
  } catch {
    return d;
  }

  const r = (value: number) => roundTo(value, precision);
  const f = (value: number) => formatNumber(value, precision);
  let pen: Point = [0, 0];
  let start: Point = [0, 0];
  const segments: Segment[] = [];

  for (const command of commands) {
    const code = command.code.toUpperCase();
    const point = (x: number, y: number): Point => [r(x), r(y)];
    const rel = (p: Point) => [f(p[0] - pen[0]), f(p[1] - pen[1])];
    const abs = (p: Point) => [f(p[0]), f(p[1])];

    if (code === "Z") {
      segments.push({ absolute: "", relative: "", code: "Z" });
      pen = start;
      continue;
    }

    const target = point(command.x, command.y);
    let absValues: string[] = [];
    let relValues: string[] = [];

    switch (command.code) {
      case "M":
      case "L":
      case "T":
        absValues = abs(target);
        relValues = rel(target);
        break;
      case "H":
        absValues = [f(target[0])];
        relValues = [f(target[0] - pen[0])];
        break;
      case "V":
        absValues = [f(target[1])];
        relValues = [f(target[1] - pen[1])];
        break;
      case "C": {
        const c1 = point(command.x1, command.y1);
        const c2 = point(command.x2, command.y2);
        absValues = [...abs(c1), ...abs(c2), ...abs(target)];
        relValues = [...rel(c1), ...rel(c2), ...rel(target)];
        break;
      }
      case "S": {
        const c2 = point(command.x2, command.y2);
        absValues = [...abs(c2), ...abs(target)];
        relValues = [...rel(c2), ...rel(target)];
        break;
      }
      case "Q": {
        const c1 = point(command.x1, command.y1);
        absValues = [...abs(c1), ...abs(target)];
        relValues = [...rel(c1), ...rel(target)];
        break;
      }
      case "A": {
        const shared = [
          f(command.rx),
          f(command.ry),
          f(command.xAxisRotation),
          command.largeArc ? "1" : "0",
          command.sweep ? "1" : "0",
        ];
        absValues = [...shared, ...abs(target)];
        relValues = [...shared, ...rel(target)];
        break;
      }
    }

    segments.push({ absolute: joinNumbers(absValues), relative: joinNumbers(relValues), code });
    pen = target;
    if (code === "M") start = target;
  }

  let out = "";
  let previous = "";
  segments.forEach((segment, index) => {
    if (segment.code === "Z") {
      out += "z";
      previous = "z";
      return;
    }
    // The first moveto is always absolute; everything else picks the shorter spelling.
    const useRelative = index > 0 && segment.relative.length < segment.absolute.length;
    let letter = useRelative ? segment.code.toLowerCase() : segment.code;
    const values = useRelative ? segment.relative : segment.absolute;
    // Repeated commands can omit the letter. `previous` is normalised so a moveto counts as a lineto,
    // because extra coordinates after "M"/"m" are implicit "L"/"l" commands.
    const implicit = previous === letter;
    const body = implicit ? (values.startsWith("-") ? values : ` ${values}`) : `${letter}${values}`;
    out += body;
    if (letter === "M") letter = "L";
    if (letter === "m") letter = "l";
    previous = letter;
  });
  return out.trim();
}
