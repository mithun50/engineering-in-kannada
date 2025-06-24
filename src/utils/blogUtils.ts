import { BlogMetadata, BlogPost } from '../types';
import i18n from '../i18n'; // Import i18n instance

// Import all blog content files (e.g., content.md, content.kn.md, etc.)
// When removing query and import options, glob returns modules like: { default: "markdown content" }
const allContentModules: Record<string, { default: string }> = import.meta.glob('../blogs/*/content*.md', {
  eager: true,
});

// Import all metadata files (e.g., metadata.json, metadata.kn.json, etc.)
// When removing import option, glob returns modules like: { default: { title: "..." } }
const allMetadataModules: Record<string, { default: BlogMetadata }> = import.meta.glob('../blogs/*/metadata*.json', {
  eager: true,
});

export const getBlogPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  const processedSlugs = new Set<string>();
  const currentLang = i18n.language || 'en';

  // Iterate over all metadata files to identify unique blog slugs
  // Prioritize metadata.<lang>.json, then metadata.json
  for (const path in allMetadataModules) {
    const slug = path.split('/')[2];

    if (processedSlugs.has(slug)) {
      continue;
    }

    let metadataMod: { default: BlogMetadata } | undefined;
    let contentMod: { default: string } | undefined;
    let postLang = currentLang; // Assume current language initially

    // 1. Try current language metadata
    const currentLangMetadataPath = `../blogs/${slug}/metadata.${currentLang}.json`;
    if (allMetadataModules[currentLangMetadataPath]) {
      metadataMod = allMetadataModules[currentLangMetadataPath];
      // Try corresponding current language content for this metadata
      const currentLangContentPath = `../blogs/${slug}/content.${currentLang}.md`;
      if (allContentModules[currentLangContentPath]) {
        contentMod = allContentModules[currentLangContentPath];
      } else {
        // Fallback to default content if current lang content not found for current lang metadata
        const defaultContentPath = `../blogs/${slug}/content.md`;
        if (allContentModules[defaultContentPath]) {
          contentMod = allContentModules[defaultContentPath];
        }
      }
    } 
    // 2. Fallback to default language metadata (metadata.json)
    else {
      const defaultMetadataPath = `../blogs/${slug}/metadata.json`;
      if (allMetadataModules[defaultMetadataPath]) {
        metadataMod = allMetadataModules[defaultMetadataPath];
        postLang = 'en'; // Metadata is default, so post lang is default
        // Try corresponding current language content (if metadata was default but content for current lang exists)
        const currentLangContentPath = `../blogs/${slug}/content.${currentLang}.md`;
        if (allContentModules[currentLangContentPath]) {
          contentMod = allContentModules[currentLangContentPath];
        } else {
          // Fallback to default content for default metadata
          const defaultContentPath = `../blogs/${slug}/content.md`;
          if (allContentModules[defaultContentPath]) {
            contentMod = allContentModules[defaultContentPath];
          }
        }
      }
    }

    if (metadataMod && metadataMod.default) {
      const metadata = metadataMod.default;
      // Use contentMod.default if available, otherwise use metadata.description. If contentMod is undefined, content is undefined.
      const content = contentMod && contentMod.default ? contentMod.default : (metadataMod.default ? metadataMod.default.description : undefined);
      
      posts.push({
        metadata,
        content: content || metadata.description, // Ensure there's a fallback for content
        slug,
        lang: postLang,
      });
      processedSlugs.add(slug);
    } else {
      console.warn(`Metadata module or default export missing for slug: ${slug} in getBlogPosts`);
    }
  }

  return posts.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
};

export const getBlogPost = (slug: string): BlogPost | null => {
  const currentLang = i18n.language || 'en';
  let metadataMod: { default: BlogMetadata } | undefined;
  let contentMod: { default: string } | undefined;
  let postLang = currentLang;

  // Strategy:
  // 1. Try metadata.<currentLang>.json + content.<currentLang>.md
  // 2. Try metadata.<currentLang>.json + content.md (default content)
  // 3. Try metadata.json (default) + content.<currentLang>.md
  // 4. Try metadata.json (default) + content.md (default)

  const currentLangMetadataPath = `../blogs/${slug}/metadata.${currentLang}.json`;
  const currentLangContentPath = `../blogs/${slug}/content.${currentLang}.md`;
  const defaultMetadataPath = `../blogs/${slug}/metadata.json`;
  const defaultContentPath = `../blogs/${slug}/content.md`;

  if (allMetadataModules[currentLangMetadataPath] && allContentModules[currentLangContentPath]) {
    // Case 1: Full current language match
    metadataMod = allMetadataModules[currentLangMetadataPath];
    contentMod = allContentModules[currentLangContentPath];
    // postLang is already currentLang
  } else if (allMetadataModules[currentLangMetadataPath] && allContentModules[defaultContentPath]) {
    // Case 2: Current language metadata, default content
    metadataMod = allMetadataModules[currentLangMetadataPath];
    contentMod = allContentModules[defaultContentPath];
    // postLang is currentLang (metadata language takes precedence)
  } else if (allMetadataModules[defaultMetadataPath] && allContentModules[currentLangContentPath]) {
    // Case 3: Default metadata, current language content
    metadataMod = allMetadataModules[defaultMetadataPath];
    contentMod = allContentModules[currentLangContentPath];
    postLang = 'en'; // Metadata is default
  } else if (allMetadataModules[defaultMetadataPath] && allContentModules[defaultContentPath]) {
    // Case 4: Full default fallback
    metadataMod = allMetadataModules[defaultMetadataPath];
    contentMod = allContentModules[defaultContentPath];
    postLang = 'en';
  } else {
    // No valid combination found for the given slug
    console.warn(`No valid metadata/content combination found for slug: ${slug} and lang: ${currentLang}`);
    return null;
  }
  
  // Ensure the modules and their default exports exist
  if (!metadataMod || !metadataMod.default) {
    console.error(`Metadata module or default export missing for slug: ${slug}`);
    return null;
  }
  // For getBlogPost, content is essential. If contentMod or its default is missing, it's an error.
  if (!contentMod || !contentMod.default) {
    console.error(`Content module or default export missing for slug: ${slug}`);
    return null;
  }

  const metadata = metadataMod.default;
  const content = contentMod.default;

  return {
    metadata,
    content,
    slug,
    lang: postLang,
  };
};
