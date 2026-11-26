import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { parsePostId } from '../i18n/helpers';

export async function GET(context: APIContext) {
  // RSS 只输出英文版（订阅主流），链接走统一规则 /posts/<base>/
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .filter((p) => parsePostId(p.id).lang === 'en')
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'AI Field Notes',
    description: 'Hands-on notes on using AI tools for real work — writing, image and video generation, content workflows.',
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: parsePostId(post.id).href,
    })),
    customData: '<language>en-gb</language>',
  });
}
