import sharp from "sharp";

const MAX_WIDTH = 800;

export async function optimizeImage(
  buffer: Buffer
): Promise<{ data: Buffer; mimeType: string }> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width =
    metadata.width && metadata.width > MAX_WIDTH ? MAX_WIDTH : undefined;

  const optimized = await image
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return { data: optimized, mimeType: "image/webp" };
}
