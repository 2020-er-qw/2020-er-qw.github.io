import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.string().default('en'),
    translation: z.string().optional(),
    // 封面图路径（相对 public/，如 /covers/xxx.png）；置顶文章在列表顶部固定展示
    cover: z.string().optional(),
    pinned: z.boolean().default(false),
  }),
});

export const collections = { blog };
