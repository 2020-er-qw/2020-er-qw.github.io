---
title: "I Made a Game with AI and Shipped It to TapTap: The Full Process"
description: "From picking a genre to a live store page: building a color-sorting puzzle as a single HTML file, generating every store asset with scripts, and the traps TapTap review set for me."
pubDate: 2026-11-26 15:00
tags: ["AI", "game dev", "indie"]
cover: /covers/taptap-game.webp
---

Let me start with the honest numbers. My game has been live on TapTap for nine days: 21 store page visits, 0 downloads. Day one gave me about 500 impressions, then the curve fell off a cliff.

I'm telling you this upfront because the interesting part isn't the traffic — it's that one person with AI can now go from "I want to make a game" to a live store page with ads integrated, in days, without writing a line of code by hand. That pipeline is real, and it's fully reusable. Here's how it actually went, traps included.

## Day 0: picking a lane

I didn't start with a game idea. I started with data. Casual puzzle games take roughly 60% of the mini-game market share, sorting and merge sub-genres are expanding fastest, and the common pattern in hits is: zero learning curve, brutally high difficulty ceiling, 30-second sessions.

Then the format decision, which mattered more than the genre: **pure H5, one single self-contained HTML file**. No build tools, no engine, no dependencies. Double-click the file and it plays. The reason is cold logic: H5 is the fastest path from code to a TapTap store page, and every layer of tooling I skip is a layer that can't break on shipping day.

## The AI writes the game. It can't tell if the game is fun.

A playable v0.1 came out in hours: color ball sorting with whole-tube auto-clearing, undo, procedural sound effects, touch controls. That was the easy part. The next eight versions were all driven by one thing — actually playing it on a phone and noticing what felt wrong.

The ball shape was wrong (they stretched to fill the tube — physics should not work that way), so the CSS got locked down and marked "do not touch". There was no tutorial, so I added a three-step guided first level. A hidden bug let you only pour one ball at a time instead of the whole run of same-colored ones.

Then the real problem: **"it's too easy, I cruised to level 18."** That complaint turned into the most valuable debugging session of the whole project. I had assumed my level generator just needed harder parameters. When I actually instrumented it, the truth was worse: cranking the shuffle parameter from 6 to 30 produced byte-identical boards. The algorithm was mathematically broken, not badly tuned — every board solved itself in 8 to 17 moves no matter what I set.

The fix became the core technique of the project: stop generating levels blindly. Write an IDDFS solver, generate candidate boards at random, keep only the ones whose optimal solution lands in a target difficulty band. Thirty main levels plus sixty-four endless-mode boards got computed in a 36-minute batch run and baked into the game as static data. Every player gets the same board on the same level. Runs are comparable. Speedruns mean something.

The lesson I keep re-learning: AI writes code fast, but it cannot feel difficulty, fairness, or fun. Verification has to be engineered separately. By the end I had Playwright scripts that played the whole game end-to-end, BFS solvers computing optimal lines, and regression checks on every save-file migration. The code was written by AI in minutes; the trust in the code took days of harness-building.

## Store assets without a designer

TapTap wants an icon, promotional images in three aspect ratios, six screenshots, and a real gameplay video. I produced all of it with scripts:

- **Icon and promo art**: parameterized SVG (gradient balls, glass tubes, glow layers) rendered through headless browser screenshots. Change four constants, get a new image in every required size.
- **Screenshots**: Playwright loads the real game and injects a mid-game state — score, moves, the level-clear panel — then captures at 360×640 logical size with a 3× device scale factor, which comes out as a native 1080×1920 shot where the UI is exactly phone-sized.
- **The trailer**: a BFS solver plays the actual game move by move while Playwright records. 28 seconds, native 1080p, a real optimal-solution run of level 5.

Browser automation turned out to be my free art outsourcer — not for inventing art, but for producing authentic-looking material from the real product, reproducibly.

## The traps TapTap set

Three, in increasing order of embarrassment.

**The zip structure.** My first upload failed with "package parse error". The requirement: after extraction, the root directory must contain exactly one folder, and that folder must contain `index.html`. Not files at the root — one folder. A five-line Python script rebuilds the archive correctly; naming the folder in plain ASCII avoids an afternoon of Chinese-encoding pain.

**The review rejection.** My promo art said things like "30 levels + endless mode" and my cover said "easy to pick up". Rejected. The rule: **store images may contain nothing but the game's name**. Every selling point must live in the description text. I rebuilt both images with the title and nothing else. It felt backwards — the whole point of cover art is the hook — but rules are rules, and now it's burned into my checklist.

**The promise trap.** My early marketing copy said "no ads, no in-app purchases" — accurate at the time, since I shipped v1.0 with all ads disabled to protect the review and ratings. But the ad code was kept in place behind a single config flag, because the plan was always to turn ads on in a later version. Every "no ads" claim had to be scrubbed from every asset before submission. Anything you promise in public, you will eventually contradict in an update log.

## Ads, gated behind one boolean

First version: `AD_ENABLED = false`. Entries hidden, code intact. After launch, I authorized the official TapTap MCP tool with a QR-code scan, and it queried my ad unit ID automatically — no hunting through console pages. Three rewarded-video placements, all on explicit player actions (extra undos, an extra tube, double rewards), plus an interstitial after every third level with a 3-minute cooldown. Every ad call fails silently if the SDK isn't ready: worst case, the player doesn't get a bonus; the game never blocks.

Turning ads on for v1.1 was literally changing a string in the config and resubmitting.

## The honest numbers, again

Nine days: 21 visits, 0 downloads, 0.3% click-through (healthy is 3–10%). Post-mortem, in order of blame: I shipped as a "test version" and burned the first-launch exposure window; my store art followed the rules so literally that it had no hook at all; and casual puzzle on TapTap is a red ocean with distribution efficiency of 0.44x — supply far outruns demand.

None of those are failures of the pipeline. The generator scripts, the verification harnesses, the packaging script, the submission checklist — all of them run again unchanged for game #2, with better genre data and a cover that respects the rules *and* stops the scroll.

AI compressed "make a game" from months into days. It compressed "make it verifiably correct" from luck into engineering. What it did not compress at all is "make someone care". That part is still mine to figure out — and I'll tell you how game #2 attacks it.
