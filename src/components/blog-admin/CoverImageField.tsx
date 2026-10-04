export default function CoverImageField({
  value,
  onChange,
  onUpload,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onUpload: () => void;
  error?: string;
}) {
  let preview = "";
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password)
      preview = url.href;
  } catch {
    /* Incomplete URL. */
  }
  return (
    <div className="admin-wide admin-cover-field">
      <p>
        Cover image <span aria-hidden="true">*</span>
      </p>
      {preview ? (
        <img
          className="admin-cover-preview"
          src={preview}
          alt="Cover image preview"
        />
      ) : (
        <div className="admin-image-drop admin-muted">Choose a cover image</div>
      )}
      <div className="admin-actions">
        <button className="admin-button" type="button" onClick={onUpload}>
          {value ? "Replace image" : "Upload cover image"}
        </button>
        {value && (
          <button
            className="admin-button"
            type="button"
            onClick={() => onChange("")}
          >
            Remove cover image
          </button>
        )}
      </div>
      <label>
        Cover image URL
        <input
          type="url"
          value={value}
          placeholder="https://…"
          onChange={(event) => onChange(event.target.value)}
          required
          maxLength={2048}
          aria-label="Cover image URL"
          aria-invalid={!!error}
          aria-describedby={error ? "error-coverImage" : "cover-image-help"}
        />
        {error && (
          <span className="admin-field-error" id="error-coverImage">
            {error}
          </span>
        )}
        <span className="admin-muted" id="cover-image-help">
          Upload an image or use an existing HTTPS URL. A cover is required to
          save this post.
        </span>
      </label>
    </div>
  );
}
