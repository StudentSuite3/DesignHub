import { componentNameFromFile, toJsx } from "@/lib/svg/jsx";
import type { SvgNode } from "@/types/svg";

/** SVG element → react-native-svg component. Anything missing here is unsupported. */
const COMPONENTS: Record<string, string> = {
  svg: "Svg",
  g: "G",
  path: "Path",
  rect: "Rect",
  circle: "Circle",
  ellipse: "Ellipse",
  line: "Line",
  polyline: "Polyline",
  polygon: "Polygon",
  text: "Text",
  tspan: "TSpan",
  textPath: "TextPath",
  defs: "Defs",
  use: "Use",
  symbol: "Symbol",
  linearGradient: "LinearGradient",
  radialGradient: "RadialGradient",
  stop: "Stop",
  clipPath: "ClipPath",
  mask: "Mask",
  pattern: "Pattern",
  image: "Image",
  marker: "Marker",
  title: "",
  desc: "",
};

export type NativeResult = { code: string; warnings: string[] };

function convert(node: SvgNode, used: Set<string>, warnings: Set<string>): SvgNode | null {
  if (node.type === "text") return node;
  const component = COMPONENTS[node.name];
  if (component === undefined) {
    warnings.add(`<${node.name}> isn't supported by react-native-svg and was removed.`);
    return null;
  }
  if (component === "") return null; // <title>/<desc>: use accessibilityLabel instead.

  const attributes: Record<string, string> = {};
  for (const [name, value] of Object.entries(node.attributes)) {
    if (name === "class") {
      warnings.add("CSS classes don't apply in React Native; style them with props instead.");
      continue;
    }
    if (name === "style") {
      // Inline declarations become props (react-native-svg accepts presentation attributes as props).
      for (const rule of value.split(";")) {
        const [key = "", ...rest] = rule.split(":");
        if (key.trim() && rest.join(":").trim()) attributes[key.trim()] = rest.join(":").trim();
      }
      continue;
    }
    if (name.startsWith("xmlns") || name.startsWith("data-") || name === "version" || name.startsWith("xml:")) continue;
    attributes[name === "xlink:href" ? "href" : name] = value;
  }

  used.add(component);
  return {
    ...node,
    name: component,
    attributes,
    children: node.children
      .map((child) => convert(child, used, warnings))
      .filter((child): child is SvgNode => child !== null),
  };
}

export function reactNativeComponent(root: SvgNode, fileName: string): NativeResult {
  const used = new Set<string>();
  const warnings = new Set<string>();
  const hasStyleSheet = root.children.some((child) => child.name === "style");
  if (hasStyleSheet)
    warnings.add("<style> blocks aren't supported; their rules were dropped. Inline the colors first.");

  const withoutStyles = { ...root, children: root.children.filter((child) => child.name !== "style") };
  const tree = convert(withoutStyles, used, warnings);
  if (!tree) return { code: "", warnings: [...warnings] };

  const width = root.attributes.width ?? "24";
  const height = root.attributes.height ?? "24";
  tree.attributes.width = width;
  tree.attributes.height = height;

  const name = componentNameFromFile(fileName);
  const named = [...used].filter((component) => component !== "Svg").sort();
  const imports = named.length
    ? `import Svg, { ${named.join(", ")} } from "react-native-svg";`
    : `import Svg from "react-native-svg";`;
  // react-native-svg types gradient children as an array, so they're emitted as one.
  const markup = toJsx(tree, { rootSpread: "{...props}", arrayChildren: new Set(["LinearGradient", "RadialGradient"]) })
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")
    .trimStart();

  const code = `import type { SvgProps } from "react-native-svg";
${imports}

export function ${name}(props: SvgProps) {
  return (
    ${markup}
  );
}
`;
  return { code, warnings: [...warnings] };
}
