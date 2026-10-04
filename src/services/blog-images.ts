// Shared public policy only. Credentials and token generation belong on the server.
export const imageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;
export type BlogImageType = keyof typeof imageTypes;
export const imageAccept = Object.keys(imageTypes).join(",");
export const maximumImageBytes = 10_000_000;
export const imageHelp = "JPEG, PNG, WebP or AVIF · up to 10 MB";
export function imageValidation(file: { type: string; size: number }): string {
  if (!Object.prototype.hasOwnProperty.call(imageTypes, file.type))
    return "Choose a JPEG, PNG, WebP or AVIF image.";
  if (!Number.isSafeInteger(file.size) || file.size < 1)
    return "This image is empty or invalid. Choose another file.";
  if (file.size > maximumImageBytes)
    return "This image is too large. Choose an image up to 10 MB.";
  return "";
}
export function imagePath(
  file: Pick<File, "name" | "type">,
  now = new Date(),
): string {
  const stem =
    file.name
      .replace(/\.[^.]*$/, "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "image";
  const extension = imageTypes[file.type as BlogImageType];
  if (!extension) throw new Error("Unsupported image type.");
  return `blog/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}-${stem}.${extension}`;
}
export const imagePathPattern =
  /^blog\/\d{4}\/(?:0[1-9]|1[0-2])\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}-[a-zA-Z0-9-]{1,110}\.(?:jpg|png|webp|avif)$/;
export function publicBlobImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash &&
      /^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname) &&
      imagePathPattern.test(url.pathname.slice(1))
    );
  } catch {
    return false;
  }
}
