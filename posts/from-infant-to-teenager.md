---
title: From infant to teenager – building a multi-market solar platform
topic: Product Engineering
description: Reflections on how we scaled Otovo from a single market to across Europe – and the technical and organizational challenges that came with it.
date: 2019-06-07
---

> This is a written version of a talk I held at [Phrase Conf 2019](https://phrase.com/blog/posts/phraseapp-hosts-first-localization-conference-of-its-kind-in-germany/). You can find the slide deck [here](https://www.dropbox.com/scl/fi/lty172s7aq3rhr191two3/From-infrant-to-teenager-Phrase-talk-2019.pdf?rlkey=uj8hfg4atbly7gfxn6xxnvipg&st=zvae8nmr&dl=0).

I'm a fairly conflicted guy. I come from Norway, one of the richest countries in the world with the highest standard of living. We have 98% clean hydroelectric power, which means electricity is already cheap and clean. We don't get much sun. And our wealth? It was built on tons of oil.

Did we work hard to achieve this standard? Not really. Dinosaurs, the Earth, and time did most of the heavy lifting.

So why would someone from one of the coldest countries, with the most snow, the longest winters, and the shortest days, want to start a solar company? That's the paradox I want to explore today.

## How it started

On a snowy day in 2016, two Andreases and a Simen sat around a kitchen table with an idea. (In Norway, it's too cold to stay outside in the garage, so tech companies are born over hot coffee in kitchens.)

They'd been watching solar panel prices drop steadily. Donald Trump had just been elected. Something clicked. They created a landing page, wrote a press release, and set up an Excel sheet.

Within the first three days, they had 532 interested customers.

BANG. That was the shot from the starting pistol.

I joined them a couple of months later in February 2016 as a contractor, then full-time that summer. Since then, we've been racing to make clean and affordable solar available to as many customers as possible across Europe.

## The Otovo model

To understand why we had to think differently about expansion, you need to understand how Otovo actually works.

Our mission is simple: to be the easiest and most affordable way to go solar. We realized the best way to accomplish this was by controlling the entire journey – from the moment you first wonder if solar makes sense for you, through the sales process, and all the way through installation. Installing solar is complex, and we position ourselves to make it easy by creating connections between all the actors: customers, installers, electricians, and installers.

That's why we built two interconnected products:

**The storefront** (`otovo.no`): You type in your address and get to see your solar potential. We tell you exactly how many panels fit on your roof, what we think is the optimal number, and the total cost – with payment options. The checkout process is straightforward, typically between €7,500–€15,000.

**The installer platform**: Independent electricians and installers sign up, set their own prices, and define their service area. They're incentivized to offer competitive pricing because they're visible to customers on our platform.

Here's the key difference between us and most other solar providers: **The price we show the customer a few seconds after they type in their address is the actual price they will pay.** Not an estimate. Not a guestimate. The real price, from real installers, with real labor costs.

That's our secret sauce. That's what makes Otovo work.

## The expansion problem

But here's the thing: even if we installed solar panels on every single roof in Norway, it wouldn't make a dent in the world's energy problems.

So in mid-2017, we started planning for expansion. We looked east toward Sweden – our big brother – and told ourselves: we're starting there in February. Summer is almost here, and we can't afford to lose daylight. We need to hit the ground running.

At that point, we had five full-time developers and one product lead. The question was urgent: how do we expand our platform to other markets?

We had a React frontend and a Django backend. We had built our system optimized for a single country. Now we needed to make it work for multiple countries with completely different regulations, tax systems, electricity markets, installer networks, and customer expectations.

As any good agile team would do, we made some decisions.

## Internationalization vs localization

I like to think about this problem using a toy analogy. You know those toys for toddlers with holes of different shapes? The box is our system. It's our responsibility to design and build the box properly – to create space for pegs of different shapes and sizes.

That's **internationalization (i18n)**: the upfront design and architecture work that makes your system flexible enough to handle different markets.

**Localization** is the actual pegs – the market-specific content, features, and configurations that fit into that box. Here are some of the differences we encountered between Norway and Sweden alone:

- Different tax systems and VAT rates
- Different payment methods and financing options
- Language and regional variations
- Installer licensing and certification requirements
- Different roof data availability and accuracy
- Different solar incentives and subsidies
- Different electrical grid regulations
- Different installation labor costs

This list isn't exhaustive. There's a lot to figure out. But some things matter more than others and have longer lead times than others.

If you don't design your i18n correctly upfront, you end up trying to fit a square peg into a round hole. And there's no way around it.

We could have ignored this problem. We could have copied the entire codebase and customized it for Sweden. Maybe that would have worked in the short term. But we were thinking about expansion across Europe – multiple countries, different teams, different requirements. At some point, the cost of maintaining separate codebases would become unsustainable.

So we made the harder choice upfront: design a system that could accommodate different markets.

## How we actually did it

Part of me wants to tell you the polished version of how we solved this. The clean narrative about architectural foresight and elegant design patterns.

But here's the truth: it's been messy. Things still are messy. We've made mistakes. We've had to refactor. We've discovered problems we didn't anticipate.

**On the frontend**: We use React Intl for managing translations, and Phrase for content management. We went for the pragmatic solution rather than trying to over-engineer everything upfront. Routes, messages, and API endpoints are all configured for the specific market and locale you're operating in.

The tradeoff we made: language is tightly tied to market/locale. That's a simplification, but it was the right call early on given our resources.

**On the backend**: Here's an example of the kind of code we had to unlearn. When we first expanded, we had code like this:

```python
// cloud/location/enums.py
@classmethod
def from_related_currency(cls, currency):
    if str(currency) == 'NOK':
        return cls.NO
    if str(currency) == 'SEK':
        return cls.SE
    if str(currency) == 'EUR':
        return cls.FR  # NOPE NOPE NOPE
```

This is what you write when you're thinking about a single market and quickly hacking to support one new market. It's tightly coupled to specific currencies. It breaks down immediately when you add a third country with the same currency.

That's the kind of thinking we had to unlearn.

**The approach that worked**: We prioritized identifying what was core and what had long lead times. We worked iteratively and shipped early and often. We used the landing page approach initially (just like we did in 2016 with Unbounce), got customers, and let their feedback guide our learning.

For a new market, the biggest change is usually the customer sales flow. Everything else – installer onboarding, roof analysis, payment processing – we tried to reuse as much as possible. We'd gather the necessary data, iterate on the specific features that didn't fit, and ship when we could provide a good customer experience.

## Why expansion matters

We're makers. We love making things. We geek out over clean code, well-documented libraries, thoughtfully designed systems. Most users will never notice the difference between a system built on solid architecture and one that's been hacked together – but we do.

That's why thinking in systems and structures matters. It's not just about purity. It's about sustainability.

When you're a five-person team expanding to one new market, you can probably get away with shortcuts. When you're expanding across five countries with different teams, different time zones, different requirements – those shortcuts compound into monsters.

The work we did on i18n upfront meant that the next market wasn't 10x harder than the first one. It meant our Sweden expansion informed our approach to France, which informed Spain, which informed Germany.

## The principle

There's a principle in software that says "YAGNI – You Ain't Gonna Need It." Don't optimize for something you think might happen.

But internationalization is different. If you wait until you actually need to support a second market to start thinking about i18n, you're already too late. The decision-making is backward. You've already baked in assumptions throughout your system.

The hard part isn't just the technical architecture. It's the organizational thinking. It's making sure your product team understands what can vary by market and what shouldn't. It's making sure your backend team has a mental model for how data flows through the system. It's making sure your frontend team understands the constraints.

## The pattern that worked

What we discovered is this: if you manage to get up to speed in one country, you can repeat that process in the next. We started with Norway. We iterated on Sweden. By the time we expanded to France, Germany, Spain, and beyond, we had a working pipeline.

We work in a forward-backward fashion now. You ship something early, learn from customers, iterate, and repeat a successful approach. Then you apply that same approach to the next market. Step by step, until you have full support for that market.

It's not perfect, but it's sustainable. And importantly, it doesn't require tripling your team every time you expand.

## A note on organization

As we grew, we realized that feature improvements and content management needed to be solved differently. You can't just pass everything through the engineers. We had to build processes and teams that could handle the complexity of managing a product across multiple markets at scale.

That's a different kind of challenge, but it's one we had to solve as we scaled.

## Closing

I'm not here to claim we got it all right. We didn't. We're still learning.

But I will say this: if you're building something with global ambitions, start thinking about i18n early. It's one of those design decisions that gets exponentially harder the longer you wait. And unlike many "best practices" in software, this is one where the early effort actually pays dividends.

We started in one of the coldest, darkest, least sunny countries in Europe. Against the odds, we're now driving environmental change across the continent. And a big part of how we're able to do that is because we made some hard architectural decisions early on – decisions that let us expand without tearing everything down and starting over.

If you want to do something meaningful and useful, Otovo is hiring. We're remote-friendly, but we'll also help you relocate if you want to.

That's what I wanted to share with you today.
