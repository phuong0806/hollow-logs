import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/posts';

export async function GET(context) {
  const posts = getAllPosts();

  return rss({
    title: 'hollow.logs',
    description: 'Blog cá nhân — nhật ký học tập',
    site: context.site,
    items: posts.map(post => ({
      title: post.meta.title,
      pubDate: post.meta.pubDate,
      description: post.meta.description,
      link: post.url,
    })),
  });
}
