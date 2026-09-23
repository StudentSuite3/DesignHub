export type IcoImage = {
  size: number;
  png: Uint8Array;
};

/**
 * Encodes PNG images into a single .ico file (PNG-compressed entries,
 * supported by every browser and Windows Vista+).
 *
 * Layout: ICONDIR (6 bytes) + ICONDIRENTRY × n (16 bytes each) + PNG payloads.
 */
export function encodeIco(images: IcoImage[]): Uint8Array {
  const headerSize = 6 + images.length * 16;
  const total = headerSize + images.reduce((sum, image) => sum + image.png.length, 0);
  const buffer = new Uint8Array(total);
  const view = new DataView(buffer.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, images.length, true);

  let offset = headerSize;
  images.forEach((image, index) => {
    const entry = 6 + index * 16;
    const dimension = image.size >= 256 ? 0 : image.size; // 0 means 256
    view.setUint8(entry, dimension);
    view.setUint8(entry + 1, dimension);
    view.setUint8(entry + 2, 0); // palette colors
    view.setUint8(entry + 3, 0); // reserved
    view.setUint16(entry + 4, 1, true); // color planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, image.png.length, true);
    view.setUint32(entry + 12, offset, true);
    buffer.set(image.png, offset);
    offset += image.png.length;
  });

  return buffer;
}
