import { upload } from "@vercel/blob/client";
import {
  imagePath,
  imageValidation,
  publicBlobImageUrl,
} from "../../services/blog-images";

export type ImageProgress = {
  phase: "preparing" | "uploading" | "complete";
  percentage?: number;
};
export async function uploadBlogImage(
  file: File,
  signal: AbortSignal,
  onProgress: (value: ImageProgress) => void,
): Promise<string> {
  onProgress({ phase: "preparing" });
  const invalid = imageValidation(file);
  if (invalid) throw new Error(invalid);
  signal.throwIfAborted();
  try {
    const blob = await upload(imagePath(file), file, {
      access: "public",
      handleUploadUrl: "/api/blog-admin/upload",
      contentType: file.type,
      clientPayload: JSON.stringify({ type: file.type, size: file.size }),
      multipart: false,
      abortSignal: signal,
      onUploadProgress: ({ percentage }) => {
        if (!signal.aborted) onProgress({ phase: "uploading", percentage });
      },
    });
    signal.throwIfAborted();
    if (
      !publicBlobImageUrl(blob?.url) ||
      blob.pathname !== new URL(blob.url).pathname.slice(1)
    )
      throw new Error("Unexpected image upload response. Try again.");
    onProgress({ phase: "complete" });
    return blob.url;
  } catch (error) {
    if (signal.aborted) throw new Error("Image upload cancelled.");
    // Never display arbitrary provider messages, which may contain request details.
    const message = error instanceof Error ? error.message : "";
    if (/expired/i.test(message))
      throw new Error(
        "Upload permission expired. Retry to request new permission.",
      );
    if (/access denied|unauthorized|client token/i.test(message))
      throw new Error(
        "Could not authorize image upload. Reload to sign in, or retry after checking Blob configuration.",
      );
    if (message === "Unexpected image upload response. Try again.") throw error;
    throw new Error(
      "Image upload failed. Check your connection and try again.",
    );
  }
}
