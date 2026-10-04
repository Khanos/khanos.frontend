import { useEffect, useRef, useState } from "react";
import type { BlogPost } from "../../types/blog";
import { blogAsset } from "../../services/blog";
import type { BlogInput } from "../../services/blog-admin-contract";
import {
  isAdminPost,
  isObject,
  suggestSlug,
  validateBlogInput,
} from "../../services/blog-admin-contract";
import {
  adminRequest,
  AdminRequestError,
  formatDate,
  publicationLabel,
} from "./client";

type Form = Omit<BlogInput, "categories" | "status" | "publishedAt"> & {
  categories: string;
  publicationDate: string;
};
const empty: Form = {
  title: "",
  language: "en",
  slug: "en/",
  coverImage: "",
  content: "",
  categories: "",
  author: "",
  anonymous: false,
  excerpt: "",
  publicationDate: "",
};
export function localDate(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
function fromPost(post: BlogPost): Form {
  return {
    title: post.title,
    language: post.language,
    slug: post.slug,
    coverImage: blogAsset(post.coverImage),
    content: post.content,
    categories: post.categories.join(", "),
    author: post.author,
    anonymous: post.anonymous,
    excerpt: post.excerpt,
    publicationDate: localDate(post.publishedAt),
  };
}
export default function Editor({ id }: { id?: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [baseline, setBaseline] = useState(JSON.stringify(empty));
  const [manualSlug, setManualSlug] = useState(!!id);
  const [unlockSlug, setUnlockSlug] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState("");
  const [previewState, setPreviewState] = useState("");
  const dirty = JSON.stringify(form) !== baseline;
  const allowLeave = useRef(false);
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty || !!busy;
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    adminRequest(`/${id}`, { signal: controller.signal }, isAdminPost)
      .then((value) => {
        if (controller.signal.aborted) return;
        const next = fromPost(value);
        setPost(value);
        setForm(next);
        setBaseline(JSON.stringify(next));
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id, reload]);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current && !allowLeave.current) {
        event.preventDefault();
      }
    };
    const navigate = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a[href]");
      if (
        !link ||
        !dirtyRef.current ||
        allowLeave.current ||
        event.defaultPrevented
      )
        return;
      if (
        !window.confirm("Leave this editor? Your unsaved changes will be lost.")
      )
        event.preventDefault();
      else {
        allowLeave.current = true;
        setTimeout(() => {
          allowLeave.current = false;
        }, 1000);
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", navigate);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", navigate);
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setPreview("");
    if (!form.content) {
      setPreviewState("Write Markdown to see the preview.");
      return;
    }
    setPreviewState("Updating preview…");
    const timer = setTimeout(() => {
      adminRequest(
        "/preview",
        {
          method: "POST",
          body: JSON.stringify({ content: form.content }),
          signal: controller.signal,
        },
        (value): value is { html: string } =>
          isObject(value) && typeof value.html === "string",
      )
        .then((value) => {
          if (!controller.signal.aborted) {
            setPreview(value.html);
            setPreviewState("");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setPreviewState(
              "Preview unavailable. Edit the Markdown or try again.",
            );
        });
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.content, reload]);
  function change<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (!manualSlug && (key === "title" || key === "language"))
        next.slug = suggestSlug(next.title, next.language);
      return next;
    });
    setSuccess("");
  }
  async function save(status: "draft" | "published") {
    setError("");
    setSuccess("");
    setFields({});
    let publishedAt: string | undefined;
    if (form.publicationDate) {
      const parsed = new Date(form.publicationDate);
      if (!Number.isFinite(parsed.getTime())) {
        setFields({ publishedAt: "Enter a valid publication date." });
        return;
      }
      publishedAt =
        post?.publishedAt &&
        localDate(post.publishedAt) === form.publicationDate
          ? post.publishedAt
          : parsed.toISOString();
    } else if (status === "published" && post?.publishedAt)
      publishedAt = new Date().toISOString();
    const { publicationDate, categories, ...values } = form;
    const body: BlogInput = {
      ...values,
      categories: [
        ...new Set(
          categories
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        ),
      ],
      status,
      ...(publishedAt ? { publishedAt } : {}),
    };
    const validation = validateBlogInput(body);
    if (Object.keys(validation).length) {
      setFields(validation);
      setError("Check the highlighted fields.");
      return;
    }
    if (
      post &&
      post.slug !== body.slug &&
      !window.confirm(
        "Changing this slug changes the public URL. Existing links will stop working. Continue?",
      )
    )
      return;
    if (
      status === "draft" &&
      post?.status === "published" &&
      !window.confirm(
        "Save as draft? This removes the article from the public blog until you publish it again.",
      )
    )
      return;
    setBusy(status);
    try {
      const saved = await adminRequest(
        post ? `/${post.id}` : "",
        { method: post ? "PATCH" : "POST", body: JSON.stringify(body) },
        isAdminPost,
      );
      const next = fromPost(saved);
      setPost(saved);
      setForm(next);
      setBaseline(JSON.stringify(next));
      setManualSlug(true);
      setUnlockSlug(false);
      window.history.replaceState(null, "", `/admin/blog/${saved.id}`);
      setSuccess(
        saved.status === "draft"
          ? "Draft saved."
          : `${publicationLabel(saved)}. Public caches may take about 60 seconds to update.`,
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save post.");
      if (error instanceof AdminRequestError) setFields(error.fields);
    } finally {
      setBusy("");
    }
  }
  async function remove() {
    if (
      !post ||
      !window.confirm(
        `Permanently delete “${post.title}”?${dirty ? " Unsaved changes will also be lost." : ""} This removes its public URL.`,
      )
    )
      return;
    setBusy("delete");
    setError("");
    try {
      await adminRequest(`/${post.id}`, { method: "DELETE" });
      allowLeave.current = true;
      window.location.assign("/admin/blog");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not delete post.",
      );
      setBusy("");
    }
  }
  const fieldError = (key: string) =>
    fields[key] && (
      <span className="admin-field-error" id={`error-${key}`}>
        {fields[key]}
      </span>
    );
  const names: Record<string, string> = {
    title: "Title",
    slug: "Slug",
    language: "Language",
    coverImage: "Cover image URL",
    author: "Author",
    categories: "Categories",
    excerpt: "Excerpt",
    publishedAt: "Publication date / schedule",
    content: "Markdown",
  };
  const accessibility = (key: string) => ({
    "aria-label": names[key],
    "aria-invalid": !!fields[key],
    "aria-describedby": fields[key] ? `error-${key}` : undefined,
  });
  if (loading)
    return (
      <div className="blog-admin">
        <p role="status">Loading post…</p>
      </div>
    );
  if (id && !post)
    return (
      <div className="blog-admin">
        <p role="alert">{error}</p>
        <button
          className="admin-button"
          onClick={() => setReload((value) => value + 1)}
        >
          Retry
        </button>
        <a className="admin-button" href="/admin/blog">
          Back to posts
        </a>
      </div>
    );
  return (
    <div className="blog-admin">
      <a href="/admin/blog" className="admin-back">
        ← All posts
      </a>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Private workspace</p>
          <h1>{post ? "Edit post" : "New post"}</h1>
        </div>
        <span className="admin-badge">
          {post ? publicationLabel(post) : "Unsaved draft"}
        </span>
      </div>
      {post && (
        <p className="admin-muted">
          Updated {formatDate(post.updatedAt)}
          {post.publishedAt && ` · Publication ${formatDate(post.publishedAt)}`}
        </p>
      )}
      {error && (
        <p className="admin-notice error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="admin-notice" role="status">
          {success}
        </p>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy) void save("draft");
        }}
        noValidate
      >
        <fieldset disabled={!!busy}>
          <div className="admin-fields">
            <label className="admin-wide">
              <span>
                Title <span aria-hidden="true">*</span>
              </span>
              <input
                value={form.title}
                onChange={(event) => change("title", event.target.value)}
                required
                maxLength={300}
                {...accessibility("title")}
              />
              {fieldError("title")}
            </label>
            <label>
              Language
              <select
                aria-label="Language"
                value={form.language}
                disabled={post?.status === "published" && !unlockSlug}
                onChange={(event) =>
                  change("language", event.target.value as "en" | "es")
                }
              >
                <option value="en">English (EN)</option>
                <option value="es">Spanish (ES)</option>
              </select>
              {fieldError("language")}
            </label>
            <label>
              <span>
                Slug <span aria-hidden="true">*</span>
              </span>
              <input
                value={form.slug}
                disabled={post?.status === "published" && !unlockSlug}
                onChange={(event) => {
                  setManualSlug(true);
                  change("slug", event.target.value);
                }}
                required
                maxLength={240}
                {...accessibility("slug")}
              />
              {fieldError("slug")}
            </label>
            {post?.status === "published" ? (
              <div className="admin-wide admin-notice">
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={unlockSlug}
                    onChange={(event) => {
                      setUnlockSlug(event.target.checked);
                      if (!event.target.checked && post)
                        setForm((current) => ({
                          ...current,
                          slug: post.slug,
                          language: post.language,
                        }));
                    }}
                  />
                  Allow language / URL changes
                </label>
                <p>
                  Changing a published slug changes its public URL. Existing
                  links will stop working.
                </p>
              </div>
            ) : (
              <div className="admin-wide">
                <button
                  className="admin-button"
                  type="button"
                  onClick={() => {
                    setManualSlug(false);
                    change("slug", suggestSlug(form.title, form.language));
                  }}
                >
                  Suggest slug from title
                </button>
                <p className="admin-muted">
                  Use en/ or es/ followed by lowercase words and hyphens.
                </p>
              </div>
            )}
            <label className="admin-wide">
              <span>
                Cover image URL <span aria-hidden="true">*</span>
              </span>
              <input
                type="url"
                value={form.coverImage}
                placeholder="https://…"
                onChange={(event) => change("coverImage", event.target.value)}
                required
                maxLength={2048}
                {...accessibility("coverImage")}
              />
              {fieldError("coverImage")}
              <span className="admin-muted">
                HTTPS URL · image uploads are not required.
              </span>
            </label>
            <label>
              Author
              <input
                value={form.author}
                onChange={(event) => change("author", event.target.value)}
                maxLength={200}
                {...accessibility("author")}
              />
              {fieldError("author")}
            </label>
            <label>
              Categories
              <input
                value={form.categories}
                placeholder="AI, Development"
                onChange={(event) => change("categories", event.target.value)}
                {...accessibility("categories")}
              />
              {fieldError("categories")}
              <span className="admin-muted">
                Separate categories with commas.
              </span>
            </label>
            <label className="admin-check admin-wide">
              <input
                type="checkbox"
                checked={form.anonymous}
                onChange={(event) => change("anonymous", event.target.checked)}
              />
              Anonymous (hide author on the public article)
            </label>
            <label className="admin-wide">
              Excerpt
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(event) => change("excerpt", event.target.value)}
                maxLength={2000}
                {...accessibility("excerpt")}
              />
              {fieldError("excerpt")}
            </label>
            <label className="admin-wide">
              Publication date / schedule
              <input
                type="datetime-local"
                value={form.publicationDate}
                onChange={(event) =>
                  change("publicationDate", event.target.value)
                }
                {...accessibility("publishedAt")}
              />
              {fieldError("publishedAt")}
              <span className="admin-muted">
                Your local time (
                {Intl.DateTimeFormat().resolvedOptions().timeZone}). A future
                date schedules publication when you select Publish. Leave blank
                to publish now. Drafts remain private regardless of this date.
              </span>
            </label>
          </div>
          <div className="admin-markdown">
            <label>
              <span>
                Markdown <span aria-hidden="true">*</span>
              </span>
              <textarea
                className="admin-code"
                value={form.content}
                rows={24}
                onChange={(event) => change("content", event.target.value)}
                required
                maxLength={400000}
                {...accessibility("content")}
              />
              {fieldError("content")}
            </label>
            <section className="admin-preview" aria-label="Markdown preview">
              <h2>Preview</h2>
              {previewState && <p role="status">{previewState}</p>}
              <div
                className="blog-content prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </section>
          </div>
          <div className="admin-actions admin-save">
            <button className="admin-button" type="submit">
              {busy === "draft" ? "Saving…" : "Save Draft"}
            </button>
            <button
              className="admin-button primary"
              type="button"
              onClick={() => save("published")}
            >
              {busy === "published"
                ? "Publishing…"
                : form.publicationDate &&
                    Date.parse(form.publicationDate) > Date.now()
                  ? "Schedule publication"
                  : "Publish"}
            </button>
            {post && (
              <button
                className="admin-button danger"
                type="button"
                onClick={remove}
              >
                {busy === "delete" ? "Deleting…" : "Delete post"}
              </button>
            )}
            <span className="admin-muted" role="status">
              {busy
                ? "Saving changes…"
                : dirty
                  ? "Unsaved changes"
                  : "All changes saved"}
            </span>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
