import { ui, type Lang } from './ui';

export function isLang(value: string | undefined): value is Lang {
  return value === 'en' || value === 'zh';
}

export function getText(lang: Lang) {
  return ui[lang];
}

// 把 /en/... 与 /zh/... 对应路径互换；不在语言路径内则原样返回
export function switchPath(pathname: string, from: Lang, to: Lang): string {
  if (from === to) return pathname;
  const rest = pathname.replace(new RegExp(`^/${from}(/|$)`), '/');
  if (rest === pathname) return pathname; // 不是 /en/ 或 /zh/ 路径（文章页等）
  return `/${to}${rest === '/' ? '/' : rest}`;
}

// ============================================================
// 博客文章语言规则（与 Sveltia CMS 的 i18n multiple_files 对齐）
//   英文文件：<名称>.md      → URL /posts/<名称>/
//   中文文件：<名称>.zh.md    → URL /posts/<名称>-zh/
// 语言从文件名后缀推导，不再依赖 frontmatter 的 lang 字段
// ============================================================
export interface PostIdInfo {
  lang: Lang;
  base: string;   // 不含语言后缀的文件名
  href: string;   // 站内链接
  enId: string;   // 对应英文文件的 content id
  zhId: string;   // 对应中文文件的 content id
}

export function parsePostId(id: string): PostIdInfo {
  const isZh = id.endsWith('.zh');
  const base = isZh ? id.slice(0, -3) : id;
  return {
    lang: isZh ? 'zh' : 'en',
    base,
    href: `/posts/${base}${isZh ? '-zh' : ''}/`,
    enId: base,
    zhId: `${base}.zh`,
  };
}
