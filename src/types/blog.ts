/** Contract documented in khanos.backend/docs/blog.md. Slug includes en/ or es/. */
export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  anonymous: boolean;
  coverImage: string;
  categories: string[];
  language: 'en' | 'es';
  status: 'published' | 'draft';
  publishedAt?: string;
  displayDate?: string;
  createdAt: string;
  updatedAt: string;
  readingMinutes: number;
};
export type BlogPost = BlogPostSummary & { content: string };
export type BlogPage = { data: BlogPostSummary[]; pagination: { page: number; limit: number; total: number; pages: number } };
