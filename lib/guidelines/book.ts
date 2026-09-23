import { imagesToPdf, type PdfPage } from "@/lib/export/pdf";
import { rasterize } from "@/lib/export/raster";
import type { GuidelineContext, GuidelinePage } from "@/lib/guidelines/types";

/** Page size in points: 16:10 landscape, a little larger than A4 so small type stays crisp. */
const PAGE_PT = { width: 960, height: 600 };

/**
 * Renders every included page at 2× and binds them into one PDF with pdf-lib.
 * Pages are JPEG so a full book stays a few megabytes.
 */
export async function buildBrandBook(
  ctx: GuidelineContext,
  pages: GuidelinePage[],
  onProgress?: (done: number, total: number) => void,
): Promise<Uint8Array> {
  const images: PdfPage[] = [];
  for (const [i, page] of pages.entries()) {
    const image = await rasterize(page.render(ctx, i + 1), 2, 8192, "jpeg");
    images.push({ image, ...PAGE_PT });
    onProgress?.(i + 1, pages.length + 1);
  }
  const pdf = await imagesToPdf(images, {
    title: `${ctx.brand.name} brand guidelines`,
    author: ctx.brand.name,
    subject: ctx.brand.description,
    keywords: ["brand guidelines", ctx.brand.name, ...pages.map((page) => page.title)],
  });
  onProgress?.(pages.length + 1, pages.length + 1);
  return pdf;
}
