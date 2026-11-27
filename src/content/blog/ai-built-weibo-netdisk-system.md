---
title: I Built a Weibo Auto-Transfer System with AI: 25 Files, One Week of Real Use
description: From "manually copying drive links from Weibo every day" to a local automated pipeline — I had AI generate a 9,357-line system in one sentence. Here's the full process, real running data, and the pitfalls.
pubDate: 2026-11-27 10:00
tags: [AI Workflow, Automation, Productivity]
draft: false
pinned: false
cover: /covers/netdisk-system.webp
---

> This is part two of my "building products with AI" series. The last post covered how I built an H5 game with AI and shipped it to TapTap. This one is more practical: a system that watches Weibo accounts for me, transfers files into my cloud drive, and formats the content for publishing.

## 1. The starting point: an hour of mindless copy-paste every day

Here's what I was doing. I follow a few Weibo accounts that share study materials — every day they post updates crammed with Quark and Baidu cloud drive share links, like this:

![A Weibo account's daily drive-link roundup](/images/netdisk-story/weibo-source.jpg)

What I needed: save those resources into my own drive, then format them into a list and post it to my own account. Simple in theory. In practice, the routine looked like this:

1. Open Weibo, scroll through the accounts I follow;
2. Copy out every drive link buried in each post;
3. Open the drive app, paste, transfer, create folders, rename;
4. Generate a fresh share link from my own account for everything I just saved;
5. Format resource names and links into a list, copy it, post it to my own Weibo.

A dozen-plus links per post, several posts a day. After a few days of this I was done — it's pure copy-paste with zero thinking involved, and it's easy to miss things: miss one link and that post's resource collection is permanently incomplete.

So I opened WorkBuddy and typed one sentence: **"Build me a system that watches these Weibo accounts, automatically grabs drive links, transfers the files, rebuilds share links, and formats everything into lists."**

## 2. One sentence in, 25 files and 9,357 lines out

The AI didn't negotiate with me or ask me to install a dozen dependencies first. It generated a complete runnable codebase directly in my workspace: 25 files, frontend and backend plus startup scripts, 9,357 lines in total. It ran its own safety checks, detected my local Node version (v22.22.2), and told me: double-click `start.bat` and you're live.

I later packaged the whole thing into a reusable tool skill in WorkBuddy's skill library. This is what its listing page looks like:

![The system's skill listing page in WorkBuddy](/images/netdisk-story/wb-skill-intro.jpg)

Two deliberate design decisions here matter more than any feature list:

**First: zero third-party dependencies.** The project installs not a single npm package. `package.json` is spotless; `node src/server.js` just runs. No dependencies means no supply-chain risk — projects copied off the internet often drag in hundreds of packages, and if even one gets poisoned, you're compromised. This system's 9,357 lines all live on my own disk, and I can open and read every one of them.

**Second: fully local.** The console runs on `127.0.0.1:8848`, and all data lives in a local `db.json`. No server, no hosting fees, no cloud account system. It's a folder on your hard drive — delete the folder and it's uninstalled.

Double-click to start, open the console in a browser, and the machine is alive.

## 3. The architecture: a seven-step pipeline

The skeleton of the system is basically my five-step manual routine, decomposed into seven automated stages:

![The system's pipeline architecture](/images/netdisk-story/pipeline.svg)

The first three steps (monitor, expand short links, detect links) are about *seeing* resources: every few minutes the system checks the accounts I follow, auto-expands the `t.cn` short links buried in new posts, and parses out the real Quark or Baidu drive addresses. Steps four and five are about *getting* resources: links are transferred into my own drive with folders auto-created by resource name, duplicates are skipped, and everything gets rebuilt as a share link from my own account. The last two steps are about *publishing*: resource names and links get formatted into list copy automatically, then queued up.

The console homepage is the pipeline's dashboard:

![Console dashboard: 3 accounts monitored, 290 items captured](/images/netdisk-story/console-home.jpg)

These are real numbers after a week of running: 3 accounts monitored, 290 items captured, 100 filtered out as unneeded, 200 published. That countdown timer in the top-right means it keeps running in the background — far more reliable than me playing human alarm clock.

The publish history page is my favorite — every row is work the system finished on my behalf:

![Publish history: 200 published list posts](/images/netdisk-story/console-history.jpg)

Each record keeps the source link, the full generated copy, and buttons like "open Weibo" and "copy text." In other words, the system stops at "content ready, one click from posting" — the final trigger stays in my hands. That's not a capability limitation; it's a boundary choice, and I'll come back to it.

The monitored-accounts page is the pipeline's entrance. Adding an account takes nothing more than pasting a Weibo UID or profile URL:

![Monitored accounts page: 3 accounts added](/images/netdisk-story/console-accounts.jpg)

And what does the transfer output look like? Opening my Quark drive, the folders were all created automatically by the system, organized by resource name:

![Files auto-archived by the system in Quark drive](/images/netdisk-story/quark-result.jpg)

## 4. Three places where AI genuinely impressed me

Looking back at this system, three design choices feel smarter than what I would have built myself:

**1. Account pool and login-state management.** Both Weibo scraping and drive transfers depend on login states. Cookie storage, expiry detection, and invalidation alerts are all standalone modules, with multi-account rotation available. I hit one expired-cookie incident (more below), and the system's response wasn't a crash — it told me exactly which account's cookie had gone stale and needed refreshing.

**2. Everything persisted to disk.** All state — published history, filtered items, monitored accounts, settings — lives in one `db.json`. Reboot the machine, close and reopen the console, nothing is lost. It sounds like table stakes, but plenty of automation tools die precisely because "state lives in memory and a restart wipes everything."

**3. Filtering is rules, not blacklists.** The 100 filtered records aren't false positives; they're my configured rules working: unwanted resource types (paid courses, ebooks, video lessons) can be set by keyword, editable anytime on the settings page. That turns "filtering" from a one-time action into a continuously tunable policy.

## 5. Pitfalls and boundaries: three things worth writing down

One week in, three pitfalls — none fatal, all worth documenting.

**Pitfall one: version numbers when packaging the skill.** I later packaged the system as a reusable tool for upload. The first attempt failed — directory nesting exceeded the depth limit. Fixed that, failed again — `SKILL.md` was missing about a dozen required fields. Fixed that, failed a third time — "the package version 1.0.0 must be greater than the current version." The first two were spec issues; the third is actually the platform protecting you from silently overwriting old versions — a well-designed wall you're guaranteed to hit once. The skill is now on version 1.3.1.

![The version-number error on my first skill upload](/images/netdisk-story/skill-error.jpg)

**Pitfall two: login states expire. This is physics for all automation.** One day the system suddenly stopped finding anything. I opened browser DevTools to inspect the cookies and found the credentials expired — that token in Storage with its expiry timestamp, wearing a "please log in again" expression:

![Inspecting an expired login state in DevTools](/images/netdisk-story/devtools-token.jpg)

There's no permanent fix for this. No matter how good the system is, an expired cookie needs a human to renew it. My solution: make "check login states" a weekly habit I do in passing, instead of waiting until the pipeline goes silent.

**Pitfall three: boundaries matter more than features.** A few modules in this system stay switched off by default — automated posting, account-warming features. The reason is simple: transferring resources I legitimately have access to and formatting copy is an efficiency tool; bulk auto-posting and account farming is poking platform risk-control systems with a stick. The tool's shape defines your safety zone — **the system handles 99% of the mechanical labor, and the final 1%, the "publish" button, stays human**. That ratio isn't timidity; it's sustainability.

## 6. The efficiency math of AI-built tools

Let me do the final accounting.

What would this system have cost the traditional way? Learn it yourself: Node.js, the Weibo platform, drive APIs, a frontend framework — months even if it goes well. Or hire someone: a personal automation utility like this tends to quote higher than it's worth. This time, from one sentence to a running system took one afternoon; going from v1.0 to v1.3 was just me stating new requirements in the conversation.

There's a subtler shift, too, and it's about mindset. Most people are reluctant to heavily modify a 9,357-line codebase they wrote by hand — the fear of breaking it wins. But with this system, I know where every line lives; when I want a new filter rule or a copy-formatting tweak, I say one sentence in the chat and the change goes live locally. **Code stops being a liability and becomes a draft you can regenerate at any time** — that's the biggest difference between building personal tools in the AI era versus before.

That said, a bucket of cold water is owed here: AI compresses the time it takes to *build*, not the time it takes to *know what to build*. I had already run this workflow manually for days before generating the system — precisely because I knew which steps were most annoying and most error-prone, my one-sentence requirements could specify things like "deduplicate transfers" and "lists should carry hashtags." AI turns the process in your head into code. If there's no process in your head, what you get is a rough sketch.

So the right way to use this kind of system: run the workflow with your own hands first, then let AI free your hands.

> Next up, I plan to cover this system's sibling — how an AI-generated content pipeline plugs into daily writing. If you want to build your own automation tool, start with part one: *I Made an H5 Game with AI, from One Sentence to a Live TapTap Store Page*.
