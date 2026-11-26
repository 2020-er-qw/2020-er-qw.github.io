import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 用用户站点仓库（2020-er-qw.github.io）：免费地址即根域名，无需 base。
  // 将来换自定义域名：site 改成 'https://你的域名' 并建 public/CNAME 写域名即可。
  site: 'https://2020-er-qw.github.io',
  integrations: [
    sitemap({
      // filter 收到完整 URL：排除 404 页和根跳转页（pathname 为 /）
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !pathname.endsWith('/404/') && pathname !== '/';
      },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
