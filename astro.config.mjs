import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 上线前改成你的真实域名，sitemap 和 canonical 都靠它
  site: 'https://your-domain.pages.dev',
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
