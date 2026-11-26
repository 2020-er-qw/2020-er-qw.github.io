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
