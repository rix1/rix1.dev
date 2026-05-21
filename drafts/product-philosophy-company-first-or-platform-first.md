---
title: Company-first or platform-first?
topic: Product
description: A product architecture question about whether to optimize for the default company or for every tenant equally.
date: 2022-02-08
draft: true
---

> [!NOTE] Internal notes
> - Anonymize company and tenant language enough that the post stands on its own.
> - Decide whether the answer is "company-first until proven otherwise" or a
>   more balanced tradeoff piece.
> - Add a concrete architecture example: URL structure, config, or data model.
> - Recommendation: Turn the post into a decision memo for teams building
>   multi-tenant products: the reader value is a vocabulary for spotting when
>   "just support one more tenant" has become an architecture strategy by accident.

> Draft imported from Notion. Needs anonymization, a less company-specific
> setup, and a stronger conclusion.

A late-night existential product question popped up:

> Are we building software for one company first and adapting it to partners on
> demand, or are we building software for any company that wants to use the
> platform?

In a sense, this translates to: are the default company's customers first in
line, while other customers should be considered second-class, second in line,
or an afterthought?

There might not be a universally right answer, but the distinction matters. It
has an impact on product decisions, architecture, URL structure, data modeling,
support, operations, and how the team thinks about future work.

Take a sales flow as an example.

Are we building:

1. A sales flow that is company-first and adapted for partners?
2. Sales tooling that is agnostic to anyone selling the same underlying product?

The first option means the default case is implicit. The main company is assumed
unless something else is specified.

```txt
/it-ch/solar/...
/it-ch/santander/solar/...
```

The second option means every company is treated as one explicit instance of the
same product.

```txt
/it-ch/otovo/solar/...
/it-ch/santander/solar/...
```

This may look like a tiny routing decision, but it expresses a much deeper
product philosophy.

If the default company is implicit, the product can move faster for the most
important case. The cost is that exceptions may accumulate over time.

If every tenant is explicit, the platform model becomes cleaner. The cost is
that the core product may become more abstract than the actual business needs
right now.

This is something we had been feeling for a while, but hadn't been able to
articulate clearly. Naming the question was useful by itself.

## TODO

- Decide whether to keep concrete URL examples or make them fictional.
- Add tradeoffs: speed, complexity, partner enablement, operational support.
- End with a practical decision framework.
