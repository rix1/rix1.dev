---
title: Rix1-builds is dead, long live Lume
topic: Build
description: In which I port my personal website, again.
date: 2024-01-09
draft: false
---


TL;DR: I just ported my site from Next.js/[ContentLayer](https://contentlayer.dev/) setup to [Lume](https://lume.land/).

I guess it’s a running joke that developers have to rebuild their site every two years, but right now I was tired of running into bugs and quirks with ContentLayer. In addition, using Next.js for something as simple as a site with largely static content felt unnecessary. The popular JS-frameworks are great for building complex user interfaces that depend on a lot of local state or presenting complex remote state. A personal blog has neither.

In a [former post](/posts/hello-rix1-builds/) I documented my Turborepo setup for sharing code, config setup across different projects. After two years, this haven’t really reaped the benefits I was hoping for. In some cases it even felt limiting: My focus very quickly went from *“let’s play around with technology to scratch an itch”* to *“first, I just have to do some upgrades and/or refactor because what I’m trying to do doesn’t fit into my existing monorepo structure”*. This is yak shaving at its “finest”, considering I’m only doing this for me 🤦‍♂️

For creative work to flourish, you have to remove all unnecessary distractions. A new idea is like a butterfly — one sudden move (or distraction) and it’s gone. Starting my favorite pastime with what is essentially grunt work/maintenance is downright stupid. Ideas and momentum get lost in the process of doing busywork for the sake of it.

So I’m back to having this site being it’s [own repository](https://github.com/rix1/rix1.dev), and the page is now built by Lume, a pretty neat static site generator. Where Jekyll feels like an old relic, Lume meets me where I am today.