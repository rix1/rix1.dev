---
title: Webpack, code splitting and SSR
topic: Tech
description: A walkthrough of how webpack, Babel and React Loadable powered
  code splitting and server-side rendering at Otovo in 2018.
date: 2018-08-05
---

> _**Editor's note (August 2026):** I wrote this in August 2018, while working
> on the Otovo web app, and posted it as a gist for my colleagues with the note
> «dev-blog any1??1 😄». It never made it to an actual blog – until now, eight
> years later, when I finally dug the gist up again. I've fixed typos and
> written the intro and ending it never got (the original starts mid-thought
> and trails off into a `TODO!`), reconstructed from the app's actual source
> code as it looked the week the gist was written. Otherwise it's untouched – Webpack, React Loadable and
> server-side rendering as they were in 2018 – and published retroactively
> under its original date._

Here's a question: when you write `() => import('./LandingPage')`, do you actually know what happens next? I didn't. Not really. And that started to bug me, because everything at otovo.no depends on it: our app is server-side rendered and code-split, meaning Webpack, Babel and React Loadable conspire on every single request to make sure visitors only download the JavaScript they actually need. When this machinery works, nobody notices it. When it breaks – a spinner that never disappears, a page that flashes, a bundle that refuses to load – you're suddenly debugging «magic» nobody on the team fully understands.

That felt like a bad place to be. So I sat down and traced the whole thing, from source files to rendered page. This is that walkthrough, in three acts: what happens at build time, what happens on the server for every request, and what happens in the browser.

## Build phase

### Babel

The first thing that happens is that Webpack gathers all JS files and transpiles them with Babel. Babel does a couple of things for us:

- Transpile syntax (ES6 -> ES5 etc)
- Convert JSX to plain Javascript functions 
- Strip away the FlowType parts of the code (type annotations, comments etc)
- The `react-loadable/babel` plugin finds every usage of Loadable (these are typically used in our route config files) and adds some options that make Webpack able to do some magic later on.

The options added by the Babel plugin look like this:

```js
// norwegianRoutes.js
{
	path: '/',
	component: Loadable({
		loader: () => import('../apps/LandingPage/LandingPage'),
		loading: LoadableCenterSpinner,
		// options added to every Loadable call by Babel:
		modules: ['../apps/LandingPage/LandingPage'],
		webpack: () => [require.resolveWeak('../apps/LandingPage/LandingPage')]
	}),
}
```

### Webpack

Whenever Webpack sees a dynamic import it automatically splits the imported module into a separate bundle. Btw, dynamic imports use the following syntax:

- `() => import('./someModule')` 
- `import('someModule').then()` 

This is different from the classic static imports:

- `import someModule from './someModule'`.


Remember those options Babel added? We've set up a Webpack plugin that sees the added `webpack` option and uses it to store information on all dynamically loaded modules in a file called `react-loadable-manifest.json`. This file lets our app know in which bundles the different components are stored in. Here's an extract:

```json
// ./dist/react-loadable-manifest.json
"../apps/LandingPage/LandingPage": [
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "9.css"
},
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "9.js"
},
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "25.css"
},
{
	"id": "./src/apps/LandingPage/LandingPage.js",
	"name": "./src/apps/LandingPage/LandingPage.js",
	"file": "25.js"
}
],
```

Welp, that's a lot of build stuff... Don't worry: I'll walk you through how this enables our app to decide what bundles should be loaded when a given component is rendered, and show you the secret recipe that makes magic happen 🤫

However, if you're curious about what happens after Webpack collects, parses and runs plugins on _the server bundle_ – read on:

## Stuff that happens on the server

### Express (web server): 

The server is invoked and started in `index.js`. It uses Loadable's `preloadAll()` method to make sure all code-splitted components are already loaded when the server tries to render them. When the preloading is done it starts the Express server that we import from `app.js`

### App.js
`app.js` configures the Express server. Most noteworthy are: 

- Configure ENV variables and set sane defaults.
- Security: It forces SSL and creates CSP directives.
- Assets: Figures out what bundles to use (dev or prod), configure static assets with correct caching strategy.
- Login: Adds OAuth endpoint for login.
- Domain/Market: It figures out which domain that was requested (currently NO or SE) and sets correct market.
- Lastly, it instantiates `page.js` by running `createMiddleWare()`...


### Page.js

`page.js` returns a function that accepts Express' (req, res) parameters. It takes the URL requested in the request object (`req`) and passes it along to React-land (more on that later). It takes the (real) root component, and renders it to a string with `renderToString()`. This string is concatenated with a `<!DOCTYPE html>` and returned by Express to the client making the request. 

_Trivia: The fact that this is the only endpoint Express sets up (apart from OAuth's `/id/login` route) means that any request will, in theory, return the «same» HTML «file» (it's not a file, it's a string lol) – making this a so-called SPA (Single Page Application) ✌️_


### React, React Loadable and SSR:

On every Express request, the React app is set up with the `renderToString()` method mentioned above. More details on this later, but the important part is that react-router is invoked. The router receives the requested path along with our already defined routes. It matches the path to a route which (usually) resolves in a `<Loadable />` component, like so: 

```js
// some route file e.g. norwegianRoutes.js
{
	path: '/',
	component: Loadable({
		...
	}),
}
```

_Trivia: In our `*routes.js` files, Loadable is not invoked as a JSX component, but as a regular JavaScript function. These two syntaxes are functionally equal because JSX is just syntactic sugar for calling `React.createElement()`. This means that `<MyComponent someProp={1} />` is just translated to `React.createElement('MyComponent', {someProp: 1}, _children)` by the `babel-preset-react` plugin_

Under the hood, when Loadable is mounting, it invokes a `report()` method provided to it by context from `<Loadable.Capture report={callBackFn} />`.

Remember the Babel plugin that added `modules: ['../apps/LandingPage/LandingPage'],` as _«options»_ to Loadable earlier? Well, now you know that these options were just props containing the file paths to the module, and when the component mounts it just loops over the file paths in the `modules` prop and calls `report(moduleName)` method that was supplied through context.

Why am I telling you all this? Because with the section below, you now know all the magic behind our code-splitting, bundle-loading server-side rendering! 🎉

Okay, so let's jump back to where everything is initially set up in `page.js`. When a request comes in, we instantiate an empty array for keeping track of which modules that will be rendered: `const modules = [];` The `report` prop in React.Loadable passes down to it's `<Loadable />` children just adds all the reported module names to this array:

```jsx
// page.js
<Loadable.Capture report={moduleName => modules.push(moduleName)}>
```

After we've rendered our React tree to a string, we now have a complete overview of which component file paths that will be rendered for this given request! It's all safely stored in the `modules` array. Now, we're all set up for the final act: [The Prestige](https://www.youtube.com/watch?v=fU0uiGAm_SY)... 

Remember that weird `react-loadable-manifest.json` file that Webpack prepared for us? Given a file path, it shows you all the bundles that component depends on. Well, we just happen to have all the file paths that we are rendering! We call a simple method and there we have it:

```js
// page.js
const webpackBundles = getBundles(reactLoadableManifest, modules);
```

Now, we're just 3 easy steps away from achieving our hopes, dreams and everything else SSR-related:

1. Filter out non-js entries and map to bundle file name instead of component file path. (What about those `.css` entries? We just drop them here – the global stylesheet gets its own `<link>` tag, and chunk CSS is picked up by Webpack's runtime when the chunk loads in the browser.)
2. Include our common bundle (All non-Otovo code basically – React, Redux polyfills etc)

```js
// page.js
const allJsBundles = [
	...webpackBundles
	.filter(bundle => bundle.file.endsWith('.js'))
	.map(bundle => bundle.file),
	...jsBundles,
];
// => [ '10.js', 'commons.js']
```

3. Finally, we map through this array, join the bundle names with the path to our static folder (that Webpack has been nice enough to compile together for us) and create script tags that we include in the HTML response: 

```js
{jsBundles.map(js => <script key={js} src={`/assets/${js}`} />)}
```

There you have it! Kinda. I guess. It's WIP ok??? 

## Stuff that happens on the client

Ok, so let's start at [the beginning](https://www.youtube.com/watch?v=JqHaJkIvz0Q). A browser requests the URL http://otovo.no/. Then all sorts of shit happens. Stuff travels through a metric shit ton of tubes, stopping at intersections, being ACK'd and checksummed through wires and boxes, meeting the whole gang: DNS servers, countless gateways, load balancers and CDNs. It finally/hopefully 🤞 finds its way to a data center where the correct port 🚪 is open. This metaphor/approximation of a network request makes a brief stop at the VM going through the loops and hoops I described in the previous section, before it's returned to the client as plain HTML.

This HTML contains a few links to scripts that the poor client has to ask for again. Luckily, because these links are at the bottom of the `<body>` tag, the browser can render the HTML right away, making the page visible to the end user. Yay for SSR 🙌 However, it still requests and loads the JS scripts, continuing the examples from the previous section: `10.js` and `commons.js`. When `commons.js` is loaded it attaches a bunch of things to the window and actually replaces everything that is contained within the DOM-node `<div id="root" />`, right before the user's eyes – how rude.

When `10.js` is finished loading it will add itself to an array on `window.webpackJsonp`, which contains all the bundles available.

From what I can read, it should be really important that the bundle script tags are not async and that `commons.js` is loaded last. This is because it picks up bundles from the `window.webpackJsonp` chunk array that I mentioned earlier.

Okay, so chunks are downloaded and they push themselves onto an array on `window.webpackJsonp`... `commons.js` reads all of these and runs the code in `./src/index.js` (this is the entry point in Webpack's client bundle). This is the code that will be discussed in the following sections. But for now we need only to know that this code is sneaky because it replaces pretty much everything the user is seeing on the fly by replacing the content of the node with `id="root"` 🕵️‍♀️.


_Tip: I actually recommend skimming through the first 100 or so lines of `commons.js` and the first 10 lines in a random chunk, e.g. `10.js`. `commons.js` starts with «webpackBootstrap», which sets up everything and gets the different chunks (just another name for bundles) from the window array._

### That webpackBootstrap thingy

Turns out that webpackBootstrap thingy is Webpack's _runtime_ – a small program that Webpack writes for us and injects at the top of `commons.js`. It has one job: bookkeeping. It keeps track of two things:

1. **Modules** – every module that has been executed is stored in a cache (`installedModules`), and Webpack's own require function (`__webpack_require__`) checks this cache first. Requiring a module twice never runs it twice.
2. **Chunks** – an object called `installedChunks` that knows the loading state of every chunk: loaded, loading (a Promise), or not requested yet.

And here's the party trick 🎩: remember how the chunks push themselves onto `window.webpackJsonp`? When the runtime boots, it first processes everything already sitting in that array – and then it _replaces the array's `push` method with its own function_. Any chunk that arrives later isn't really pushing to an array; it's calling straight into the runtime, which registers the chunk's modules and flips its state to «loaded». This is why the script tags must not be async and `commons.js` must be loaded last: chunks can arrive in any order they want, but the runtime has to boot after them to pick up what's already there.

Dynamic imports run through the same machinery. That innocent-looking `() => import('../apps/LandingPage/LandingPage')` in our route config? Webpack compiled it into a call to `__webpack_require__.e(10)` – «ensure chunk 10 is loaded». If `installedChunks` says it's already there: resolve immediately. If not, the runtime creates a `<script>` tag pointing at `/assets/10.js`, appends it to the document, and returns a Promise that resolves when the chunk calls back in through that hijacked `push`. That's it. All the magic of code splitting boils down to a script tag and a Promise ✨

### The final act: render() (no, not hydrate())

Earlier I said that the client «replaces pretty much everything the user is seeing» – and I meant that literally. Here's what actually happens in `./src/index.js`:

```js
// src/index.js (simplified)
Loadable.preloadReady()
	.catch(error => {
		logSentryError(
			error,
			'Preload ready failed. SSR will not work as expected.',
		);
	})
	.then(() => {
		render(
			<Root store={store}>{renderRoutes(getRoutes(market))}</Root>,
			document.getElementById('root'),
		);
	});
```

Two things worth noticing here.

**`preloadReady()`** is the client-side twin of the `preloadAll()` call we saw on the server. Where `preloadAll()` loads _every_ code-splitted component before the server starts listening, `preloadReady()` only preloads the ones needed for _this_ page – the ones whose chunks the server so kindly put in the HTML as script tags. Without it, the first client render would paint a bunch of `LoadableCenterSpinner`s (the chunks are downloaded, but React Loadable hasn't flagged them ready yet) – a lovely flash of spinners replacing a fully rendered page. With it, the re-render produces the same UI the server sent, and the user (hopefully) never notices the swap.

**`render()`** – sharp-eyed React 16 people might ask: why not `hydrate()`? Hydration walks the server-rendered markup and attaches event listeners to it instead of rebuilding the DOM – much politer than replacing everything. And we did use it! Until three days ago 😅 We kept getting DOM-mismatch warnings that hydration couldn't explain (see [facebook/react#12063](https://github.com/facebook/react/pull/12063) and [#10085](https://github.com/facebook/react/issues/10085)), so we've switched back to a full re-render until that improves. So yes: right now the client throws away the server's beautiful markup and builds it all again. How rude, indeed.[^1]

So, the full circle: Babel annotates our Loadable components → Webpack splits them into chunks and writes a manifest → the server renders the page, collects the rendered modules and puts the right script tags in the HTML → the chunks register themselves on `window.webpackJsonp` → the runtime in `commons.js` boots and does its bookkeeping → `preloadReady()` waits for the chunks we know we need → `render()` takes over the page.

There you have it! For real this time 🎉

[^1]: _2026 note:_ «until that improves» took a while – `hydrate()` came back in May 2019.
