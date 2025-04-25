import { BlogMetadata, BlogPost } from '../types';

// Import all blog content files
const blogModules = import.meta.glob('../blogs/*/content.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

// Import all metadata files
const metadataModules = import.meta.glob('../blogs/*/metadata.json', {
  eager: true,
  import: 'default',
});

export const getBlogPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];

  for (const [path, content] of Object.entries(blogModules)) {
    // Extract the slug from the path (e.g., '../blogs/sample-blog/content.md' -> 'sample-blog')
    const slug = path.split('/')[2];
    const metadataPath = path.replace('content.md', 'metadata.json');
    const metadata = metadataModules[metadataPath] as BlogMetadata;

    if (metadata) {
      posts.push({
        metadata,
        content: content as string,
        slug,
      });
    }
  }

  return posts;
};

export const getBlogPost = (slug: string): BlogPost | null => {
  const contentPath = `../blogs/${slug}/content.md`;
  const metadataPath = `../blogs/${slug}/metadata.json`;

  const content = blogModules[contentPath] as string;
  const metadata = metadataModules[metadataPath] as BlogMetadata;

  if (!content || !metadata) {
    return null;
  }

  return {
    metadata,
    content,
    slug,
  };
}; 