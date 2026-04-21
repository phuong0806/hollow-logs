/**
 * Collect metadata from all post files in /src/pages/posts/
 * Mỗi file post phải export `metadata` object.
 */

export interface PostMeta {
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
  theme?: string;
  draft?: boolean;
}

export interface Post {
  slug: string;
  url: string;
  meta: PostMeta;
}

// Glob tất cả file .astro trong posts (trừ index)
const modules = import.meta.glob<{ metadata: PostMeta }>('/src/pages/posts/*.astro', { eager: true });

export function getAllPosts(): Post[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const slug = path.replace('/src/pages/posts/', '').replace('.astro', '');
      return {
        slug,
        url: `/posts/${slug}/`,
        meta: mod.metadata,
      };
    })
    .filter(post => post.meta && !post.meta.draft)
    .sort((a, b) => new Date(b.meta.pubDate).valueOf() - new Date(a.meta.pubDate).valueOf());
}
