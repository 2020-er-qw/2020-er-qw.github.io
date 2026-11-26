import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // 保留文件名中的点号：中文文件 <名称>.zh.md 的 id 必须是 <名称>.zh，
  // 否则语言后缀识别会失效（Astro 默认会把点号吞掉变成 <名称>zh）
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // 后台留空时 Sveltia 会存空字符串 ''，必须转成 undefined，否则 Invalid Date 炸构建
    updatedDate: z.preprocess((v) => (v === '' || v == null ? undefined : v), z.coerce.date().optional()),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 封面图路径（相对 public/，如 /covers/xxx.png）；置顶文章在列表顶部固定展示
    cover: z.string().optional(),
    pinned: z.boolean().default(false),
  }),
});

export const collections = { blog };
