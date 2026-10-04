import { useEffect, useId, useRef, useState } from "react";
import {
  imageAccept,
  imageHelp,
  imageValidation,
} from "../../services/blog-images";

export default function BlogImageUploader({
  file,
  disabled,
  onChange,
}: {
  file: File | null;
  disabled: boolean;
  onChange: (file: File | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const helpId = useId();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function choose(files: FileList | null) {
    if (disabled || !files?.length) return;
    const invalid =
      files.length !== 1
        ? "Choose one image at a time."
        : imageValidation(files[0]);
    setError(invalid);
    onChange(invalid ? null : files[0]);
  }
  return (
    <div>
      <div
        className="admin-image-drop"
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes("Files"))
            event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          choose(event.dataTransfer.files);
        }}
      >
        {preview && (
          <img
            className="admin-image-preview"
            src={preview}
            alt="Selected image preview"
          />
        )}
        <p>{file ? file.name : "Drop an image here"}</p>
        <button
          className="admin-button"
          type="button"
          disabled={disabled}
          onClick={() => input.current?.click()}
        >
          Choose image
        </button>
        <input
          ref={input}
          type="file"
          accept={imageAccept}
          disabled={disabled}
          aria-label="Image file"
          aria-describedby={helpId}
          className="admin-file-input"
          onChange={(event) => {
            choose(event.target.files);
            event.target.value = "";
          }}
        />
        <p id={helpId} className="admin-muted">
          {imageHelp}
        </p>
      </div>
      {error && (
        <p className="admin-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
