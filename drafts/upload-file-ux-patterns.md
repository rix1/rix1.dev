---
title: Upload file UX patterns and implementation details
topic: Build
description: Three iterations on building a small avatar upload interaction with native file inputs.
date: 2021-11-29
draft: true
---

> [!NOTE] Internal notes
> - Recover or recreate the missing screenshots/GIFs.
> - Finish the third iteration and add a clear recommendation at the end.
> - Re-test the file input patterns against current browser behavior and
>   accessibility expectations.
> - Recommendation: Position this as a pattern comparison for frontend builders:
>   the value is not the avatar feature itself, but the tradeoff between native
>   semantics, styling control, accessibility, and implementation complexity.

> Draft imported from Notion. The original has screenshots/GIFs that still need
> to be moved into the site, and the third iteration currently stops
> mid-thought.

While creating Gifty.lol we wanted users to be able to upload an avatar to their
profile. As I quickly discovered, there are a lot of different ways to solve
this, but with vastly different technical and UX implementations. In this post,
I'll explain the different technical and UX approaches I considered and what we
ended up considering the best way to solve this.

_Note: we used Supabase as a backend, which has support for file/object storage.
Because of these Supapowers, this post mostly revolves around UI, UX, and
frontend implementation._

First a bit of background: Gifty.lol is a service that simplifies the
coordination of giving gifts. Our goal is to bring joy into gift giving again.

In the app, you have a simple profile page where you can update your name and
add a photo of yourself.

This avatar is used throughout the application as an indicator of ownership for
different things. We didn't want to spell out users' names or emails everywhere,
and figured a photo would be an easy way communicate which users participated in
activities or owned different elements.

What follows is three different approaches and how we would go about solving
them.

## 1st iteration: styling `<input type="file" />` as a button

My initial thought went like this: "I know the browser has a neat way of
interacting with the file system simply by using _the platform_. Let's use
that." This has the benefit of being semantic and hopefully quite easy for
screen readers to pick up on.

By default a raw `<input type="file" />` will look something like this,
depending on your browser. Not exactly what I wanted to go for, so after a bit
of searching I found a pattern to style the input element as an upload icon.

First, you need to hide the "Choose file" button. This can be done by setting
its visibility to hidden:

```css
.avatar-upload {
  &::-webkit-file-upload-button {
    visibility: hidden;
  }
}
```

This removes the button, but the "No file chosen" text is still there. We can
visually hide that by setting its color to `transparent`. Great, we now have a
hidden input field that will open the file explorer on the client.

To make the input field look like an icon, I created a new `::before` pseudo
class and styled it to match the icon.

This worked. I was happy with the result, so I committed, closed my laptop, and
went to bed.

## 2nd iteration: transparent input overlay

After sleeping on it, there were some things I didn't like with my initial
approach:

1. The `background-image: url(...)` thing didn't feel great, and a lot of values
   were hand-crafted to make it look good.
2. Hiding the button and text by using a vendor-specific prefix didn't feel good
   either.
3. If users didn't click the small upload icon, I had no easy way of making
   other visual elements trigger the file input.

So I wondered: what if I just wrap the previous UI components in a `<div>` and
place an absolute-fill input element inside it with opacity set to 0?

```tsx
<Box css={{ position: "relative" }}>
  <Avatar>
    <UploadIcon className="icon" />
  </Avatar>
  <input
    type="file"
    accept="image/png, image/jpeg"
    onChange={(event) => uploadAvatar(event)}
    style={{
      opacity: "0",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }}
  />
</Box>;
```

We still keep the semantic HTML element, but instead of hacking our way through
with pseudo elements, we can make the visible elements non-interactive and have
an invisible input field overlay them with its mighty click handler.

This already cleans up the code while also solving the issues I had with the
first iteration.

## 3rd iteration: the best of both worlds?

After some more sleeping I had a small concern about the accessibility of this
visually hidden input element. What if people didn't understand that they could
click it? What if we wanted a visible focus state? What if the cleanest answer
is not "hide the input better", but to make the relationship between the visual
button and native input explicit?

## TODO

- Move the original screenshots/GIF into a draft-local asset folder.
- Finish the third iteration.
- Add the final chosen implementation and accessibility notes.
