---
title: From infant to teenager – building a multi-market solar platform
topic: Product Engineering
description: Reflections on how we scaled Otovo from a single market to across Europe – and the technical and organizational challenges that came with it.
date: 2019-06-07
---

> [!NOTE]
> This is a written version of a talk I held at
> [Phrase Conf 2019](https://phrase.com/blog/posts/phraseapp-hosts-first-localization-conference-of-its-kind-in-germany/).
> You can find the slide deck
> [here](https://www.dropbox.com/scl/fi/lty172s7aq3rhr191two3/From-infrant-to-teenager-Phrase-talk-2019.pdf?rlkey=uj8hfg4atbly7gfxn6xxnvipg&st=zvae8nmr&dl=0).

I'm a person with some internal conflict: I come from Norway, one of the
wealthiest countries in the world. We have 98% clean hydroelectric power, which
means cheap and clean electricity.

However, our wealth was built on tons of oil. Being part of the European energy
mix, our prices aren’t _that different_ from the rest of Europe. And the sun
doesn’t shine for six months at a time.

So why would someone from one of the coldest countries, with the most snow, the
longest winters, and the shortest days, want to start a solar company?

<figure>
  <img src="/assets/from-infant-to-teenager/winter-sun.jpg" alt="Low winter sun over snow-covered trees in Norway" loading="lazy">
  <figcaption>Norwegian solar starts from a strange place: short winter days, snow, and still enough sun to make the question worth asking.</figcaption>
</figure>

## How it started

On a snowy day in 2016, two Andreases and a Simen sat around a kitchen table[^1]
with an idea.

They'd been watching solar panel prices drop steadily over the last decade.
Something clicked. They created a landing page, wrote a press release, and set
up an Excel sheet.

> Clean and local energy in every home.

Within the first three days, they had 532 interested customers. BANG 💥. That
was the shot from the starting pistol.

<figure>
  <img src="/assets/from-infant-to-teenager/startup-rollercoaster.jpg" alt="Otovo team members in an office with the text warning startup rollercoaster ahead" loading="lazy">
  <figcaption>The early Otovo years had exactly the energy the slide promised: fast, messy, and a little ridiculous.</figcaption>
</figure>

I joined them a couple of months later in February 2016 as a contractor, then
full-time that summer. Since then, we've been racing to make clean and
affordable solar available to as many residential homes as possible across
Europe.

## The Otovo model

To understand why we had to think differently about expansion, you need to
understand how Otovo actually works.

Our mission is simple: to be the easiest and most affordable way to go solar. We
realized the best way to accomplish this was by controlling the entire journey –
from the moment you first wonder if solar makes sense for you, through the sales
process, and all the way through installation. Installing solar is complex, and
we position ourselves to make it easy by connecting the actors involved:
customers, installers, electricians, grid owners, and financing partners.

<figure>
  <img src="/assets/from-infant-to-teenager/otovo-ecosystem.jpg" alt="Presentation slide placing Otovo between customers, tradesmen, manufacturers, grid owners, politics, financing, marketing, and environmental concerns" loading="lazy">
  <figcaption>Otovo is positioned in the middle of end customers, tradesmen, manufacturers, grid owners, financing, marketing, politics, and the broader environmental push.</figcaption>
</figure>

That's why we built two interconnected products:

**The storefront** (`otovo.no`): You type in your address and get to see your
solar potential. We tell you exactly how many panels fit on your roof, what we
think is the optimal number, and the total cost – with payment options.[^2]

**The installer platform**: Independent electricians and installers sign up, set
their own prices, and define their service area. They're incentivized to offer
competitive pricing because they're visible to customers on our platform.

Here's the key difference between us and most other solar providers: **The price
we show the customer a few seconds after they type in their address is the
actual price they will pay.** Not an estimate. Not a guestimate. The real price,
from real installers, with real labor costs.

That's our secret sauce. That's what makes Otovo work.

<figure>
  <img src="/assets/from-infant-to-teenager/storefront-platform.jpg" alt="Presentation slide comparing Otovo's storefront and solar platform products" loading="lazy">
  <figcaption>The two-product model: a customer-facing storefront connected to the operational platform behind it.</figcaption>
</figure>

## The expansion problem

But here's the thing: even if we installed solar panels on every single roof in
Norway, it wouldn't make a dent in the world's energy problems.

So in mid-2017, we started planning for expansion. We looked east toward Sweden
– our big brother – and told ourselves: we're starting there in February. The
solar season would start soon after, and we could not afford to spend the first
useful months still getting ready.

At that point, we had five full-time developers and one product lead. The
question was urgent: how do we expand our platform to other markets without
rebuilding the company every time?

We had a React frontend and a Django backend. We also had a lot of Norwegian
assumptions baked into both: language, currency, roof data, subsidies, installer
workflows, and what a "normal" customer journey looked like.

The problem was not just translation. Translation is the visible part. The
harder question was where market-specific logic should live, and how much of it
the platform should be designed to absorb.

## Internationalization vs localization

I like to think about this problem using a toy analogy. You know those toys for
toddlers with holes of different shapes? The box is our system. It's our
responsibility to design and build the box properly – to create space for pegs
of different shapes and sizes.

<figure>
  <img src="/assets/from-infant-to-teenager/kid-blocks.gif" alt="A toddler trying to fit toy blocks into a shape sorter" loading="lazy">
  <figcaption>Internationalization is designing the sorter; localization is dealing with the shapes each market hands you. Sometimes the easiest thing is, admittedly, to cheat a little.</figcaption>
</figure>

That's **internationalization (i18n)**: the upfront design and architecture work
that makes your system flexible enough to handle different markets.

**Localization** is the actual pegs – the market-specific content, features, and
configurations that fit into that box. Even between Norway and Sweden, the pegs
were not identical:

- Different tax systems and VAT rates
- Different payment methods and financing options
- Language and regional variations
- Installer licensing and certification requirements
- Different roof data availability and accuracy
- Different solar incentives and subsidies
- Different electrical grid regulations
- Different installation labor costs

This list is not exhaustive. It also is not a checklist of everything that
needed to become configurable on day one. Some things were crucial to the
customer journey. Some could be handled manually at first. Some only became
important after we had real customers in a market.

That distinction mattered. If you ignore i18n, every new market becomes a square
peg and your codebase becomes the toddler. But if you try to predict every
possible variation upfront, you build a platform for imaginary countries instead
of learning from real ones.

The useful move was to draw a boundary: keep the core platform shared, make the
market-specific parts explicit, and accept that we would learn some of the
boundaries by shipping.

## The pattern that worked

The slide version eventually became simpler than the architecture diagrams:
expand front to back, then improve back to front.

<figure>
  <img src="/assets/from-infant-to-teenager/front-to-back.jpg" alt="Presentation slide showing the expansion flow from landing page to contract signing" loading="lazy">
  <figcaption>For a new market, the first question was not “what can the platform support?” It was “what must the customer be able to do?”</figcaption>
</figure>

**Expanding front to back** meant starting with the customer path: landing page,
roof drawing, calculation, offer, and contract signing. We localized enough of
that path to make the market real, then worked backwards into the operational
systems needed to support it.

**Improving back to front** meant taking what we learned from that launch and
turning it into better platform capabilities. The next market should start from
a better baseline, not from a copy-paste fork of the previous one.

This was the practical version of our i18n strategy. Not "make everything
configurable." Not "hard-code Sweden and hope France looks similar." Find the
market's critical path, ship it, then move the learning into the shared system.

## How that looked in practice

Part of me wants to tell you the polished version of how we solved this:
architectural foresight, elegant abstractions, a clean migration from infant to
teenager.

But the truth is less tidy. Things were messy. We made mistakes. We refactored.
We discovered problems we did not know how to name until a second or third
market forced the issue.

**On the frontend**: We use React Intl for managing translations, and Phrase for
content management. We went for the pragmatic solution rather than trying to
over-engineer everything upfront.[^3] Routes, messages, and API endpoints are
all configured to handle the specific market and locale you're operating in.

**On the backend**: Here's an example of the kind of code we had to unlearn.
When we first expanded, we had code like this:

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

This is what you write when you're thinking about a single market and quickly
hacking to support one new market. It's tightly coupled to specific currencies.
It breaks down immediately when you add a third country with the same currency.

The pattern that stuck looked more like this:

```python
# cloud/priceengine/vat.py
def get_vat(
    *,
    address,
    vat_date,
    main_hardware_types,
    purchase_model,
    system_power,
    building_age,
    is_organization_customer=False,
):
    match address.country:
        case Country.DE:
            return get_de_vat(
                purchase_model=purchase_model,
                vat_date=vat_date,
            )
        case Country.PL:
            return get_pl_vat(
                purchase_model=purchase_model,
                is_organization_customer=is_organization_customer,
            )
        case Country.PT:
            return get_pt_vat(
                vat_date=vat_date,
                purchase_model=purchase_model,
                main_hardware_types=main_hardware_types,
                address=address,
            )
```

It is not glamorous code, but it has the right shape. The variation is explicit.
The country is not inferred from a side effect like currency. Each market can
own its rules, and the shared interface forces us to name the things VAT
actually depends on: time, location, purchase model, hardware, building age,
customer type, and sometimes even the exact coordinates of the house.

The approach that worked was prioritizing what was core, what was
market-specific, and what had long lead times. We shipped early, got customers,
and let feedback tell us which assumptions were real.

For a new market, the biggest change was usually the customer sales flow.
Everything else – installer onboarding, roof analysis, payment processing – we
tried to reuse as much as possible. We gathered the data we needed, localized
the specific parts that did not fit, and shipped when we could provide a
coherent customer experience.

## What this taught us

There is a principle in software that says "YAGNI – You Ain't Gonna Need It." Do
not optimize for something you think might happen.

Internationalization is the awkward exception. The point is not to build every
future feature early. The point is to avoid hiding country-specific assumptions
so deeply in your product that every future market has to negotiate with them.

When you are a five-person team expanding to one new country, you can get away
with shortcuts. When you are expanding across Europe, those shortcuts compound.
The work we did on i18n meant Sweden informed France, France informed Spain, and
Spain informed Germany. Each launch still had real work, but it did not require
starting over. We created leverage, and each new market became a little bit
easier than the last.

The hard part was not just technical architecture. It was organizational
thinking: making sure product, frontend, backend, operations, and local market
teams shared a mental model for what could vary, what should stay common, what
was currently hard-coded but could be fixed when needed, and where learning from
one market should become platform capability for the next. As we grew, that also
meant giving local and content teams ways to change the product without passing
every improvement through engineering.

Sharing and reuse were critical. We tried hard to avoid forks: one storefront
server handling all locales, one platform, one set of concepts, with
market-specific behavior made explicit where it needed to be. The danger is not
one special case. The danger is special cases multiplying across products,
teams, and 13 markets until nobody can understand the whole thing anymore.
Sometimes you solve that with code. Sometimes you solve it with ownership: local
teams who know their market and have clear responsibility for the parts that
should vary.

## Closing

I'm not here to claim we got it all right. We didn't. We're still learning.

But I will say this: if you're building something with global ambitions, start
separating shared product logic from market-specific assumptions earlier than
feels strictly necessary. It is one of those design decisions that gets
exponentially harder the longer you wait.

We started in one of the coldest, darkest, least sunny countries in Europe.
Against the odds, we're now driving environmental change across the continent.
And a big part of how we're able to do that is because we made some hard
architectural decisions early on – decisions that let us expand without tearing
everything down and starting over.

<figure>
  <img src="/assets/from-infant-to-teenager/clean-local-energy.jpg" alt="Residential neighborhood with solar panels on a blue house roof under the Otovo logo" loading="lazy">
  <figcaption>The original pitch was simple and still holds up: clean, local energy in ordinary homes.</figcaption>
</figure>

If you want to do something meaningful and useful, Otovo is hiring. We're
remote-friendly, but we'll also help you relocate if you want to.

That's what I wanted to share with you today.

[^1]: I was told start-ups are conceived in garages — however, in Norway, it's
    too cold to stay outside in the garage. So we start tech companies in
    kitchens instead.

[^2]: At the time, a typical checkout was roughly €7,500–€15,000, which made
    trust in the price especially important.

[^3]: The main simplification was tying language tightly to market/locale. Not
    perfect, but pragmatic for the team and phase we were in.
