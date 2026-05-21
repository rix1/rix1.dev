---
title: A dive into statically vs server rendered web pages
topic: Tech
description: Notes on choosing deliberately between static rendering, server rendering, and client-side placeholders.
date: 2026-05-19
draft: true
---

> [!NOTE] Internal notes
> - Update framework references and terminology before publishing.
> - Link this explicitly to the BFF/Next.js post as historical background.
> - Add a conclusion with current guidance: when static, server, or client-side
>   rendering is the pragmatic choice.
> - Recommendation: Make this less a taxonomy and more a decision guide; readers
>   already know rendering modes exist, but they need help seeing which tradeoff
>   they are actually buying in performance, complexity, and operational control.

> Draft imported from Notion. Needs light anonymization, a pass over old
> framework references, and a clearer connection to the later BFF/Next.js post.

# What does it mean for a page to be _statically rendered_?

How does this differ from _server rendered_ pages? And why should we care?

The initial `otovo-web` site was set up in 2016 as a single page React
application served by an Express server. This server rendered and returned a
single page with a script tag linking to a single JavaScript bundle. When the
bundle was loaded on the client, `react-router` handled all routing between
subsequent pages. No further requests were made to the server on route
navigation. This is known as a single page application, or SPA for short.

As we got more and more pages, the single bundle eventually grew too big. So we
introduced `react-loadable` which we combined with `react-router-v4` to serve
individual bundles per route. A bundle now represents a single page, which
contains references to other pages by using links.

When clicking a link to a new page, we ask the server for the corresponding
bundle to that page. This sounds oddly familiar, doesn't it? After some digging
I found some [random guy on Twitter](https://twitter.com/timberners_lee) that
described our situation pretty well:

> A set of documents and resources identified by URLs linked by hypertext links.

**Quick disclaimer**: You might wonder why I use this strange term, _statically
rendered_, for something we've been doing for 30 years. Well, in 2018 many of us
are writing and building websites using JavaScript. These programs can often
output HTML. When I say "rendering", I refer to the process of converting
JavaScript into HTML, not rendering in the browser.

This definition from the early 90s describes the World Wide Web. It seems we've
gone full circle, only swapping `document.html` for `bundle.js`. Why is this?
Does it have to be like this, or can we do any better?

## The differences

One big difference is that _statically rendered_ content can be served straight
off of any file hosting service, like GitHub Pages or Amazon S3, or an ordinary
file based web server like
[Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/).
By _server rendered_ content, on the other hand, we use a customized server that
knows how to generate the HTML response on the fly, as requests come in.

Another way of looking at it: static rendering is _eager_, while server
rendering is _lazy_. Static rendering happens at build time while server
rendering happens on demand as the requests are processed by the server.

## Static rendering

> When you know all your site's routes ahead of time, static content is king.

With static content you can afford to put more effort into optimizing the
content in advance, as this only happens once, at build time. In addition,
static content can be served immediately as the requests come in. These
qualities make it crazy fast.

From this definition, there are pages that are obvious candidates for this kind
of rendering strategy: marketing pages, terms, privacy pages, landing pages, and
other mostly stable content where the possible URLs are known in advance.

## Server-side rendering

> If you can't predict all possible URLs, the response changes based on who's
> viewing it, or the content quickly goes out of date, you need to render the
> page on the server.

Content that's rendered on the fly by the server has the advantage that it is
more flexible. You can respond to any requests the user makes, even the ones you
might not have expected. A few examples:

- Resolve language on the fly for each request based on domain or headers.
- Serve different content based on the current environment.
- Render pages whose content comes from an external API or CMS.

The trap is that many teams technically have server rendering, while the server
only renders a loading spinner. That feels more accidental than intentional.

So let's be intentional:

> Our strategy is to fetch customer-tailored API data on the client. Everything
> else should be rendered on the server, using placeholders with loading
> indicators where applicable.

With this strategy in mind, pages with user-tailored content can still be
rendered statically if the unique state lives in the client and the URL no
longer needs to identify every possible personalized resource.

## What should we do?

It doesn't have to be one or the other. Except from the potential performance
gain, there's nothing static rendering provides that we don't get with server
rendering. In fact, when a CDN sits between your application server and end
users, you can enjoy some of the benefits static rendering provides even when
the page is generated by a server.

Still, it can be surprising to see that many of the pages with the most traffic
can be built and served statically. This realization is useful when improving
performance.

Hopefully there's something valuable captured along the lines of this post. If
anything, I hope it helps us be more intentional and deliberate in how we build
fast, smooth customer-facing web products.

## Bonus: What about authenticated routes?

I have omitted authenticated routes from the discussion as they don't have the
same SEO or social preview requirements.

## TODO

- Decide whether to keep the historical Otovo framing or generalize the post.
- Add one diagram for build-time rendering vs request-time rendering.
- Consider linking this to the BFF/Next.js post as the earlier mental model.
