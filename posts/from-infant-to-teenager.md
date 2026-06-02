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
means cheap and clean electricity. But our wealth was built on tons of oil. And
the sun doesn’t shine for six months at a time.

So why would someone from one of the coldest countries, with the most snow, the
longest winters, and the shortest days, want to start a solar company? Here's
three reasons why:

1. Norway has capital
2. Not risky to fail
3. Good roof data!

We figured Norway's excess should be used to drive environmental change. The
idea was: If we can make solar cheap and efficient in Norway, we can make it
_anywhere_.

<figure>
  <img src="/assets/from-infant-to-teenager/winter-sun.jpg" alt="Low winter sun over snow-covered trees in Norway" loading="lazy">
  <figcaption>Norwegian solar starts from a strange place: short winter days, snow, and still enough sun to make the question worth asking.</figcaption>
</figure>

## How it started

On a snowy day in 2016, two Andreases and a Simen sat around a kitchen table[^1]
with an idea.

They'd been watching solar panel prices drop steadily over the last decade.
Something clicked. They created a landing page, wrote a press release, and set
up an Excel sheet with the initial assumption:

> People want easy and affordable solar

Within the first three days, they had 532 interested customers. BANG. Initial
assumptions validated.

<figure>
  <img src="/assets/from-infant-to-teenager/startup-rollercoaster.jpg" alt="Otovo team members in an office with the text warning startup rollercoaster ahead" loading="lazy">
  <figcaption>Fast, messy, and a little ridiculous.</figcaption>
</figure>

I joined them a couple of months later in February 2016. First as a contractor,
then full-time later that summer. Since, we've been racing to make clean and
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

**The storefront** ([otovo.no](https://otovo.no)): You type in your address and
get to see your solar potential. We tell you exactly how many panels fit on your
roof, what we think is the optimal number, and the total cost – with different
financing options.[^2]

**The installer platform**: Independent electricians and installers sign up, set
their own prices, and define their service area. They're incentivized to offer
competitive pricing because they're visible to customers on our platform; we
bring the customers (marketing/brand), they get to focus on what they do best -
installing.

Here's the key difference between us and most other solar providers: **The price
we show the customer a few seconds after they type in their address is the
actual price they will pay.** Not an estimate. Not a guestimate. The real price,
from real installers, with real labor costs.

That's our secret sauce. That's what makes Otovo work.

<figure>
  <img src="/assets/from-infant-to-teenager/storefront-platform.jpg" alt="Presentation slide comparing Otovo's storefront and solar platform products" loading="lazy">
  <figcaption>A customer-facing storefront connected to the operational installer platform behind it.</figcaption>
</figure>

## The expansion problem

But here's the thing: even if we installed solar panels on every single roof in
Norway, it wouldn't make a dent in the world's energy problems[^4].

So in mid-2017, we started planning for expansion. We looked east toward Sweden
– our big brother – and told ourselves: let's be up and running in _February_.
The solar season would start soon after, and we could not afford to spend the
first useful months still getting ready.

At that point, we had five full-time developers and one product lead. The
question was urgent: How do we expand our platform to other markets without
rebuilding the company every time?

We had a React frontend and a Django backend. We also had a lot of Norwegian
assumptions baked into both: language, currency, roof data, subsidies, installer
workflows, and what a "normal" customer journey looked like.

The problem was not just translation. Translation is the visible part. The
harder question was where market-specific logic should live, and how much of it
the platform should be designed to absorb.

## Internationalization & localization

I like to think about this problem using a toy analogy. You know those toys for
toddlers with holes of different shapes? The box is our system. It's our
responsibility to design and build the box properly – to create space for pegs
of different shapes and sizes — to be prepared for whatver shapes the different
markets might throw at us.

<figure class="grid grid-cols-2 gap-x-10">
    <img src="/assets/from-infant-to-teenager/shape-box.jpg" alt="Shape sorter" loading="lazy">
    <img src="/assets/from-infant-to-teenager/kid-blocks.gif" alt="A toddler trying to fit toy blocks into a shape sorter" loading="lazy">
    <figcaption class="col-span-2">The box is our system. Fitting these pegs into the wholes is critical. Internationalization is designing the sorter; localization is dealing with the shapes each market hands you. Sometimes the easiest thing is, admittedly, to cheat a little.</figcaption>
</figure>

That's **internationalization (i18n)**: the upfront design and architecture work
that makes your system flexible enough to handle different markets.

**Localization** is the actual pegs – the market-specific content, features, and
configurations that fit into that box. Even between Norway and Sweden, the pegs
were not identical.

**Some differences were visible in the UI:**

- Language, number, date, time, currency, name, and address formats
- Images and illustrations (avoid flags in images!)
- Legal documents, product sheets, PDFs, reports, and metrics

**Some differences lived closer to the physical product and the home:**

- Roof data, map providers, WMS layers, and address lookup quality
- Grid types, grid providers, meter numbers, and installation constraints
- Equipment, including panels, inverters, and product availability
- Product variations, subsidies, project flow, documentation, and permits

**And some differences lived in the business model:**

- Installer availability, certifications, margins, and cost models
- Loan partners, financing options, tax, invoicing, and local payment processes
- Edge cases that sound absurd until they are real, like churches in France

This list is not exhaustive. It also is not a checklist of everything that
needed to become configurable on day one. To get going in Sweden, three things
stood out:

- address formats and WMS,
- roof data and providers
- and installers.

Those were either core to the customer experience or had a long lead time. That
became the useful question to ask early: what is core, and what will take time
no matter when you start? Start there.

Everything else needed a lighter touch. Some things could be handled manually at
first. Some only became important after we had real customers in a market. If
you ignore i18n, every new market becomes a square peg and your codebase becomes
the toddler. But if you try to predict every possible variation upfront, you
build a platform for imaginary countries instead of learning from real ones.

The useful move was to draw a boundary: keep the core platform shared, make the
market-specific parts explicit, and let real launches teach us where the
boundary should move.

## The pattern that worked

The slide version eventually became simpler than the architecture diagrams:
expand front to back, then improve back to front.

<figure class="grid grid-cols-2 gap-x-10">
  <img src="/assets/from-infant-to-teenager/front-to-back.jpg" alt="Presentation slide showing the expansion flow from landing page to contract signing" loading="lazy">
  <img src="/assets/from-infant-to-teenager/improving-back-to-front.jpg" alt="Presentation slide showing the improvement flow from contract signing to landing page" loading="lazy">
  <figcaption class="col-span-2">For a new market, start with what the customer must be able to do. For larger improvements and refactors, start with the non-visible platform work and move back toward the customer experience.</figcaption>
</figure>

**Expanding front to back** meant starting with the customer path: landing page,
roof drawing, calculation, offer, and contract signing. We localized enough of
that path to make the market real, then worked backwards into the operational
systems needed to support it.

The important part was that we did not wait until the whole journey was perfect.
First, let customers sign up. Then ship the next step that makes sense for the
customer journey. Then the next. Shipping early gave us time to learn from the
parts that matter long before the full platform was ready: marketing, copy,
positioning, demand, and where people got confused.

Sweden also forced us to add product, not just translate it. Sweden's roof data
was not good enough for our automatic pricing engine, so right after the landing
page we introduced a roof drawer where customers could mark the relevant roof
surface themselves. That was a market-specific need, but it was not custom code
only for that market. When done right, this kind of launch work improves the
shared platform: Norwegian customers without good roof data would use the same
flow too.

<figure>
  <img src="/assets/from-infant-to-teenager/add-roof-drawer.jpg" alt="Presentation slide showing the new extra roof drawing step" loading="lazy">
  <figcaption>New market sometimes means new features and flows.</figcaption>
</figure>

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
over-engineer everything upfront[^3]. Routes, messages, and API endpoints are
all configured to handle the specific market and locale you're operating in.

**On the backend**: Here's an example of the kind of code we had to unlearn.
When we first expanded, we had code like this:

```python
// location/enums.py
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

The problem is not the fast pragmatic solution itself. The problem is the hidden
assumption: country is being inferred from currency, and the failure mode is
silent. You do not find it when planning the next launch. You find it when
someone reports weird behavior, usually at the worst possible time. These small
assumptions compound. Slowly, they eat the system from the inside, and you end
up treading water.

The pattern that stuck looked more like this:

```python
# priceengine/vat.py
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
        case _:
            raise ValueError(
                f'VAT rate logic not implemented for country {address.country}'
            )
```

It is not glamorous code, but it has the right shape. The variation is explicit.
The country is an enum, not a side effect of currency. Each market can own its
rules, and the shared interface forces us to name the things VAT actually
depends on: time, location, purchase model, hardware, building age, customer
type, and sometimes even the exact coordinates of the house. Just as important:
unsupported countries fail loudly. If we launch a new market without VAT logic,
we get an explicit error telling us what is missing, not a plausible-looking
answer from the wrong country.

It is also extendable in the right direction: if a new market has some weird tax
rule, we add the optional argument that rule actually needs, pass it through the
shared interface, and let the countries that care about it use it, without
changing the logic for the existing markets.

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
future feature early. The point is to avoid making today's shortcut tomorrow's
hidden dependency. That balance is hard to hold in ordinary product work, where
meetings, deadlines, and launch pressure make every shortcut feel reasonable.

When you are a five-person team expanding to one new country, you can get away
with that. When you are expanding across Europe, shortcuts compound. The work we
did on i18n meant Sweden informed France, France informed Spain, and Spain
informed Germany. Each launch still had real work, but it did not require
starting over. We created leverage, and each new market became a little bit
easier than the last.

The hard part was not just technical architecture. It was organizational
thinking: making sure product, frontend, backend, operations, and local market
teams shared a mental model for what could vary, what should stay common, and
where learning from one market should become platform capability for the next.

Sharing and reuse were critical. We tried hard to avoid forks: one storefront
server handling all locales, one platform, one set of concepts, with
market-specific behavior made explicit where it needed to be. Sometimes you
solve that with code. Sometimes you solve it with ownership: local teams who
know their market and have clear responsibility for the parts that should vary.

## Closing

I'm not here to claim we got it all right. We didn't. We're still learning.

But I will say this: if you're building something with global ambitions, start
separating shared product logic from market-specific assumptions earlier than
feels strictly necessary. It is one of those design decisions that gets
exponentially harder the longer you wait.

We started in one of the coldest, darkest, least sunny countries in Europe.
Against the odds, we're now driving environmental change across the continent.
And a big part of how we're able to do that is because we made some hard
decisions early on – decisions that let us expand without tearing everything
down and starting over.

<figure>
  <img src="/assets/from-infant-to-teenager/clean-local-energy.jpg" alt="Residential neighborhood with solar panels on a blue house roof under the Otovo logo" loading="lazy">
  <figcaption>Final slide. The original pitch was simple and still holds up: clean, local energy in ordinary homes.</figcaption>
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

[^4]: And frankly, we would never break even in such a small market as Norway.
