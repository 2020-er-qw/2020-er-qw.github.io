import type { APIContext } from 'astro';

// 动态生成 robots.txt：sitemap 地址跟随 astro.config.mjs 里的 site，
// 以后换域名只改 site 一处，这里自动跟着变
export function GET(context: APIContext) {
  const site = context.site!.origin;
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
