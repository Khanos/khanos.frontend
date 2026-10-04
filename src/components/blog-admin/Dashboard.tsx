import { useEffect, useState } from "react";
import type { BlogPage } from "../../types/blog";
import { isAdminPage } from "../../services/blog-admin-contract";
import { adminRequest, formatDate, publicationLabel } from "./client";

export default function Dashboard() {
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState<BlogPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setData(null);
    const query = new URLSearchParams({
      page: String(page),
      limit: "25",
      ...(status ? { status } : {}),
      ...(language ? { language } : {}),
    });
    adminRequest(`?${query}`, { signal: controller.signal }, isAdminPage)
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [status, language, page, reload]);
  async function remove(id: string, title: string) {
    if (
      !window.confirm(
        `Delete “${title}”? This permanently removes the post and its public URL.`,
      )
    )
      return;
    setDeleting(id);
    setError("");
    setSuccess("");
    try {
      await adminRequest(`/${id}`, { method: "DELETE" });
      setSuccess(
        "Post deleted. Public caches may take about 60 seconds to update.",
      );
      if (data?.data.length === 1 && page > 1) setPage(page - 1);
      else setReload((value) => value + 1);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not delete post.",
      );
    } finally {
      setDeleting(null);
    }
  }
  return (
    <div className="blog-admin">
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Private workspace</p>
          <h1>Blog admin</h1>
          <p>Create and manage your English and Spanish articles.</p>
        </div>
        <a className="admin-button primary" href="/admin/blog/new">
          New Post
        </a>
      </div>
      <div className="admin-toolbar">
        <label>
          Status
          <select
            aria-label="Status"
            value={status}
            disabled={!!deleting}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All posts</option>
            <option value="draft">Draft posts</option>
            <option value="published">Published & scheduled</option>
          </select>
        </label>
        <label>
          Language
          <select
            aria-label="Language"
            value={language}
            disabled={!!deleting}
            onChange={(event) => {
              setLanguage(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All languages</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </label>
        <button
          className="admin-button"
          disabled={loading || !!deleting}
          onClick={() => setReload((value) => value + 1)}
        >
          Refresh
        </button>
      </div>
      {error && (
        <div className="admin-notice error" role="alert">
          {error}{" "}
          <button
            className="admin-button"
            disabled={loading || !!deleting}
            onClick={() => setReload((value) => value + 1)}
          >
            Retry
          </button>
        </div>
      )}
      {success && (
        <p className="admin-notice" role="status">
          {success}
        </p>
      )}
      {loading && <p role="status">Loading posts…</p>}
      {data && (
        <>
          <p className="admin-muted">
            {data.pagination.total} posts · Page {data.pagination.page} of{" "}
            {Math.max(1, data.pagination.pages)}
          </p>
          {!data.data.length && (
            <div className="admin-card">
              <h2>No posts found</h2>
              <p>Create a post or change the filters.</p>
              <a href="/admin/blog/new">Write your first post →</a>
            </div>
          )}
          <div className="admin-posts">
            {data.data.map((post) => (
              <article className="admin-card" key={post.id}>
                <div className="admin-heading">
                  <h2>
                    <a href={`/admin/blog/${post.id}`}>{post.title}</a>
                  </h2>
                  <span className="admin-badge">{publicationLabel(post)}</span>
                </div>
                <p className="admin-muted admin-slug">{post.slug}</p>
                <dl className="admin-metadata">
                  <div>
                    <dt>Language</dt>
                    <dd>{post.language.toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt>Publication date</dt>
                    <dd>{formatDate(post.publishedAt)}</dd>
                  </div>
                  <div>
                    <dt>Categories</dt>
                    <dd>{post.categories.join(", ") || "—"}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{formatDate(post.updatedAt)}</dd>
                  </div>
                </dl>
                <div className="admin-actions">
                  <a className="admin-button" href={`/admin/blog/${post.id}`}>
                    Edit
                  </a>
                  <button
                    className="admin-button danger"
                    disabled={!!deleting}
                    onClick={() => remove(post.id, post.title)}
                  >
                    {deleting === post.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <nav className="admin-actions" aria-label="Post pages">
            <button
              className="admin-button"
              disabled={page <= 1 || !!deleting}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              className="admin-button"
              disabled={page >= data.pagination.pages || !!deleting}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
