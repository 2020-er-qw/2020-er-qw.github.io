---
title: "From Trending Topic to Published Post: My AI Content Pipeline"
description: "A real look at the AI content pipeline I use to go from a trending topic to a published post — which steps I automate, which ones I refuse to, and the browser automation traps that cost me a morning."
pubDate: 2026-11-26
tags: ["AI", "automation", "content"]
lang: en
translation: from-trending-topic-to-published-post-zh
cover: /covers/ai-content-pipeline.webp
---

My phone buzzes at 8:00 a.m. A new article has already been sent out. I didn't write it that morning — I wrote it the night before, and a scheduled job handled the delivery.

That's the promise of an AI content pipeline, and it's real. But the version you see in "automate your entire content business in 10 minutes" videos is missing the part that actually decides whether anyone reads the thing. This is my actual workflow, including the steps I deliberately keep manual.

## The whole pipeline in one line

> Pick a topic → write a draft with Gemini → rewrite it in my own voice → adapt it per platform → publish → schedule the next one.

Five of those six steps can be partly automated. The one that can't is the voice. Get that wrong and you've built a very efficient machine for publishing things nobody wants to read.

## Step 1: Finding the topic (half automated)

I let automation do the collection. A scheduled task pulls the day's trending lists and sends them to my inbox, so I start with a menu rather than a blank page.

But here's the filter I apply before writing anything:

- **Does this have two sides?** A topic where everyone already agrees makes for a bad opinion piece. There's nothing to argue with.
- **Is it something people actually argue about at dinner?** Abstract industry news doesn't spread. "Should you pay off your mortgage early" does.
- **Can I say something in 500 words that others haven't?**

The first two are checkboxes. The third is the one that kills most trending topics. If I can't answer it in ten seconds, I skip the topic — no matter how hot it is.

Automation collects candidates. I make the call. That division has not changed, and I don't expect it to.

## Step 2: Writing the draft with Gemini

I use Gemini in the browser, not an API. That's a deliberate choice — I want to see the output and intervene while it's being generated, not receive a finished file and edit it blind.

My prompt does three things:

1. Gives it a **role and a reader** (who's talking, who's listening).
2. Hands it a **style sample** — a piece I wrote that sounds like me. This matters more than any instruction like "write casually."
3. Asks for **arguments, not a summary**. Summaries read like press releases. I want a position.

The first output is almost never usable. It's too clean, too balanced, too complete. The fix is a follow-up question, not a new prompt: *"Cut the intro. Lead with the contradiction. Sound like you're talking to a friend who disagrees with you."*

That second pass usually gets it 70% of the way there. The last 30% is me.

## Step 3: The step I refuse to automate

Every AI writing tool eventually produces the same texture: balanced paragraphs, transition words, a neat conclusion that says nothing. Readers can smell it.

So I rewrite the draft by hand. Not a light edit — I change the openings, break a few sentences on purpose, cut any line that sounds like a brochure, and add one specific detail from my own experience that no model could invent.

If you skip this step, you'll publish consistently and grow nowhere. I've seen accounts with perfect posting schedules and zero engagement, and the reason is always the same: the text has no person in it.

## Step 4: One article, several platforms

I don't write separate pieces for each platform. I write one core article, then adapt it.

- **Short-form feed:** lead with the single most arguable sentence. No setup. The first line does all the work.
- **Long-form article:** keep the structure, expand the examples, add subheads so people can scan.
- **Second network:** same argument, different register — more conversational, more slang, shorter sentences.

The adaptation itself can be prompted. But the decision about *which* angle belongs on *which* platform is mine, because it depends on who's there and what they'll argue about.

## Step 5: Publishing, and where automation bit me

Publishing is where I use browser automation. A script opens the drafting page, fills in the text, and handles the repetitive clicking. It saves real time.

It also taught me a few things the hard way:

- **Never automate a logged-in session you can't watch.** I once had a run hang halfway through and leave a half-published draft. I lost a morning fixing it. If a step can fail, give it a clear stopping point and check before continuing.
- **Do not fight a platform's rate limits.** Scheduled posting is fine. Rapid, repeated actions are not. Slow down.
- **Use a separate browser profile for automation.** Keep your personal browser and your automation browser apart. It prevents an entire category of problems that are painful to diagnose.

Automation is good at the mechanical part. It has no judgment about whether the thing it's publishing is ready, so I check before it runs.

## The time math

Here's an honest accounting for one article, assuming the topic is already chosen:

| Step | Automated | Manual |
|---|---|---|
| Collecting trending topics | Yes | 5 min to filter |
| First draft | Yes (Gemini, ~15 min of back-and-forth) | — |
| Voice rewrite | No | 25–40 min |
| Platform adaptation | Partly | 10 min |
| Publishing | Yes | 2 min to verify |

The automation saves maybe 20 minutes on a good day. The rewriting is the cost of doing business. If you're looking for a way to publish without that cost, this pipeline isn't it — and honestly, neither is any other.

## What I'd tell someone starting

Build the boring parts first: topic collection, draft generation, scheduling. Those are deterministic and safe to automate. Then add the publishing step once you trust the rest.

Keep the voice step manual for as long as you care whether people read you. The moment that becomes "just a step in the workflow," the pipeline works perfectly and produces nothing worth reading.

If you'd like, start with just the first two steps and write the final version yourself. You'll learn more from ten articles written that way than from a fully automated system running for a month.
