---
title: Why we ditched our BFF and went for Next.js
topic: Tech
description: Why Otovo replaced a custom Backend For Frontend with Next.js.
date: 2020-07-07
---

At Otovo, we’ve been using the last couple of home office months to do some
technical improvements: Tailwind, Django 3.0, Vercel, and Next has been on our
radar for a while. In this article, I’ll let you know why the latter made us
ditch our BFF.

Best friend you say? If you, like me, grew up in the 90s, the term BFF has
probably only one meaning in your head: Best Friends Forever. In the last couple
of years however, the microservice community has put an effort into claiming and
rebranding this term as Backend For Frontend.

<!-- more -->

**For Otovo’s case, that means a small Express.js server that renders the React
application customers use to calculate the solar potential of their house.**

My BFF is a server I’ve had a close relationship with since we started building
Otovo in 2016. There’s been good times and bad times. Moments of joy and moments
of despair: I remember the first time we server-side rendered FAQ articles
fetched from [Sanity](https://www.sanity.io/) (our headless CMS). I was so
proud!

I also remember the time we found out that a small change in our Babel
configuration made it stop code-splitting Javascript files. For months(!)
customers had to download and parse one large chunk of JavaScript instead of the
usual 86 smaller chunks. Likewise, my colleagues and I waited ever longer for
our code to compile, totally unaware of what was happening under the hood. When
we uncovered this, I was deeply disappointed – it felt like a betrayal from a
very good friend.

Through the last four years, this is just one of many similar issues we’ve run
into. Sometimes severe, other times just annoying. This has affected both the
mental health of our developers as well as our business. Little by little,
issues like this eat away time and focus.

You might think it’s a bit unfair for me to blame our DIY “best friend” for
this; after all – I was the one who changed that Babel configuration. But over
time, it feels like a promise was broken: Our BFF wasn’t supposed to be big and
complicated. All the difficult stuff like estimating solar yield, find the most
optimal panel placement strategy, and find the cheapest installer in your local
area – was all supposed to be done by the big and heavy Python-backend. Our BFF
was supposed to be slim and easy to reason about. A helpful hand in my everyday
work, a reliable helper. But now I realize how fragile it was.

**I was supposed to build a product that made solar attractive, you were
supposed to build JavaScript code. Together we were going to save the world.
Well, it didn’t turn out that way. It feels more like I’m spending time in a
nursing home; attending daily care and making sure you’re alright.**

This has to end. Now.

I recently found a new friend. After careful consideration, is time to let the
old one go. I first met Next.js through a [side-project](https://46brew.app/),
and my new friend can do both kickflip and backflip. The amazing team behind
Next builds features we could only dream of:

- ♿️ Automatically polyfill methods not supported in older web browsers.
- 🏎 Reliable and fast Hot module reloading.
- ✨
  [Automatic optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization)
  of pages that can be rendered statically.

Also, they collaborate closely with core developers from
[both React](https://nextjs.org/blog/next-9-4#fast-refresh) and the
[Chrome browser](https://nextjs.org/blog/next-9#google-chrome-collaboration)
teams. I would never in my wildest dreams have the capacity to implement
features like this nor do I have the network to get in touch with said core
developers. All of this makes Next.js a better choice for both customers and the
product developers at Otovo. Next provide both groups with the fastest and best
experience. The frosting on the cake? The source code is open and available at
Github.

I can still fetch FAQ articles from Sanity, but I avoid doing stupid and costly
mistakes in my Babel and Webpack setup. Customers can still check their roof’s
solar potential, but they do it with less code and fewer CPU cycles. And to the
skeptics out there, I admit that Next.js isn’t
[without flaws](https://github.com/vercel/next.js/issues/8592) and has some
[shortcomings](https://github.com/vercel/next.js/issues/1852), but after 4 years
of stress and agony, Next.js is way better than our DIY alternative – trust me!

Dear old friend, thank you for everything! 👋 I look forward to a brighter
future 😎

---

If you want to chat more about Next.js, Otovo, or best friends – please reach
out to [@rix1](https://twitter.com/rix1) on Twitter. Thanks for reading!

_This post is an English translation of an article published
[in Kode24](https://www.kode24.no/guider/derfor-dumpet-vi-bff-en-var-for-nextjs/72625175),
an online newspaper for Norwegian developers._
