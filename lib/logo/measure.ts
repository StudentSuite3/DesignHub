/** Width of `text` in px using the real font when the browser has it, an estimate otherwise. */
export function measureText(text: string, family: string, weight: number, size: number): number {
  if (typeof document !== "undefined") {
    const context = document.createElement("canvas").getContext("2d");
    if (context) {
      context.font = `${weight} ${size}px "${family}", system-ui, sans-serif`;
      return context.measureText(text).width;
    }
  }
  return text.length * size * 0.58;
}
