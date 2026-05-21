---
title: On software, running, and support
topic: Build
description: A short note on code review, endurance, and joining someone near the finish line.
date: 2018-10-08
draft: false
---

Writing most software is not hard, but it certainly can be tough. Running a marathon is not hard either: put in enough hours and almost anyone can do it. But for most people it is really, really tough.

Senior engineers doing late-stage reviews should be familiar with the feeling: A junior just pushed through an enduring effort and assigned you as a reviewer. Of course they under-estimated. Of course scope crept. But now "It's done™”[^1] - checks are green and we’re ready to roll; the last thing standing between them and production is your review...

Your job is to ensure quality, correctness and provide good feedback. However - _how_ you leave feedback can make a huge difference. 

There are two valid[^2] reasons for leaving review comments:
1. You found a bug or noticed an old caveat the engineer didn’t think about.
2. You spot a learning opportunity.

Even the most well-intended feedback can be received as nit or you picking on the author. Effective communication hinges on both sender and receiver. Too many people emphasize the sender. The words you choose are merely one ingredient in the mix, and the interpretation of those words can differ greatly based on context, situation, the receiver's past experiences, your interpersonal relationship, and probably a hundred more factors.

Writing software is not hard, communication is.

And like the tired marathon runner, the last thing the author need now is someone picking on them. That's bad for your relationship, for morale and momentum. Ultimately it may affect the product or code negatively.

What if, instead of throwing comments at someone after 35 kilometers of running, you joined them? This will strengthen your relationship, boost morale and help them keep momentum.

That means not listing out all the ways they are wrong, but actually helping them? Do you see an improvement? Branch out and submit a PR where you implement it yourself. This changes the situation from a *comment* to a *contribution*.

A slight mental shift can do all the difference. Imagine Github changing their PR format from a “Comment and review” model to a “Join” or “Show support” model? Would have been silly if they actually did this, but i illustrates my point.

Joining can even be useful when you don’t find anything in particular to comment on or improve. You don’t always have to pick up the pace and start running yourself: There can be enormous value in cycling up next to them, spending a few minutes, and showing your support.

Meet the author at the point where they have the least energy left and show your support. Just like my late uncle did at the end of my first marathon: He saw I was struggling and didn’t say much, but the simple act of having him on a bike next to me helped me reach the finish line.

### Footnotes

[^1]: From a product perspective this is obviously the wrong way to look about it; we all know that the act of merging [code] is never the finish line; if anything, it’s the starting point. Doesn’t always feel like this though.

[^2]: There’s a third (invalid) reason for leaving a review comment: Picking on things you find odd or think could be changed purely based on personal preferences: Nitpicking in it’s purest form. I must admit that sometimes allow myself to do this. However, I use this too as an communication tool: Communicating how *I think* about certain things. This gives the author a glimpse inside my head. Although, I always stress that I’m conscious about it: “Feel free dismiss this nitpick, but (...)”, “Nitpick: (...)” etc. — based on how well I know the author. I never block merging or raise any alarms if these comments are left unresolved.
