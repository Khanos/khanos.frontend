import { useEffect, useId, useRef, useState } from "react";
import BlogImageUploader from "./BlogImageUploader";
import { uploadBlogImage, type ImageProgress } from "./image-upload";
import { imageValidation } from "../../services/blog-images";

export default function ImageUploadDialog({
  kind,
  initialFile,
  onClose,
  onUploaded,
}: {
  kind: "cover" | "inline";
  initialFile?: File;
  onClose: () => void;
  onUploaded: (url: string, alt: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const controller = useRef<AbortController | null>(null);
  const titleId = useId(),
    progressId = useId(),
    altHelpId = useId();
  const [file, setFile] = useState<File | null>(
    initialFile && !imageValidation(initialFile) ? initialFile : null,
  );
  const [alt, setAlt] = useState("");
  const [error, setError] = useState(
    initialFile ? imageValidation(initialFile) : "",
  );
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<ImageProgress | null>(null);
  useEffect(() => {
    dialog.current?.showModal();
    return () => controller.current?.abort();
  }, []);
  function close() {
    controller.current?.abort();
    onClose();
  }
  async function add() {
    if (!file || busy) return;
    const attempt = new AbortController();
    controller.current = attempt;
    setBusy(true);
    setError("");
    try {
      const url = await uploadBlogImage(file, attempt.signal, setProgress);
      if (!attempt.signal.aborted) onUploaded(url, alt);
    } catch (error) {
      if (!attempt.signal.aborted)
        setError(
          `${error instanceof Error ? error.message : "Image upload failed."} Your article content and existing cover have not been changed.`,
        );
    } finally {
      if (!attempt.signal.aborted) setBusy(false);
    }
  }
  const status =
    progress?.phase === "preparing"
      ? "Preparing image…"
      : progress?.phase === "complete"
        ? "Complete"
        : progress?.percentage !== undefined
          ? `Uploading image… ${Math.round(progress.percentage)}%`
          : "Uploading image…";
  return (
    <dialog
      ref={dialog}
      className="admin-image-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <h2 id={titleId}>
        {kind === "inline" ? "Add image" : "Upload cover image"}
      </h2>
      <BlogImageUploader
        file={file}
        disabled={busy}
        onChange={(next) => {
          setFile(next);
          setError("");
          setProgress(null);
        }}
      />
      {kind === "inline" && (
        <label>
          Alt text
          <input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            disabled={busy}
            maxLength={1000}
            aria-describedby={altHelpId}
          />
          <span id={altHelpId} className="admin-muted">
            Describe what the image shows. Leave blank only for a decorative
            image.
          </span>
        </label>
      )}
      {busy && (
        <div className="admin-upload-progress">
          <p id={progressId} role="status">
            {status}
          </p>
          <progress
            max={100}
            value={
              progress?.phase === "uploading" ? progress.percentage : undefined
            }
            aria-labelledby={progressId}
          />
        </div>
      )}
      {error && (
        <p className="admin-notice error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-actions">
        <button type="button" className="admin-button" onClick={close}>
          Cancel
        </button>
        <button
          type="button"
          className="admin-button primary"
          disabled={!file || busy}
          onClick={() => void add()}
        >
          {busy
            ? "Uploading…"
            : kind === "inline"
              ? "Add image"
              : "Upload image"}
        </button>
      </div>
    </dialog>
  );
}
