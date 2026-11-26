---
title: "I Made an H5 Game with AI, from One Sentence to a Live TapTap Store Page"
description: "One sentence to have AI research the market and build the game, a zip upload to TapTap review, then AI-generated store assets — the concrete steps, real screenshots, and traps of the whole process."
pubDate: 2026-11-26 15:00
tags: ["AI", "game dev", "indie"]
cover: /covers/taptap-game.webp
---

The whole thing started not with code, but with one sentence. I told the AI: "Based on data from across the web, figure out what kind of game players actually love, and let's go with pure H5 — the fastest path to shipping and monetizing."

One day later, a playable game was on my phone. Within a week it was on a TapTap store page with an icon, a trailer, and ad placements. This post breaks the process down step by step — what I did, what the AI did, and where the traps were. Spoiler: the hardest part was not writing the code.

## Step 1: One sentence, market research first

I didn't start with "what game should I make". I made the AI argue from data first. Here's what it came back with:

![One sentence in WorkBuddy: market research results](/images/taptap-story/wb-research.jpg)

The numbers that drove every decision after:

- **Market size**: mini-games are a ~70B RMB/year market growing 3x faster than the overall pie; WeChat mini-games alone have 650M monthly users. TapTap is a different animal — younger players, heavy community, ratings decide exposure
- **Genre**: casual puzzle grew from 40% to 60% of the market, the largest lane; simulation grew 200%+, merge-2 70%+
- **Three rules of hits**: zero learning curve with a brutal difficulty ramp (level 1 is kindergarten, then it spikes), 30-second to 3-minute sessions, and social currency (leaderboards, friend PK)
- **Monetization**: rewarded video is the money printer — players voluntarily watch ads for revives/double rewards at a 50-65% rate, and placements on "failure moments" and "stuck moments" convert best

Under the constraints of TapTap + pure H5 + fastest path to monetization, I picked **color sorting**: rules you can explain in three seconds, an extremely high difficulty ceiling, and clean logic that AI can build in one pass.

The format decision mattered even more than the genre: **one single self-contained HTML file**. No build tools, no engine, no dependencies. Double-click and it plays. The reason is cold logic: H5 is the shortest path from code to a TapTap store page, and every layer of tooling I skip is one less thing that can break on shipping day.

## Step 2: The AI writes the game, I hunt for what feels wrong

A playable v0.1 came out in hours: ball sorting, whole-tube auto-clearing, undo, procedural sound effects, touch controls. That was the easy part. The real iteration happened after I picked up my phone and played — eight versions, each driven by something that felt off:

![Level 5 in progress](/images/taptap-story/game-level5.jpg)

- **Ball physics were wrong**: early versions stretched the balls to fill the tube. Fixed, then I locked that CSS block with a "do not touch" comment so no future edit could quietly regress it.
- **No tutorial**: v1 dumped players straight into the game. I added a three-step guided first level — tap a tube to pick up, tap an empty tube to drop, fill four of a color to clear — with a hand-built level 1 that anyone can win.
- **One ball per pour**: a hidden bug. The whole run of same-colored balls on top should move together; fixing it made the game feel right.
- **"Too easy, I cruised to level 18"** — that complaint turned into the most valuable debugging session of the project. I assumed the difficulty parameters needed tuning. Instrumented reality was worse: cranking the shuffle parameter from 6 to 30 produced byte-identical boards. The shuffle algorithm was mathematically broken; no parameter could save it.
- **The fix became the core technique**: stop generating levels blindly. Write an IDDFS solver, generate candidate boards, keep only those whose optimal solution lands inside a target difficulty band. Thirty main levels plus 64 endless-mode boards were computed in a 36-minute batch and baked into the game as static data. Every player gets the same board on the same level — runs are comparable, and speedruns actually mean something.

Later came the dual-mode structure (30 main levels graduating into a step-budgeted endless mode), and save/resume (every move written to localStorage, close the page and pick up where you left off). The lesson kept repeating itself: **AI writes code fast, but it cannot feel difficulty, fairness, or fun. Verification has to be engineered separately** — by the end I had Playwright scripts playing the entire game, BFS solvers computing optimal lines, and regression checks on every save change.

## Step 3: Register a TapTap developer, package, upload

Game done, time for the shelf. TapTap developer registration is free for individuals. I created the publisher "Moyu Games" (摸鱼游戏社), created the app, and filled in the store profile. This console is your whole empire after submission:

![TapTap developer console: two games under the publisher](/images/taptap-story/taptap-console.png)

Three traps worth knowing in advance:

**Trap 1: The entry you see may not be the one you need.** The "version release" page defaults to the Android/iOS package route, and a pure H5 zip looks like it has nowhere to go. The same page actually accepts H5 packages — look for the 1920×1080 promo image input plus the zip upload field.

**Trap 2: The zip structure is strict.** My first upload failed with "package parse error". The rule I confirmed by experiment: after extraction, the root must contain **exactly one folder**, and that folder must contain `index.html`:

```
colorsort_v1.0.0.zip
└── game/
    └── index.html
```

Name the folder in plain ASCII (I use `game`) to dodge Chinese-encoding issues. A five-line Python script does the packaging, reused for every game since.

**Trap 3: The form is more work than it looks.** Name, genre, description, one-line recommendation, developer info... The "home recommendation" field caps at 25 characters and is the first line shoppers see — harder to write than the whole description. The phone preview on the right shows your store page live before you submit:

![Version release page: form + phone preview](/images/taptap-story/taptap-publish.png)

Review turnaround is a day or two. One honest lesson here: my first version shipped as a "test build" and burned the first-launch exposure window — new games get a promotion push on launch day, and that chance comes exactly once. Always submit as a proper release.

## Step 4: AI generates every store asset

TapTap wants an icon, promo images in three aspect ratios, six real screenshots, and a real gameplay video. A designer? Not in this budget. The whole set came from AI plus scripts:

![WorkBuddy's delivery list of store assets](/images/taptap-story/wb-assets.png)

For my second game (侯府丫鬟·浮沉录, a text-based narrative sim) the delivery was: a 512×512 icon, a 1200×1800 portrait cover (the required 2:3 slot), a 1920×1080 landscape promo, six 1080×1920 screenshots, and a 21-second trailer. How each was made:

- **Icon and promo art**: parameterized SVG rendered through headless-browser screenshots. Gradients, glow, and palette are all tunable constants — change four numbers and every required size regenerates. For game two, swapping the theme took an hour.
- **Screenshots**: Playwright loads the real game, injects a mid-game state (score, moves, result panel), and captures at 360×640 logical size with a 3× scale factor — native 1080×1920 output where the UI is exactly phone-sized. Not mockups; real frames from the real product.
- **Trailer**: a BFS solver plays the actual game move by move while Playwright records. 21 seconds, 1080p, H.264, real click flows, frame-checked for black screens.

**The review rejection deserves its own paragraph**: my first promo art said "30 levels + endless mode" and the cover said "easy to pick up" — both rejected. TapTap's rule: **store images may contain nothing but the game's name; every selling point lives in the description text.** I rebuilt both images down to title-plus-artwork to pass. It felt backwards at first, but rules are rules — and it's now hard-coded into my submission checklist.

One more snag: AI-generated images and videos carry watermarks (bottom-right on images; top-left and bottom-right on videos). Uniform cropping removes them cleanly before final compression.

## Step 5: After launch, ads live behind one switch

The first version shipped with ads **fully disabled**: `AD_ENABLED = false`, entries hidden, code intact. Protect the review and the ratings first, turn ads on later. The entire ad layer sat dormant behind that switch — three rewarded placements (extra undos, an extra tube, double rewards — all explicit player actions) plus an interstitial every third level with a 3-minute cooldown.

Turning ads on was simpler than expected: authorize the official TapTap MCP tool with a QR scan, it queries your ad unit ID automatically (no console spelunking), fill the ID into config, repackage, resubmit. If the SDK isn't ready, every ad call fails silently — worst case the player misses a bonus; the game never blocks.

And then the real-world data lesson: nine days live, 21 store visits, 0 downloads, 0.3% CTR (healthy is 3–10%). The post-mortem: the launch window was wasted, the store art followed the rules so literally it had no hook, and casual puzzle is a 0.44x red ocean on TapTap. None of that is a pipeline failure — the asset tools, verification harnesses, packaging script, and submission checklist all carry over to the next game unchanged, with better genre data and a cover that respects the rules *and* stops the scroll.

## The reusable checklist

If you want to walk this path, the minimum viable version is six steps:

1. **One-sentence research**: make the AI pick the lane from data — zero learning curve, high difficulty ceiling, 30-second sessions
2. **Single-file H5**: no build tools; the game is one HTML file
3. **Verify on device**: headless-browser automation runs the full flow every version — never trust feel
4. **Package**: one ASCII folder + index.html at the zip root, scripted
5. **Assets**: parameterized icons and promos, screenshots and trailers captured from the real game, nothing but the name on store images
6. **Submit**: ship as a proper release to claim the launch window; keep ad code dormant behind a switch

AI compressed "make a game" from months into days, and "make it correct" from luck into engineering. What it did not compress at all is "make someone care" — that part is still mine to solve, and how game two attacks it is a story for another post.
