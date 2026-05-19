---
title: A short open source love story on a Friday evening
topic: Build
description: A tiny note about trying to contribute to Nextra and discovering the fix was already there.
date: 2022-01-14
draft: true
---

> Draft imported from iA Writer. Source file:
> `/Users/rix1/Library/CloudStorage/Dropbox/Privat/Writing (IA Writer)/A short open source love story on a Friday evening.md`.

With COVID running rampant, I decided to spend my Friday evening in front of my
computer. I wanted to test out `Nextra@alpha`, and after some `pnpm` hurdles, I
got everything working.

Everything looked great. Seriously, the new theme was excellent. However, I
discovered the theme switcher was a bit off. I traced it down to a `.menu` CSS
class and figured: what the hell, I might as well open a PR. This is how open
source works, right?

So I cracked my fingers, put on some Drum & Bass, and cloned the repo.

_Entering the Matrix._

One minute and 28 seconds later, I discovered the CSS class issue was already
fixed upstream by @shu a couple of days earlier.

_Exiting the Matrix._

So instead of actually fixing anything, I ended up writing this post.

Just wanted to say thanks for making awesome stuff and fixing things faster than
I can clone a repo.

## Footnote

The `pnpm` command seriously puts my muscle memory to the ultimate test. I have
now aliased `pnpnm`, `npmp`, `npnmp`, `pmpm`, and `[mpnp` to simply `pp`.
