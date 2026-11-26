# AI Field Notes

中英双语 AI 工具实操博客。Astro 5 静态站 + **GitHub Pages 免费托管，全程无服务器**，带网页后台（Sveltia CMS）：浏览器里写文章、传封面、点发布，自动构建上线，不碰代码、不配 OAuth、不需要任何代理服务。

## 一、本地运行

需要 Node.js 18+（推荐 20+）。

```bash
npm install
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
```

本地 `/admin/` 会显示后台界面，但要真正登录发布需先部署上线并生成 GitHub 令牌（见第五节）。

## 二、目录结构

```
src/
  content/blog/       文章 .md（后台和手动都能改）
  content.config.ts   文章字段定义
  i18n/               文案字典（全站中英文在这里）
  components/         页头/页脚/Cookie横幅/首页组件
  pages/
    [lang]/           中英双语页面（首页/About/隐私/Cookie/订阅/404）
    posts/            文章页
  styles/global.css   全站样式
public/
  admin/              CMS 后台（index.html 加载 Sveltia + config.yml）
  covers/             文章封面图
  favicon.svg, robots.txt, CNAME（自定义域名用）
.github/workflows/
  deploy.yml          GitHub Actions：push 自动构建并部署到 GitHub Pages
scripts/             工作文件
```

> 没有任何 `functions/` 目录——Sveltia 用令牌直连 GitHub API，不需要 OAuth 代理函数。

## 三、写文章的两种方式

### 方式 A：网页后台（推荐，部署后用）

1. 打开 `https://你的域名/admin/`，点 **Sign In Using Access Token**，粘贴 GitHub 令牌（令牌生成见第五节第 4 步）。令牌会记在该浏览器里，之后不用重复粘贴。
2. 左侧 **Posts** → **New Post**。
3. 填字段：
   - **Title / Description**：标题和摘要
   - **Pub date**：发布日期
   - **Cover**：上传封面图（自动存到 `public/covers`）
   - **Language**：`en` 英文 / `zh` 中文——**做双语要分别建两篇**
   - **Translation**：另一语言版本的 slug（如 `welcome-to-ai-field-notes-zh`），没有就留空
   - **Pinned**：置顶（同一语言只开一篇）
   - **Draft**：**发布前一定要关掉**，否则网站上看不到
   - **Tags / Body**：标签和正文
4. 点 **Publish**。Sveltia 自动 commit 到 GitHub → GitHub Actions 触发构建 → 一两分钟后文章上线。

> 中英双语做法：写一篇英文的，记下 slug；再建中文篇，Language 选 `zh`，Translation 填英文 slug；英文篇的 Translation 回填中文 slug。两篇自动互链 + hreflang。

### 方式 B：手动写 Markdown（本地开发时用）

在 `src/content/blog/` 新建 `.md`：

```markdown
---
title: "Your title here"
description: "One-sentence summary, shown in search results and social cards."
pubDate: 2026-11-26
tags: ["AI", "automation"]
lang: en
translation: your-post-slug-zh
cover: /covers/your-image.webp
pinned: false
draft: false
---

正文...
```

- `draft: true` 的文章不上首页和 RSS。
- `cover` 填 `/covers/` 下的图，建议 16:9、WebP 格式。
- `pinned: true` 置顶，同一语言只置顶一篇。

## 四、环境变量

复制 `.env.example` 为 `.env`：

| 变量 | 说明 | 必填 |
|---|---|---|
| `PUBLIC_ADSENSE_ID` | AdSense 发布者 ID，`ca-pub-` 开头。没填就不加载广告 | 否 |

Cookie 横幅在访客点 Accept 之前**不加载**广告脚本（GDPR 硬要求，别改坏）。

## 五、部署到 GitHub Pages（完整步骤）

### 第 1 步：改配置里的占位符（3 处）

提交代码前先改：

1. `astro.config.mjs` → `site` 改成你的真实域名，如 `https://blog.你的域名.com`（**自定义域名不设 `base`**）
2. `public/robots.txt` → sitemap 地址改成同一域名
3. `public/admin/config.yml` → `backend.repo` 已设为 `2020-er-qw/2020-er-qw.github.io`（如换仓库名需同步改这里）

### 第 2 步：建 public/CNAME 文件（仅自定义域名需要）

**现在用免费地址 `https://2020-er-qw.github.io` 上线，跳过此步。**

将来买了自定义域名后，在 `public/` 下新建无扩展名文件 `CNAME`，内容就一行你的域名：

```
blog.你的域名.com
```

同时把 `astro.config.mjs` 的 `site` 改成 `https://blog.你的域名.com`。这个文件会被原样复制到 `dist/CNAME`，GitHub Pages 靠它识别自定义域名。

### 第 3 步：项目推到 GitHub

在 GitHub 新建一个仓库，**名字必须 exactly 是 `2020-er-qw.github.io`**（用户名 + `.github.io`，这是"用户站点仓库"，免费地址就是根域名 `https://2020-er-qw.github.io`）。创建时不要勾 README / .gitignore / license，保持空仓库。

然后在本项目目录执行（本地 git 仓库已经初始化并提交了，只需连远程 + 推送）：

```bash
git remote add origin https://github.com/2020-er-qw/2020-er-qw.github.io.git
git push -u origin main
```

> 推送时会弹出 GitHub 登录窗口，浏览器登录一次即可（本机已装 git 2.55，会走凭证管理器）。
> 如果之前已经跑过 `git init` / `git commit`，这里就只需上面两条命令。

### 第 4 步：开启 GitHub Pages + Actions

1. 仓库 → **Settings** → **Pages** → Build and deployment，Source 选 **GitHub Actions**。
2. 推代码后，**Actions** 标签页会出现 `Deploy to GitHub Pages` 工作流，等它跑绿（首次约 1–2 分钟）。
3. 构建通过后，站点发布在你的域名（配了 CNAME 就用自定义域名）。

> 部署脚本在 `.github/workflows/deploy.yml`，用官方 `withastro/action`，push 到 main 自动触发。不用改它。

### 第 5 步：生成 GitHub 令牌（后台登录用）

1. 打开 https://github.com/settings/personal-access-tokens/new
2. 按下面填：
   - **Token name**：随意，如 `AI Field Notes CMS`
   - **Expiration**：建议设 1 年（到期重新生成即可）
   - **Resource owner**：选你的用户名
   - **Repository access**：选 **Only select repositories** → 勾选本站仓库
   - **Repository permissions** → **Contents** 设为 **Read and write**（关键！默认只读，不改会登录失败没权限）
   - Metadata 会自动选 Read-only，不用管
3. 点 **Generate token**，复制生成的 `github_pat_...`（**只显示一次**）。

### 第 6 步：测试后台

打开 `https://你的域名/admin/` → 点 **Sign In Using Access Token** → 粘贴令牌 → 进入文章列表即成功。新建一篇测试文章 Publish，等一两分钟看是否上线。

> **令牌安全**：这个令牌只授权了这一个仓库的内容读写，泄露了影响范围也只有这个仓库，随时可在上面链接里 Revoke。每个写作者用自己的令牌，不要共用。登录这一步需要能访问 github.com（大陆网络需代理），但日常写文章不受影响。

## 六、接 AdSense 的时机

**别一上线就申请**：

1. 先写够 15–20 篇原创，每篇 1000 词以上
2. 全部被 Google 收录（`site:你的域名` 检查，或提交 Google Search Console）
3. 隐私政策页里的联系方式占位文字**换成真邮箱**（现在还是占位）
4. 申请 AdSense → 通过后把 ID 填进 `PUBLIC_ADSENSE_ID` → 重新 push 触发部署

被拒最常见：内容太少、隐私页是空的、站点内容薄。

## 七、成本

| 项 | 费用 |
|---|---|
| GitHub Pages | 免费（含自动构建，无服务器） |
| GitHub 私有仓库 | 免费 |
| 域名 .com | 约 60–80 元/年（用 github.io 则 0） |
| AdSense | 免费，收入分成 |
| 合计 | 启动 0 元，年成本最多一个域名钱 |

## 八、上线前检查清单

- [ ] `astro.config.mjs` 的 `site` 改成真实域名（自定义域名不设 base）
- [ ] `public/CNAME` 内容 = 你的域名（自定义域名时）
- [ ] `public/robots.txt` 的 sitemap 地址改成真实域名
- [ ] `public/admin/config.yml` 的 `backend.repo` = `2020-er-qw/2020-er-qw.github.io`（已填，换仓库需改）
- [ ] 隐私政策页的联系方式换成真实邮箱
- [ ] GitHub 仓库 Settings → Pages → Source 选了 GitHub Actions
- [ ] Actions 工作流 `Deploy to GitHub Pages` 跑绿
- [ ] 生成了 Contents: Read and write 的 fine-grained PAT，后台能登录
- [ ] Cookie 横幅不接受就不加载广告（已实现，别改坏）
